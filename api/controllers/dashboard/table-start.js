var moment = require('moment');

/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'Table start',


  description: '',


  inputs: {
    id: {
      type: 'number',
      required: true,
    }
  },


  exits: {
    notFound: {
      statusCode: 400,
      description: 'Table not found',
    }
  },


  fn: async function (inputs) {
    var playTable = await Table.findOne({id: inputs.id});
    if(!playTable) {throw 'notFound';}

    var startTime = new moment();

    let timerData = await sails.models.timer.findOrCreate({table: inputs.id, stopTime: null}, {
      table: inputs.id,
      startTime: startTime.toString(),
    });

    await Table.updateOne({id: inputs.id}).set({status: 'playing', timer: timerData.id});
    // All done.

    var tb = await Table.findOne({id: inputs.id}).populate('timer');
    tb.services = [];

    return tb;
  }


};
