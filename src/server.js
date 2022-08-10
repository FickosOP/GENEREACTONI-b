const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));

const userRouter = require('./routes/users.route');
const modelRouter = require('./routes/model.route');

app.use('/users', userRouter);
app.use('/model', modelRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

const config = require('./config');

app.listen(config.PORT, console.log('Listening on port 3000...'));
