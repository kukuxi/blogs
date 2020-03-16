const express = require('./LikeExpress');

// 创建express实例
const app = express();
app.use((req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
})
// 测试 app.use
app.use((req, res, next) => {
    console.log('模拟cookie处理')
    req.cookie = {
        id: '123'
    }
    next()
})

app.use('/api', (req, res, next) => {
    console.log('path in use');
    res.json({
        data: ['a', 'b', 'c']
    })
    next()

})

// 测试app.get
app.get('/api', (req, res, next) => {
    console.log('进入get请求:', req.method, req.url);
    next()
})

// 测试app.post
app.get('/api', (req, res, next) => {
    console.log('进入post请求:', req.method, req.url);
    next()
})

function testMiddleware(req, res, next) {
    console.log('进入中间件')
    if (req.cookie.id) {
        next()
        return;
    }
    console.log('没有ID')
}
// 测试中间件
app.get('/api/user', testMiddleware, (req, res, next) => {
    console.log('处理完中间件，此时url = /api/user', req.method)
})
// 测试app.listen
app.listen(3000, () => {
    console.log('port is 3000')
})