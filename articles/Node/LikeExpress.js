const http = require('http');
/*
参考underscore，使用局部变量保存一些方法或者属性，
1. 避免冗长的代码书写
2. 减少对象成员的深度访问，提高性能
*/
const slice = Array.prototype.slice;
const concat = Array.prototype.concat;
class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routers = {
            all: [], // app.user(...)
            get: [], // app.get(...)
            post: [], // app.post(...)
        }
    }

    register(path) {
        const event = {};
        if (typeof path === 'string') {
            event.path = path;
            // 除了第一个参数path以外的参数，转换成数组存入queue中
            event.queue = slice.call(arguments, 1)
        } else {
            event.path = '/';
            // 将参数转换成数组存入queue中
            event.queue = slice.call(arguments, 0);
        }
        return event;
    }

    use() {
        const event = this.register.apply(this, arguments)
        this.routers.all.push(event);
    }
    post() {
        const event = this.register.apply(this, arguments)
        this.routers.post.push(event)
    }
    get() {
        const event = this.register.apply(this, arguments)
        this.routers.get.push(event)
    }
    handle(req, res, matchedEventList) {
        const next = () => {
            // 拿到当前第一个匹配的中间件
            const middleware = matchedEventList.shift();
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next);
            }
        }
        next();
    }
    match(method, url) {
        let queue = []
        if (url === '/favicon.ico') {
            return queue;
        }
        const currenRouters = [].concat(
            this.routers.all,
            this.routers[method]
        );
        /*
        例如url='/api/test，可匹配的路径：
            1. '/'
            2. '/api'
            3. '/api/test'
        */
        currenRouters.forEach(event => {
            if (url.indexOf(event.path) === 0) {
                queue = queue.concat(event.queue)
            }

        })
        return queue;
    }
    init() {
        return (req, res) => {
            // 封装res.json方法
            res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data))
            }
            const { url } = req;
            const method = req.method.toLowerCase();
            const matchedEventList = this.match(method, url);

            this.handle(req, res, matchedEventList)
        }
    }
    listen(...args) {
        const server = http.createServer(this.init());
        server.listen(...args); // 需要结构参数
    }
}

module.exports = () => new LikeExpress();