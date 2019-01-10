const config = require('../config');
const crypto = require('crypto');
const util = require('util');
const cryptoPbkdf2 = util.promisify(crypto.pbkdf2);

async function generateid(len = 5, smallChar = true, bigChar = true, num = true) {
    let strid = '';
    let patern = '';
    if (smallChar) {
        patern += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (bigChar) {
        patern += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (num) {
        patern += '0123456789';
    }

    for (let i = 0; i < len; i++) {
        strid += patern.charAt(Math.floor(Math.random() * patern.length));
    }

    return strid;
}

async function hashPassword(password, salt, iterations, hashLength) {

    salt = salt || config.pass.SALT;
    iterations = iterations || config.pass.ITERATIONS;
    hashLength = hashLength || config.pass.HASH_LENGTH;
    return (await cryptoPbkdf2(password, salt, iterations, hashLength, 'sha512')).toString();

}

async function passwordIsValid(password, hashPwd, salt, iterations, hashLength) {

    salt = salt || config.pass.SALT;
    iterations = iterations || config.pass.ITERATIONS;
    hashLength = hashLength || config.pass.HASH_LENGTH;
    let hash = (await cryptoPbkdf2(password, salt, iterations, hashLength, 'sha512')).toString();
    return hash === hashPwd;

}

async function initResData(description, input) {
    return {
        okay: false,
        description,
        output: [],
        input
    }
}

async function broadcastByLogin(login, notSend, route, act, res) {

    const jrfws = require('../app').jrfws;

    for (let client of jrfws.wss.clients) {

        if (client.login !== login || client === notSend) {
            continue;
        }

        await client.sendMes(res, route, act);

    }

}

module.exports = {
    generateid,
    hashPassword,
    passwordIsValid,
    initResData,
    broadcastByLogin
};