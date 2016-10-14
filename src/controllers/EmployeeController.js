/**
 * Created by romit on 10/13/16.
 */

import queryUtils from '../utils/QueryUtils';

class EmployeeController {
    constructor(dbUtils) {
        this.databaseUtils = dbUtils;
        this.getAll = this.getAll.bind(this);
    }

    getAll(req, res) {
        const queryParams = req.query;
        let options = [];
        if (queryParams) {
            for (let field of Object.keys(queryParams)) {
                let queryOption, jsonString;
                if (typeof queryParams[field] === 'object') {
                    const option = Object.keys(queryParams[field]).pop();
                    jsonString = {field: field, option: option, value: queryParams[field][option]};
                    queryOption = queryUtils.parseOptionQuery(jsonString);
                } else {
                    jsonString = {field: field, value: queryParams[field]};
                    queryOption = queryUtils.parseNoOptionQuery(jsonString);
                }
                options.push(queryOption);
            }
        }
        const tableName = 'employee';
        let query = queryUtils.buildGetQuery(tableName, options);
        res.json(options);
        // this.databaseUtils.executeQuery(query).then((response)=> {
        //     res.json(options);
        // });
    }


}

export default EmployeeController;