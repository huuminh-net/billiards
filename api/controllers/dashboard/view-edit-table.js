module.exports = {


  friendlyName: 'View edit table',


  description: 'Display "Edit table" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/edit-table'
    }

  },


  fn: async function () {
    var id = this.req.param('id');
    // eslint-disable-next-line no-undef
    let tb = await Table.findOne({id});
    // Respond with view.
    return {
      formData: tb
    };

  }


};
