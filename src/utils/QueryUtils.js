/**
 * Created by romit on 10/14/16.
 */
import wordMap from './wordMap';
import _ from 'lodash';

class QueryUtils {
    static parseOptionQuery(jsonString) {
        if (jsonString.field == 'sort') {
            return `order by ${jsonString.value} ${jsonString.option} `;
        }
        if (wordMap.hasOwnProperty(jsonString.option)) {
            jsonString.option = wordMap[jsonString.option];
        }
        return `where ${jsonString.field} ${jsonString.option} '${jsonString.value}' `;
    }

    static parseNoOptionQuery(jsonString) {
        return QueryUtils.hasStartOrOffset(jsonString) ? `${jsonString.field} ${jsonString.value} ` : `where ${jsonString.field} = '${jsonString.value}' `;
    }

    static hasStartOrOffset(jsonString) {
        if (jsonString.field == 'start') {
            jsonString.field = 'offset';
            return true;
        }
        if (jsonString.field == 'offset') {
            jsonString.field = 'limit';
            return true;
        }
        return false;
    }

    static buildGetQuery(tableName, options) {
        let mappedOptions = options.map((elem, whereCount = 0)=> {
            if (elem.indexOf('where') == 0) {
                whereCount++;
            }
            if (whereCount > 1) {
                elem = elem.replace('where', 'and');
            }
            return elem;
        });
        let queryOptions = mappedOptions.join("");
        return `SELECT * from ${tableName} ${queryOptions}`;
    }
}

export default QueryUtils;