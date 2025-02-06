const debug = require('debug')
const http = require('http')
const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const path = require('path')

const dotEnv = require('dotenv')
dotEnv.config()
// Routes

const index = require('./routes/index')

const users = require('./routes/users')

const promoRouter = require('./routes/promoRouter')

const listRouter = require('./routes/listRouter')

const cartRouter = require('./routes/cartRouter')

const storeRouter = require('./routes/storeRouter')

const shelfRouter = require('./routes/shelfRouter')

const shortestPathRouter = require('./routes/shortestPathRoute')

const favoriteRouter = require('./routes/favoriteRouter')

//

// const adminUser = require("./routes/adminUserRoutes");

// Database

const mongoose = require('mongoose')

mongoose.Promise = require('bluebird')

const passport = require('passport')

// Connection URL

const url = process.env.mongoUrl

const connect = mongoose.connect(url, {
	useNewUrlParser: true,

	useUnifiedTopology: true,
})

connect.then(
	() => {
		console.log('Connected correctly to server and Database')
	},

	(err) => {
		console.log(err)
	}
)

const app = express()

// view engine setup

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'ejs')

// Logger and Body parser

app.use(logger('dev'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(passport.initialize())

// User Route

app.use('/', index)

app.use('/users', users)

// app.use("/admin", adminUser);

// Routes

app.use('/promotions', promoRouter)

app.use('/lists', listRouter)

app.use('/cart', cartRouter)

app.use('/store', storeRouter)

app.use('/shelf', shelfRouter)

app.use('/shortestPath', shortestPathRouter)

app.use('/favorite', favoriteRouter)

// catch 404 and forward to error handler

app.use(function (_req, _res, next) {
	const err = new Error('Not Found')

	next(err)
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

debug('smart-shopping-app:server')

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	const port = parseInt(val, 10)

	if (isNaN(port)) {
		// named pipe
		return val
	}

	if (port >= 0) {
		// port number
		return port
	}

	return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address()
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port
	debug('Listening on ' + bind)
}
