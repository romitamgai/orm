/**
 * Created by romit on 10/18/16.
 */
import Joi from 'joi';

const customJoi = Joi.extend({
  base: Joi.number(),
  name: 'number',
  language: {
    round: 'needs to be a rounded number', // Used below as 'number.round'
    dividable: 'needs to be dividable by {{q}}'
  },
  pre(value, state, options) {

    if (options.convert && this._flags.round) {
      return Math.round(value);
    }
    return value;
  },
  rules: [
    {
      name: 'round',
      setup(params) {
        this._flags.round = true;
      },
      validate(params, value, state, options) {

        if (value % 1 !== 0) {
          return this.createError('number.round', {v: value}, state, options);
        }
        return value;
      }
    },
    {
      name: 'dividable',
      params: {
        q: Joi.alternatives([Joi.number().required(), Joi.func().ref()])
      },
      validate(params, value, state, options) {
        if (value % params.q !== 0) {
          return this.createError('number.dividable', {v: value, q: params.q}, state, options);
        }
        return value;
      }
    }
  ]
});

export default customJoi;