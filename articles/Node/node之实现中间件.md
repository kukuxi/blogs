# 实现简易版的express中间件

## 思路

1. 找出几个主要方法的API
```js
app.use
app.get
app.post
app.listen
```
2. 实现一个LikeExpress类
```js
const http = require('http');
/*
参考underscore，使用局部变量保存一些方法或者属性，
1. 避免冗长的代码书写
2. 减少对象成员的深度访问，提高性能
*/
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        this.all = [];
        this.get = [];
        this.post = [];
    }

    use() { }
    post() { }
    get() { }
    listen() { }
}

module.export = () => new LikeExpress();
```
3. 实现一个register方法，工厂化各个方法
4. 注册各个事件
5. 实现listen
6. 在callback中对res封装
7. 获取需要执行的queue
8. 实现next


# 实现简易版的koa中间件
思路：
- 只涉及到app.use。app.use的作用是注册中间件并将其收集
- 实现next机制。与express不同的是，koa中的next是一个promise方法