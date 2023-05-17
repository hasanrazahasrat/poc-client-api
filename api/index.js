var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
let trpcExpress = require('@trpc/server/adapters/express');
var { appRouter, createContext } = require("../trpc/routes");

var app = express();

const port = process.env.PORT || 5000;

app.use(logger('dev'));
app.use(express.json({ limit: "50mb"}));
app.use(express.urlencoded({ extended: false, limit: "50mb"}));
app.use(cookieParser());
app.use(express.static("uploads"));

//cors
app.use(cors());

app.get('/test-server', function (req, res) {
  return res.json({
    success: true
  });
});

/**
 * TRPC Middleware
 */
app.use('trpc',trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
