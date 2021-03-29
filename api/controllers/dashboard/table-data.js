/* eslint-disable no-undef */
var moment = require('moment');
module.exports = {


  friendlyName: 'Table data',


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
    var tb = await Table.findOne({id: inputs.id}).populate('timer');
    tb.serverTime = new moment();
    tb.services = [];
    if(tb.timer) {
      let sData = await TimerServices.find({timerId: tb.timer.id});
      tb.services = sData;
    }
    sails.sockets.broadcast('table_dashboard', 'table_' + tb.id, tb);
    return tb;
  }

};
