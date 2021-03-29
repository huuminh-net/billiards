parasails.registerPage('history', {
  data: {
    datas: '',
  },

  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },

  mounted: async function () {
    alert('aaa');
    $(document).ready(() => {
      $('#table-history').DataTable();
    } );
    // $('#table-history').DataTable({
    //   'processing': true,
    //   'serverSide': true,
    //   'ajax': 'scripts/server_processing.php'
    // });
  }
});
