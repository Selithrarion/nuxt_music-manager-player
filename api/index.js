const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const musicRoute = require('./routes/musicRoute');

const app = express();

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(console.log('MongoDB connect'))
	.catch((err) => {
		console.log(err);
	});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/static', express.static('static'));

app.use('/api/music', musicRoute);

module.exports = app;

if (require.main === module) {
	const port = process.env.PORT || 3001;
	app.listen(port, () => {
		console.log(`API server listening on port ${port}`);
	});
}
