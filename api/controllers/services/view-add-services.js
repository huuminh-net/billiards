module.exports = {


  friendlyName: 'View add services',


  description: 'Display "Add services" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/services/add-services'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
