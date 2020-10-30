module.exports = app => {
    app.post('/create', app.api.user.save)
    app.post('/savedacc', app.api.user.saveaccount)
    app.post('/login', app.api.login.login)
    app.get('/get', app.api.user.get)
    app.post('/getdate', app.api.user.getdatetoplay)
    app.post('/delete', app.api.user.remove)
    app.post('/reset', app.api.user.resetar)
}