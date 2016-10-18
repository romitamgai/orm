/**
 * Created by romit on 10/17/16.
 */
import Knex from 'knex';
import wordMap from '../utils/wordMap';
import customJoi from '../utils/customValidation';

class QueryService {
    constructor() {
        this.knex = new Knex({client: 'mysql'});
        this.model = {};
        this.getQueryObject = this.getQueryObject.bind(this);
        this.parseOptionQuery = this.parseOptionQuery.bind(this);
        this.parseNoOptionQuery = this.parseNoOptionQuery.bind(this);
        this.validate = this.validate.bind(this);
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
                    if (this.validate(jsonString))
                        qObject.query = this.parseOptionQuery(jsonString, qObject.query);
                } else {
                    jsonString = {field: field, value: queryParams[field]};
                    if (this.validate(jsonString))
                        qObject.query = this.parseNoOptionQuery(jsonString, qObject.query);
                }
            } catch (err) {
                qObject.hasError = true;
                err.customMessage ? qObject.error.push(err.customMessage) :
                    qObject.error.push('The operator ' + jsonString.option + ' is not permitted');
            }
        }
        return qObject;
    }

    parseOptionQuery(jsonString, query) {
        if (jsonString.field == 'sort' && this.isValidField(jsonString.value)) {
            query.orderBy(jsonString.value, jsonString.option).toSQL();
        }
        else if (wordMap.hasOwnProperty(jsonString.option)) {
            jsonString.option = wordMap[jsonString.option];
            query.where(jsonString.field, jsonString.option, jsonString.value).toSQL();
        } else {
            query.where(jsonString.field, jsonString.option, jsonString.value).toSQL();
        }
        return query;
    }

    parseNoOptionQuery(jsonString, query) {
        if (jsonString.field == 'start') {
            query.offset(parseInt(jsonString.value)).toSQL();
        } else if (jsonString.field == 'offset') {
            query.limit(parseInt(jsonString.value)).toSQL();
        } else {
            query.where(jsonString.field, jsonString.value).toSQL();
        }
        return query;
    }

    validate(jsonString) {
        if (this.model.options.hasOwnProperty(jsonString.field)) {
            return this.hasValidOption(jsonString.option);
        }
        else if (this.isValidField(jsonString.field)) {
            customJoi.validate({[jsonString.field]: jsonString.value}, this.model, function (err, value) {
                if (err)
                    throw {customMessage: err.details[0].message};
            });
            return true;
        }
        throw {customMessage: 'Invalid field ' + jsonString.field};
    }

    static validateModel(values, model) {
        customJoi.validate(values, model, function (err, value) {
            if (err) {
                throw {errors: err.details}
            }
        });
    }

    isValidField(field) {
        if (this.model.hasOwnProperty(field) && field != 'options') {
            return true;
        }
        throw {customMessage: 'Invalid field ' + field};
    }

    hasValidOption(option) {
        if (option !== undefined && this.model.options.sort.hasOwnProperty(option))
            return true;
        else if (option !== undefined && this.model.options.filter.hasOwnProperty(option))
            return true;
        throw {customMessage: 'Provide valid option for sort/filter'};
    }

}

export default QueryService;