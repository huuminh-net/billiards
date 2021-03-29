module.exports = {


  friendlyName: 'Edit table',


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

  },


  fn: async function (inputs) {
    await Table.updateOne({id: inputs.id}).set(_.omit(inputs, ['id']));
    // All done.
    return;

  }


};
