module.exports = {


  friendlyName: 'Delete table',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true,
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    await Timer.destroy({table: inputs.id});
    await Table.destroyOne({id: inputs.id});
    // All done.
    return;

  }


};
