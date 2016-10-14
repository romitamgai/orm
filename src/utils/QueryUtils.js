/**
 * Created by romit on 10/14/16.
 */
import wordMap from './wordMap';

class QueryUtils {

    static parseOptionQuery(jsonString, query) {
        if (jsonString.field == 'sort') {
            query.orderBy(jsonString.value, jsonString.option);
        }
        else if (wordMap.hasOwnProperty(jsonString.option)) {
            jsonString.option = wordMap[jsonString.option];
        }
        query.where(jsonString.field, jsonString.option, jsonString.value);
    }

    static parseNoOptionQuery(jsonString, query) {
        if (jsonString.field == 'start') {
            query.offset(parseInt(jsonString.value));
        } else if (jsonString.field == 'offset') {
            query.limit(parseInt(jsonString.value));
        } else {
            query.where(jsonString.field, jsonString.value);
        }
    }
}

export default QueryUtils;