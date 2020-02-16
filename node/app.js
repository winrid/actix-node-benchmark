const createError = require('http-errors')
const express = require('express')
const path = require('path')

var debug = require('debug')('app4');

const indexRouter = require('./routes/index')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
