module.exports = {


  friendlyName: 'Delete timer services',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    tableId: {
      type: 'number'
    },
    timerId: {
      type: 'number'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    await TimerServices.destroyOne({id: inputs.id});

    if(inputs.tableId && inputs.timerId) {
      let newTData = await TimerServices.find({timerId: inputs.timerId});
      sails.sockets.broadcast('table_dashboard', 'table_' + inputs.tableId, {services: newTData});
    }
    // All done.
    return 'ok';

  }


};
