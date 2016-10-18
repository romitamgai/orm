/**
 * Created by romit on 10/14/16.
 */
import Joi from '../utils/customValidation';

const employeeModel = {
    id: Joi.number(),
    name: Joi.string().max(30),
    designation: Joi.string(),
    salary: Joi.number().min(0).dividable(2),
    start: Joi.number().integer(),
    offset: Joi.number().integer(),
    options: {
        sort: {
            asc: 'asc',
            desc: 'desc'
        },
        filter: {}
    }
};

export default employeeModel;

