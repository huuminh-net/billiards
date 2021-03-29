module.exports = {


  friendlyName: 'View edit services',


  description: 'Display "Edit services" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/services/edit-services'
    },

    notFound: {
      description: 'not found'
    }
  },


  fn: async function () {
    var id = this.req.param('id');
    let serviceData = await Service.findOne({id});

    if(!serviceData) {
      throw 'notFound';
    }
    // Respond with view.
    return {
      formData: serviceData
    };

  }


};
