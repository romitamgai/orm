/**
 * Created by romit on 10/17/16.
 */
import Knex from 'knex';
import wordMap from '../utils/wordMap';
import customJoi from '../utils/customValidation';
import _ from 'lodash';

class QueryService {
  constructor() {
    this.knex = new Knex({client: 'mysql'});
    this.model = {};
    this.getQueryObject = this.getQueryObject.bind(this);
    this.parseQueryParam = this.parseQueryParam.bind(this);
    this.parseOptionQuery = this.parseOptionQuery.bind(this);
    this.parseNoOptionQuery = this.parseNoOptionQuery.bind(this);
    this.validate = this.validate.bind(this);
    this.isValidField = this.isValidField.bind(this);
    this.hasValidOption = this.hasValidOption.bind(this);
    this.parseOptionAndValue = this.parseOptionAndValue.bind(this);
  }

  getQueryObject(tableName, queryParams, model) {
    let queryObject = {};
    queryObject.query = this.knex(tableName);
    queryObject.hasError = false;
    queryObject.error = [];
    this.model = model;
    for (let field of Object.keys(queryParams)) {
      let parsedOptionAndValue, optionAndValue = {};
      const arrayConstructor = [].constructor;
      parsedOptionAndValue = this.parseOptionAndValue(queryParams[field]);

      if (parsedOptionAndValue.constructor === arrayConstructor) {
        parsedOptionAndValue.map((res)=> {
          res.field = field;
          optionAndValue = res;
          queryObject = this.parseQueryParam(optionAndValue, queryObject);
        });
      }
      else {
        parsedOptionAndValue.field = field;
        optionAndValue = parsedOptionAndValue;
        queryObject = this.parseQueryParam(optionAndValue, queryObject);
      }

    }
    return queryObject;
  }

  parseQueryParam(optionAndValue, queryObject) {
    try {
      if (this.validate(optionAndValue)) {
        queryObject.query = (optionAndValue.option != '') ?
          this.parseOptionQuery(optionAndValue, queryObject.query) :
          queryObject.query = this.parseNoOptionQuery(optionAndValue, queryObject.query);
      }
    } catch (err) {
      queryObject.hasError = true;
      err.customMessage ? queryObject.error.push(err.customMessage) :
        queryObject.error.push(err.message);
    }
    return queryObject;
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

  buildInsertQuery(model, tableName) {
    Object.keys(model).map(key=> {
      if (_.snakeCase(key) != key) {
        model[_.snakeCase(key)] = model[key];
        delete model[key];
      }
    });
    return this.knex.insert(model).into(tableName);
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
        throw {errors: err.details[0].message}
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

  parseOptionAndValue(obj) {
    const stringConstructor = "string".constructor;
    const objectConstructor = {}.constructor;
    const arrayConstructor = [].constructor;
    const booleanConstructor = true.constructor;
    if (obj == null) {
      return obj;
    } else {
      switch (obj.constructor) {
        case stringConstructor:
          return {option: '', value: obj};
        case arrayConstructor:
          return obj.map(this.parseOptionAndValue).reduce((prev, next)=> {
            return prev.concat(next);
          }, []);
        case objectConstructor:
          let optionsAndValuesList = [];
          for (let key of Object.keys(obj)) {
            if (obj[key].constructor == stringConstructor) {
              optionsAndValuesList.push({option: isNaN(key) ? key : '', value: obj[key]});
            } else if (obj[key].constructor == booleanConstructor) {
              optionsAndValuesList.push({option: '', value: key});
            } else {
              obj[key].map((res)=> {
                let optionAndValue = this.parseOptionAndValue(res);
                optionAndValue.option = key;
                optionsAndValuesList.push(optionAndValue);
              });
            }
          }
          return optionsAndValuesList;
      }
    }
  }

}

export default QueryService;