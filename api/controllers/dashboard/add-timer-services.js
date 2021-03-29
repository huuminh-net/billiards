module.exports = {


  friendlyName: 'Add timer services',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true
    },
    qty: {
      type: 'number',
      defaultsTo: 1,
    },
    tableId: {
      type: 'number',
      required: true
    },
    timerId: {
      type: 'number',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    let sData = await Service.findOne({id: inputs.id});
    var data = _.pick(sData, ['name', 'price']);
    data.timerId = inputs.timerId;
    data.serviceId = inputs.id;
    data.qty = inputs.qty;

    let tData = await TimerServices.findOne({timerId: data.timerId, serviceId: data.serviceId});
    var result;
    if(!tData) {
      result = await TimerServices.create(data).fetch();
    } else {
      data.qty = tData.qty + data.qty;
      result = await TimerServices.updateOne({id: tData.id}).set({qty: data.qty});
    }

    let newTData = await TimerServices.find({timerId: data.timerId});
    sails.sockets.broadcast('table_dashboard', 'table_' + inputs.tableId, {services: newTData});
    // All done.
    return result;

  }


};
