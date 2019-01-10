const jrfdb = require('jrfdb');
const middleware = require('../middleware');

let tasks = {
    name: 'tasks',
    fields: {
        login: {
            description: 'Login',
            type: 'string',
            min: 3,
            require: true,
            unique: true
        },
        password: {
            description: 'Password',
            type: 'string'
        },
        glObj: {
            description: 'Global object',
            type: 'object',
            require: true
        },
        pomodoro: {
            description: 'Pomodoro',
            type: 'object',
            require: true
        },
        date: {
            description: 'Date',
            type: 'object',
            require: true
        }
    }
};

async function add(task) {

    task.login = task.login.toLowerCase();
    await delTempFields(task);

    let res = await require('./index').add({
        obj: {
            docs: task
        },
        schemeName: 'tasks'
    });

    return res;

}

async function get(task, taskIdOnly = false, withoutFields = []) {

    task.login = task.login.toLowerCase();
    let res = await require('./index').get({
        obj: task,
        idOnly: taskIdOnly,
        withoutFields,
        schemeName: 'tasks',
        fieldsForGet: ['_id', 'login']
    });

    return res;

}

async function edit(task, fields) {

    await delTempFields(task);
    task.login = task.login.toLowerCase();

    let res = await require('./index').edit({
        obj: task,
        fields,
        schemeName: 'tasks',
        fieldsForFind: ['_id', 'login']
    });

    return res;

}

async function del(task) {

    task.login = task.login.toLowerCase();
    let res = require('./index').del({
        obj: task,
        schemeName: 'tasks',
        fieldsForDel: ['_id', 'login']
    });

    return res;

}

async function hardReset() {
    let scheme = await jrfdb.getScheme('tasks');
    let res = await scheme.del({filter: {}, originalMethod: true});
}

async function delTempFields(task) {
    try {

        const arr = ['newPassword', 'curPassword', 'confirmPassword', 'hashPassword', 'hashNewPassword'];
        for (let field of arr) {
            if (task.hasOwnProperty(field)) {
                delete task[field];
            }
        }
    } catch (e) {

    }
}

module.exports = {
    tasks,
    add,
    get,
    edit,
    del,
    hardReset
};