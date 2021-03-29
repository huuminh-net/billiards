module.exports = {


  friendlyName: 'View services',


  description: 'Display "Services" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/services/services'
    }

  },


  fn: async function () {
    let services = await Service.find();
    // Respond with view.
    return {
      services
    };

  }


};
