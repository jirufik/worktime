let production = {
    PORT: 3010,
    BACKEND: false,
    DBHOSTNAME: 'localhost',
    DBNAME: 'jrfworktime',
    DBPORT: 26000,
    DBUSER: '',
    DBPASS: '',
    pass: {
        SALT: 'XG&9w@%dk)0',
        ITERATIONS: 10000,
        HASH_LENGTH: 64
    }
};

let development = {
    PORT: 3010,
    BACKEND: true,
    DBHOSTNAME: 'localhost',
    DBNAME: 'jrfworktime_test',
    DBPORT: 26000,
    DBUSER: '',
    DBPASS: '',
    pass: {
        SALT: 'XG&9w@%dk)0',
        ITERATIONS: 10000,
        HASH_LENGTH: 64
    }
};

module.exports = (() => {
    if (process.env.NODE_ENV === 'production') {
        return production;
    }
    return development;
})();