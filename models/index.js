const jrfdb = require('jrfdb');
const config = require('../config');
const tasks = require('./tasks');

async function initDB() {

    await jrfdb.addScheme(tasks.tasks);

    let connect = {hostname: config.DBHOSTNAME, port: config.DBPORT, db: config.DBNAME};
    if (config.DBUSER) {
        connect = {
            hostname: config.DBHOSTNAME,
            port: config.DBPORT,
            db: config.DBNAME,
            user: config.DBUSER,
            pass: config.DBPASS
        };
    }
    await jrfdb.setConnection(connect);
    let res = await jrfdb.connect();
    if (!res) {
        throw new Error('Not init db');
    }

    return res;

}

/// -------- ADD Start --------

async function add(param) {

    // param:
    //   obj - obj add
    //   idUser - id user Creator doc
    //   schemeName - name scheme for add
    // generate for param:
    //   resData - add return

    param.resData = await initResData('add invalid',
        {
            obj: param.obj
        });
    return await runAdd(param);
}

async function runAdd(param) {

    let scheme = await jrfdb.getScheme(param.schemeName);
    let res = await scheme.add(param.obj);
    if (!res.okay || !res.output.length) {
        if (res.validation.length) {
            param.resData.description = res.validation[0].description;
        }
        return param.resData;
    }

    param.resData.okay = true;
    param.resData.description = '';
    param.resData.output = res.output;
    return param.resData;

}

/// -------- ADD Finish --------

/// -------- GET Start --------

async function get(param) {

    // param:
    //   obj - obj get
    //   schemeName - name scheme for get
    //   idOnly - not fill dbrefs docs, only id
    //   withoutFields - del fields in docs
    //   fieldsForGet - fields for find docs
    // generate for param:
    //   resData - get return
    //   query - query for get

    // param.withoutFields = param.withoutFields || await getWithoutFields();
    return await getDocs(param);

}

async function getDocs(param) {

    param.resData = await initResData('get invalid',
        {
            obj: param.obj,
            idOnly: param.idOnly
        });

    if (!param.obj) {
        return await getAllDocs(param);
    }

    if (param.obj && typeof param.obj === 'string') {
        return await getDocsByStringObj(param);
    }

    if (typeof param.obj === 'object' && Array.isArray(param.obj)) {
        return await getDocsByArrayObj(param);
    }

    if (typeof param.obj === 'object') {
        return await getDocByObjectObj(param);
    }

    return param.resData;

}

async function getAllDocs(param) {

    param.query = await createQueryObj({}, param.idOnly);
    return await runGet(param);
}

async function getDocsByStringObj(param) {

    let find = {
        $or: []
    };

    for (let field of param.fieldsForGet) {
        let findObj = {};
        findObj[field] = param.obj;
        find.$or.push(findObj);
    }

    param.query = await createQueryObj(find, param.idOnly);
    return await runGet(param);

}

async function getDocsByArrayObj(param) {

    let findDocs = await fillGetArray(param);
    if (!findDocs.length) {
        return param.resData;
    }

    let find = {
        $or: []
    };

    for (let field of param.fieldsForGet) {
        let findObj = {};
        findObj[field] = {
            $in: findDocs
        };
        find.$or.push(findObj);
    }

    param.query = await createQueryObj(find, param.idOnly);
    return await runGet(param);

}

async function getDocByObjectObj(param) {

    let find = {};

    for (let field of param.fieldsForGet) {

        if (param.obj[field]) {
            find[field] = param.obj[field];
            break;
        }

    }

    param.query = await createQueryObj(find, param.idOnly);
    return await runGet(param);

}

async function fillGetArray(param) {

    let findDocs = [];

    for (let obj of param.obj) {

        if (typeof obj === 'string') {
            findDocs.push(obj);
            continue;
        }

        for (let field of param.fieldsForGet) {

            if (typeof obj === 'object' && obj[field]) {
                if (typeof obj[field] === 'string') {
                    findDocs.push(obj[field]);
                    continue;
                }
                findDocs.push(obj[field].toString());
            }

        }

    }

    return findDocs;

}

