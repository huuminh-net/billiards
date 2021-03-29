module.exports = {


  friendlyName: 'Update services',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true,
    },
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
      description: 'Edit service error',
    },
    success: {
      description: 'Update service successfully'
    },
  },


  fn: async function (inputs) {
    await Service.updateOne({id: inputs.id}).set(_.omit(inputs, ['id']));
    // All done.
    return;

  }


};
