var express = require('express');
var logger = require('morgan');
var cors = require('cors');
var path = require("path");
var bodyParser = require('body-parser');

const app = express();
const routes = require('./routes/index');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//console.log("start here!", path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', routes);

app.listen(4000, () => console.log(`Express server running on port 4000`));