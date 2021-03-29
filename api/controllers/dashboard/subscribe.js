module.exports = {


  friendlyName: 'Subcrible',


  description: 'Subcrible dashboard.',


  inputs: {

  },


  exits: {
    success: {
      description: 'Subscribed'
    },
    serverError: {
      description: 'Subcrible error'
    }
  },


  fn: async function (inputs, exits) {
    var req = this.req;
    var res = this.res;
    if(!req.isSocket) {exits.serverError();}


    let tbs = await Table.find({select: ['id']});
    Table.subscribe(req, _.pluck(tbs, 'id'));

    sails.sockets.join(req, 'table_dashboard', (err) => {
      if (err) {
        exits.serverError();
      }
      exits.success({
        message: 'Table subscribed'
      });
    });
  }


};
