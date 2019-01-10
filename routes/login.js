const middleware = require('../middleware');
const tasks = require('../models/tasks');
const config = require('../config');

async function login(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    let res = await middleware.initResData('invalid login', data.data);

    if (!data.data) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }
    let user = data.data;

    if (!user.login || !user.password) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }
    user.login = user.login.toLowerCase();

    let resTasks = await tasks.get(user);
    if (!resTasks.okay || !resTasks.output.length) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    let hashPass = resTasks.output[0].password;
    if (!hashPass) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    let isConfirm = await middleware.passwordIsValid(user.password, hashPass);
    if (!isConfirm) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    data.client.login = user.login;

    res.okay = true;
    res.description = '';
    res.output.push(resTasks.output[0]);
    await data.client.sendMes(res, data.route, data.act);
    await stop();

}

async function confirmUser(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    if (data.act === 'add') {
        return;
    }

    let res = await middleware.initResData('invalid login', data.data);

    let task = {};
    if (data.data) {
        task = data.data;
    }
    task.login = task.login.toLowerCase();

    let resTasks = await tasks.get(task);
    if (!resTasks.okay || !resTasks.output.length) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    let hashPass = resTasks.output[0].password;
    if (!hashPass) {
        return;
    }

    let isConfirm = task.password === hashPass;
    if (!isConfirm) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    data.client.login = task.login;

}

async function passIsValid(data, stop) {

    let res = await middleware.initResData('invalid password', data.data);

    let isConfirm = await middleware.passwordIsValid(data.data.password, data.data.hashPassword);
    if (!isConfirm) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    res.okay = true;
    res.description = '';
    await data.client.sendMes(res, data.route, data.act);
    stop();

}

async function isBackend(data, stop) {
    await data.client.sendMes(config.BACKEND, data.route, data.act);
    await stop();
    return;
}

async function encode(data, stop) {
    let encodePass = await middleware.hashPassword(data.data);
    await data.client.sendMes(encodePass, data.route, data.act);
    await stop();
    return;
}

async function changePassword(data, stop) {

    let res = await middleware.initResData('Password not change', data.data);

    if (!data.data.hashPassword
        || !data.data.curPassword
        || !data.data.newPassword
        || !data.data.confirmPassword
        || data.data.newPassword !== data.data.confirmPassword) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    let isConfirm = await middleware.passwordIsValid(data.data.curPassword, data.data.hashPassword);
    if (!isConfirm) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    let hashNewPassword = await middleware.hashPassword(data.data.newPassword);
    res.okay = true;
    res.description = '';
    res.output.push(hashNewPassword);
    await data.client.sendMes(res, data.route, data.act);
    stop();

    if (config.BACKEND) {
        await require('../middleware').broadcastByLogin(data.client.login, data.client, data.route, data.act, res);
    }

}

module.exports = {
    login,
    confirmUser,
    passIsValid,
    isBackend,
    encode,
    changePassword
};