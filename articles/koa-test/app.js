const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
    await next(); // 1
    const rt = ctx.response.get('X-Response-Time'); //6
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now(); //2
    await next(); //3
    const ms = Date.now() - start; //5
    ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
    ctx.body = 'Hello World'; //4
});

app.listen(3000);