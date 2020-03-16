const http = require('http');

function compose(middlewareList) {
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i];
            try {
                return Promise.resolve( // 保证返回的是一个promise
                    fn(ctx, dispatch.bind(null, i + 1))
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}
class LikeKoa {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn);
        return this; // 实现链式调用
    }

    handle(ctx, fn) {
        return fn(ctx)
    }
    createContext(req, res) {
        const ctx = { response: res, require: req } //简化了koa中的ctx
        return ctx;
    }
    init() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handle(ctx, fn)
        }
    }
    listen(port) {
        const server = http.createServer(this.init());
        server.listen(port)
    }
}

module.exports = LikeKoa