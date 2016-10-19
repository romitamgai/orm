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
                    res.json(response);
                })
                .catch(error=> {
                    res.json(error);
                });
        } else {
            res.json(queryObject.error);
        }
    }

    saveEmployeeInfo(req, res) {
        const tableName = 'employee';
        let employee = req.body;
        try {
            QueryService.validateModel(employee, employeeModel);
        } catch (err) {
            res.json(err);
        }
        res.json(employee);

    }


}

export default EmployeeController;