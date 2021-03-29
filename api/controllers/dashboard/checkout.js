var moment = require('moment');

module.exports = {


  friendlyName: 'Checkout',


  description: 'Checkout dashboard.',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Checkout error',
    },
    success: {
      description: 'Checkout successfully'
    },
  },


  fn: async function (inputs) {
    const { id } = inputs;

    var stopTime = new moment();
    var tb = await Table.findOne({id}).populate('timer');
    tb.services = [];

    if(tb.timer) {
      let sData = await TimerServices.find({timerId: tb.timer.id});
      tb.services = sData;
    }

    await Timer.updateOne({id: tb.timer.id}).set({stopTime: stopTime.toString()});
    await Table.updateOne({id: tb.id}).set({status: 'available', timer: null});

    // All done.
    return stopTime.toString();

  }


};
