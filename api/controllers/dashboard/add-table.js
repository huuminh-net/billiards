/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Add table',


  description: '',


  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    price: {
      type: 'number',
      required: true,
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Add table error',
    },
    success: {
      description: 'Add new table successfully'
    },
  },


  fn: async function (inputs) {
    try {
      await Table.create(inputs);
    } catch(e) {
      console.log(e.message);
      throw 'invalid';
    }

    // All done.
    return;

  }


};
