/**
 * Created by romit on 10/13/16.
 */

import QueryService from '../services/QueryService';
import employeeModel from '../models/EmployeeModel';

class EmployeeController {
  constructor(dbUtils) {
    this.databaseUtils = dbUtils;
    this.getAll = this.getAll.bind(this);
    this.saveEmployeeInfo = this.saveEmployeeInfo.bind(this);
    this.queryService = new QueryService();
  }

  getAll(req, res) {
    const tableName = req.originalUrl.split('?').shift().replace('/', '') || 'employee';
    const queryParams = req.query;
    let queryObject = this.queryService.getQueryObject(tableName, queryParams, employeeModel);
    if (!queryObject.hasError) {
      this.databaseUtils.executeQuery(queryObject.query.toString())
        .then(response=> {
          res.status(200).json(response);
        })
        .catch(err=> {
          res.status(500).json(err);
        });
    } else {
      res.json(queryObject.error);
    }
  }

  saveEmployeeInfo(req, res) {
    const tableName = req.originalUrl.split('?').shift().replace('/', '') || 'employee';
    let employee = {};
    employee = req.body;
    try {
      QueryService.validateModel(employee, employeeModel);
      let postQuery = this.queryService.buildInsertQuery(employee, tableName);
      this.databaseUtils.executeQuery(postQuery.toString())
        .then(response=> {
          employee.message = 'Employee Successfully added to Database';
          res.status(201).json({employee});
        })
        .catch(err=> {
          employee.message = 'Error while adding employee to Database';
          employee.error = err;
          res.status(500).json(employee);
        });
    } catch (err) {
      res.json(err);
    }
  }


}

export default EmployeeController;