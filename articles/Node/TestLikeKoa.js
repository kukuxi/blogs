const Koa = require('./LikeKoa');
const app = new Koa();

// logger
app.use(async (ctx, next) => {
    await next(); // 1
    const rt = ctx('X-Response-Time'); //6
    console.log(`${ctx.require.method} ${ctx.require.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now(); //2
    await next(); //3
    const ms = Date.now() - start; //5
    ctx['X-Response-Time'] = `${ms}ms`;
});

// response
app.use(async ctx => {
    ctx.response.end('Hello World');
});

app.listen(3000);