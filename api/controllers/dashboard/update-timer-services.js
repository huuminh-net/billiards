module.exports = {


  friendlyName: 'Update timer services',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    qty: {
      type: 'number',
      defaultsTo: 1,
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    var result = await TimerServices.updateOne({id: inputs.id}).set({qty: inputs.qty});
    // All done.
    return result;

  }


};
