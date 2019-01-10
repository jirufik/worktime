const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.render('index');
});

module.exports = router;