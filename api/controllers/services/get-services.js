module.exports = {


  friendlyName: 'Get services',


  description: '',


  inputs: {

  },


  exits: {

  },


  fn: async function () {
    let services = await Service.find();
    // All done.
    return services;

  }


};
