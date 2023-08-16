require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/error-handler');
const corsOption = require('./middlewares/cors');
const { MONGO_URL } = require('./config');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(requestLogger);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// подключаемся к серверу
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

app.use(cors(corsOption));

app.use(router);

// обработчик ошибок
app.use(errorLogger);

// celebrate
app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => PORT);
