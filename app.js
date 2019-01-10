const JRFWS = require('jrfws');
const Koa = require('koa');
const app = new Koa();
const jrfws = new JRFWS();
const config = require('./config');

const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

const index = require('./routes/index');

app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
    extension: 'html'
}));

async function init() {
    if (config.BACKEND) {
        await require('./models').initDB();
    }
}

init();

app.use(async ctx => {
    await ctx.render('index');
});

jrfws.attach(app);
jrfws.route('login', 'encode', async (data, stop) => {
    await require('./routes/login').encode(data, stop);
});
jrfws.route('login', 'isBackend', async (data, stop) => {
    await require('./routes/login').isBackend(data, stop);
});
jrfws.route('login', 'passIsValid', async (data, stop) => {
    await require('./routes/login').passIsValid(data, stop);
});
jrfws.route('login', 'login', async (data, stop) => {
    await require('./routes/login').login(data, stop);
});
jrfws.route('login', 'changePassword', async (data, stop) => {
    await require('./routes/login').changePassword(data, stop);
});
jrfws.route( async (data, stop) => {
    await require('./routes/login').confirmUser(data, stop);
});
jrfws.route('tasks', 'add', async (data, stop) => {
    await require('./routes/tasks').add(data, stop);
});
jrfws.route('tasks', 'get', async (data, stop) => {
    await require('./routes/tasks').get(data, stop);
});
jrfws.route('tasks', 'edit', async (data, stop) => {
    await require('./routes/tasks').edit(data, stop);
});

jrfws.route('tasks', 'del', async (data, stop) => {
    await require('./routes/tasks').del(data, stop);
});

app.listen(config.PORT || 3010);

module.exports = {
    jrfws
};

