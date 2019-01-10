const middleware = require('../middleware');
const tasks = require('../models/tasks');
const config = require('../config');

async function add(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    let res = await middleware.initResData('invalid data tasks add', data.data);

    let task = {};
    if (data.data) {
        task = data.data;
    }

    if (task.hashPassword) {
        task.password = task.hashPassword;
    } else {
        task.password = await middleware.hashPassword(task.password);
    }
    task.glObj.settings.password = task.password;
    task.glObj.settings.login = task.login;

    let resTasks = await tasks.add(task);
    if (!resTasks.okay) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    res.okay = true;
    res.description = '';
    res.output = resTasks.output;
    await data.client.sendMes(res, data.route, data.act);

}

async function get(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    let res = await middleware.initResData('invalid data tasks get', data.data);

    let task = {};
    if (data.data) {
        task = data.data;
    }
    let resTasks = await tasks.get(task);
    if (!resTasks.okay) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    res.okay = true;
    res.description = '';
    res.output = resTasks.output;
    await data.client.sendMes(res, data.route, data.act);

}

async function edit(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    let res = await middleware.initResData('invalid data tasks edit', data.data);

    let task = {};
    if (data.data) {
        task = data.data;
    }
    if (task.glObj.settings.newPassword) {
        let newPassword = task.glObj.settings.newPassword;
        task.password = newPassword;
        task.glObj.settings.password = newPassword;
        task.glObj.settings.newPassword = '';
    }

    let resTasks = await tasks.edit(task, task);
    if (!resTasks.okay) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    res.okay = true;
    res.description = '';
    res.output = resTasks.output;
    await data.client.sendMes(res, data.route, data.act);
    await require('../middleware').broadcastByLogin(data.client.login.toLowerCase(), data.client, data.route, 'get', res);

}

async function del(data, stop) {

    if (!config.BACKEND) {
        await stop();
        return;
    }

    let res = await middleware.initResData('invalid data tasks del', data.data);

    let task = {};
    if (data.data) {
        task = data.data;
    }
    let resTasks = await tasks.del(task);
    if (!resTasks.okay) {
        await data.client.sendMes(res, data.route, data.act);
        await stop();
        return;
    }

    res.okay = true;
    res.description = '';
    res.output = resTasks.output;
    await data.client.sendMes(res, data.route, data.act);

    await require('../middleware').broadcastByLogin(data.client.login.toLowerCase(), data.client, 'login', 'logout', res);
}

module.exports = {
    add,
    get,
    edit,
    del
};