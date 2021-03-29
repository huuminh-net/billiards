/**
 * Timer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    startTime: {
      type: 'string',
      required: true
    },
    stopTime: {
      type: 'string',
      allowNull: true
    },
    table: {
      model: 'table'
    }
  },
};

