/**
 * Created by romit on 10/17/16.
 */
import Knex from 'knex';
import wordMap from '../utils/wordMap';

class QueryService {
    constructor() {
        this.knex = new Knex({client: 'mysql'});
        this.model = {};
        this.getQueryObject = this.getQueryObject.bind(this);
        this.parseOptionQuery = this.parseOptionQuery.bind(this);
        this.parseNoOptionQuery = this.parseNoOptionQuery.bind(this);
        this.validateField = this.validateField.bind(this);
        this.isValidField = this.isValidField.bind(this);
        this.hasValidOption = this.hasValidOption.bind(this);
    }

    getQueryObject(tableName, queryParams, model) {
        let qObject = {};
        qObject.query = this.knex(tableName);
        qObject.hasError = false;
        qObject.error = [];
        this.model = model;
        for (let field of Object.keys(queryParams)) {
            let jsonString = {};
            try {
                if (typeof queryParams[field] === 'object') {
                    const option = Object.keys(queryParams[field]).pop();
                    jsonString = {field: field, option: option, value: queryParams[field][option]};
                    if (this.validateField(jsonString))
                        qObject.query = this.parseOptionQuery(jsonString, qObject.query);
                } else {
                    jsonString = {field: field, value: queryParams[field]};
                    if (this.validateField(jsonString))
                        qObject.query = this.parseNoOptionQuery(jsonString, qObject.query);
                }
            } catch (err) {
                qObject.hasError = true;
                err.message ? qObject.error.push(err.message) :
                    qObject.error.push({message: 'Invalid parameters in field ' + jsonString.field});
            }
        }
        return qObject;
    }

    parseOptionQuery(jsonString, query) {
        try {
            if (jsonString.field == 'sort' && this.isValidField(jsonString.value)) {
                query.orderBy(jsonString.value, jsonString.option).toSQL();
            }
            else if (wordMap.hasOwnProperty(jsonString.option)) {
                jsonString.option = wordMap[jsonString.option];
                query.where(jsonString.field, jsonString.option, jsonString.value).toSQL();
            } else {
                query.where(jsonString.field, jsonString.option, jsonString.value).toSQL();
            }
        } catch (err) {
            throw err;
        }
        return query;

    }

    parseNoOptionQuery(jsonString, query) {
        try {
            if (jsonString.field == 'start') {
                query.offset(parseInt(jsonString.value)).toSQL();
            } else if (jsonString.field == 'offset') {
                query.limit(parseInt(jsonString.value)).toSQL();
            } else {
                query.where(jsonString.field, jsonString.value).toSQL();
            }
        } catch (err) {
            throw err;
        }
        return query;
    }

    validateField(jsonString) {
        if (this.model.options.hasOwnProperty(jsonString.field)) {
            return this.hasValidOption(jsonString.option);
        }
        else if (this.isValidField(jsonString.field)) {
            return true;
        }
        throw {message: 'Invalid field ' + jsonString.field};

    }

    isValidField(field) {
        if (this.model.hasOwnProperty(field) && field != 'options') {
            return true;
        }
        throw {message: 'Invalid field ' + field};
    }

    hasValidOption(option) {
        if (option !== undefined && this.model.options.sort.hasOwnProperty(option))
            return true;
        else if (option !== undefined && this.model.options.filter.hasOwnProperty(option))
            return true;
        throw {message: 'Provide valid option for sort/filter'};
    }

}

export default QueryService;