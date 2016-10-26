/**
 * Created by romit on 10/17/16.
 */
import Joi from '../utils/customValidation';

const studentModel = {
  id: Joi.number(),
  name: Joi.string(),
  class: Joi.string(),
  section: Joi.string(),
  start: Joi.number().integer(),
  offset: Joi.number().integer(),
  email: Joi.string().email(),
  options: {
    sort: {
      asc: Joi.string(),
      desc: Joi.string()
    },
    filter: {}
  },
};

export default studentModel;