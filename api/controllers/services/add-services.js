module.exports = {


  friendlyName: 'Add services',


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
      description: 'Add service error',
    },
    success: {
      description: 'Add new service successfully'
    },
  },


  fn: async function (inputs) {

    try {
      await Service.create(inputs);
    } catch(e) {
      console.log(e.message);
      throw 'invalid';
    }

    // All done.
    return;

  }


};
