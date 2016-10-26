import express from 'express';
import bodyParser from 'body-parser';

import EmployeeRoutes from './src/routes/EmployeeRoutes';
import StudentRoutes from './src/routes/StudentRoute';
import DBUtils from './src/utils/DBUtils';
import config from './config.js';

const app = express();
const port = process.env.PORT || 3000;

const dbUtils = new DBUtils(config);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send('welcome to my QueryBuilderApi');
});

const employeeRoutes = new EmployeeRoutes(dbUtils);
app.use('/employee', employeeRoutes.setupRoutes());

const studentRoutes = new StudentRoutes(dbUtils);
app.use('/student', studentRoutes.setupRoutes());

app.listen(port, function () {
  console.log(`App started on PORT: ${port}`);
});