async function runGet(param) {

    let scheme = await jrfdb.getScheme(param.schemeName);

    let res = await scheme.get(param.query, param.withoutFields);

    if (!res.okay || !res.output.length) {
        if (res.validation.length) {
            param.resData.description = res.validation[0].description;
        }
        return param.resData;
    }

    param.resData.okay = true;
    param.resData.description = '';
    param.resData.output = res.output;
    return param.resData;

}

async function createQueryObj(find, idOnly) {

    let obj = {
        query: {
            find
        }
    };

    if (idOnly) {
        obj.query.dbrefIdOnly = true;
    }

    return obj;
}

/// -------- GET Final --------

/// -------- EDIT Start --------

async function edit(param) {

    // param:
    //   obj - obj edit
    //   schemeName - name scheme for edit
    //   fields - edit fields
    //   idUser - id user Editor doc(s)
    //   fieldsForFind - fields for find edit docs
    // generate for param:
    //   resData - get return
    //   query - query for find edit doc(s)
    //   foundDoc - edit doc

    param.resData = await initResData('edit invalid',
        {
            obj: {
                obj: param.obj,
                fields: param.fields
            }
        });

    let query = await getQueryForEdit(param);
    if (!query.find) {
        return param.resData;
    }
    param.query = query;

    let foundDoc = await findEditDoc(param);
    param.foundDoc = foundDoc;

    return await runEdit(param);

}

async function getQueryForEdit(param) {

    let query = {};
    for (let field of param.fieldsForFind) {
        if (!param.obj[field]) {
            continue;
        }
        query.find = {};
        query.find[field] = param.obj[field];
        return query;
    }

    return query;

}

async function findEditDoc(param) {

    let scheme = await jrfdb.getScheme(param.schemeName);

    let obj = {
        query: {
            find: param.query.find,
            dbrefIdOnly: true
        }
    };

    let res = await scheme.get(obj);
    if (!res.okay || !res.output.length) {
        if (res.validation.length) {
            param.resData.description = res.validation[0].description;
        }
        return false;
    }
    let foundDoc = res.output[0];
    if (!foundDoc) {
        param.resData.description = 'Not found';
        return false;
    }

    return foundDoc;

}

async function runEdit(param) {

    let objEdit = {
        docs: {
            filter: {
                _id: param.foundDoc._id
            },
            fields: param.fields
        },
        idUser: param.idUser
    };

    let scheme = await jrfdb.getScheme(param.schemeName);
    let res = await scheme.edit(objEdit);
    if (!res.okay) {
        if (res.validation.length) {
            param.resData.description = res.validation[0].description;
        }
        return param.resData;
    }

    param.resData.okay = true;
    param.resData.description = '';
    param.resData.output = res.output;
    return param.resData;

}

/// -------- EDIT Final --------

/// -------- DEL Start --------

async function del(param) {

    // param:
    //   obj - obj del
    //   schemeName - name scheme for del
    //   fieldsForDel - fields for find del docs
    // generate for param:
    //   filter - filter for del
    //   resData - del return

    param.resData = await initResData('del invalid',
        {
            obj: param.obj
        });

    let filter = await createFilter(param);
    if (!filter) {
        return param.resData;
    }
    param.filter = filter;

    return await runDel(param);

}

async function runDel(param) {

    let scheme = await jrfdb.getScheme(param.schemeName);
    let res = await scheme.del({
        filter: param.filter
    });

    if (!res.okay) {
        if (res.validation.length) {
            param.resData.description = res.validation[0].description;
        }
        return param.resData;
    }

    if (!res.output.length) {
        param.resData.description = 'Car not del';
        return param.resData;
    }

    param.resData.okay = true;
    param.resData.description = '';
    param.resData.output = res.output;
    return param.resData;

}

async function createFilter(param) {

    if (!param.fieldsForDel) {
        return false;
    }

    if (!param.fieldsForDel.length) {
        return false;
    }

    for (let field of param.fieldsForDel) {
        if (param.obj[field]) {
            let filter = {};
            filter[field] = param.obj[field];
            return filter;
        }
    }

    return false;

}

/// -------- DEL Final --------

async function initResData(description, input) {
    return await require('../middleware/index').initResData(description, input);
}


module.exports = {
    initDB,
    add,
    get,
    edit,
    del
};