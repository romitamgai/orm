/**
 * Created by romit on 10/13/16.
 */

import queryUtils from '../utils/QueryUtils'
import Knex from 'knex';
import wordMap from '../utils/wordMap';

class EmployeeController {
    constructor(dbUtils) {
        this.databaseUtils = dbUtils;
        this.getAll = this.getAll.bind(this);
        this.knex = new Knex({client: 'mysql'});
    }

    getAll(req, res) {
        const queryParams = req.query;
        let query=this.knex('employee');
        if (queryParams) {
            for (let field of Object.keys(queryParams)) {
                let jsonString;
                if (typeof queryParams[field] === 'object') {
                    const option = Object.keys(queryParams[field]).pop();
                    jsonString = {field: field, option: option, value: queryParams[field][option]};
                    queryUtils.parseOptionQuery(jsonString, query);
                } else {
                    jsonString = {field: field, value: queryParams[field]};
                    queryUtils.parseNoOptionQuery(jsonString, query);
                }
            }
        }
        this.databaseUtils.executeQuery(query.toString()).then((response)=> {
            res.json(response);
        });
    }


}

export default EmployeeController;