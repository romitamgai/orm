/**
 * Created by romit on 10/14/16.
 */

import mysql from 'mysql';

class DBUtils {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    executeQuery(query, values) {
        return new Promise((resolve, reject)=> {
            this.connection.query(query, values = [], (err, results)=> {
                if (err)
                    return reject(err);
                return resolve(results);
            });
        });
    }
}

export default DBUtils;