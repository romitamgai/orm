/**
 * Created by romit on 10/17/16.
 */
import QueryService from '../services/QueryService';
import studentModel from '../models/StudentModel';

class StudentController {
    constructor(dbUtils) {
        this.databaseUtils = dbUtils;
        this.getAll = this.getAll.bind(this);
        this.queryService = new QueryService();
    }

    getAll(req, res) {
        const tableName = req.originalUrl.split('?').shift().replace('/', '');
        const queryParams = req.query;
        let queryObject = this.queryService.getQueryObject(tableName, queryParams, studentModel);
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


}

export default StudentController;