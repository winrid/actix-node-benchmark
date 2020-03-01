let cluster = require('cluster');
if (cluster.isMaster) {
    let cpuCount = require('os').cpus().length;
    console.info('Master', process.pid, 'started with cpu count:', cpuCount);

    if (process.env['SINGLE_NODE_PLEASE']) {
        cpuCount = 1;
    }

    // Fork
    for (var i = 0; i < cpuCount; ++i) {
        console.info('Forking worker', i);
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
        console.error('Worker', worker.process.pid, 'died. Forking... code:', code, 'signal:', signal);
        cluster.fork();
    });
} else {
    console.info('Worker started');
    const createError = require('http-errors')
    const express = require('express')
    const path = require('path')

    var debug = require('debug')('app');

    const indexRouter = require('./routes/index')

    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({extended: false}))

    app.use('/', indexRouter)

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404))
    })

// error handler
    app.use(function (err, req, res) {
        // set locals, only providing error in development
        res.locals.message = err.message
        res.locals.error = req.app.get('env') === 'development' ? err : {}

        // render the error page
        res.status(err.status || 500)
        res.render('error')
    })

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
}

