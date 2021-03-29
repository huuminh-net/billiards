/* eslint-disable no-undef */
module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/welcome',
      description: 'Display the welcome page for authenticated users.'
    },
    serverError: {
      description: 'Subcrible error'
    }
  },


  fn: async function () {
    let tables = await Table.find({select: ['id']});
    return {
      tables: tables
    };
  }


};
