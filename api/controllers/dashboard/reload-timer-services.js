module.exports = {
  friendlyName: 'Reload Timer Services',

  description: '',

  exists: {

  },

  fn: async function () {
    let service = await Timer.find({
      stopTime: null
    });
    return service;
  }
};
