module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
      example: 'Bàn 1'
    },
    price: {
      type: 'number',
      required: true,
    },
    status: {
      type: 'string',
      defaultsTo: 'available',
    },
    timer: {
      model: 'timer'
    },
    histories: {
      collection: 'timer',
      via: 'table'
    }
  },
  afterUpdate: function(valuesToSet, proceed) {
    sails.sockets.broadcast('table_dashboard', 'table_' + valuesToSet.id, _.omit(valuesToSet, ['timer']));
    proceed();
  }
};
