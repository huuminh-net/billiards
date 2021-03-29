parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    modal: '',
    pageLoadedAt: Date.now(),
    tables: [],
    services: [],
    timerServices: [],
    serviceFormData: {},
    checkoutData: {},
  },

  watch: {
    timerServices: {
      deep: true,
      handler(data) {
        _.each(data, (item) => {
          item.total = this.currencyFormat(item.price * item.qty, 0);
          item.priceFormat = this.currencyFormat(item.price, 0);
        });
      },
    },
    checkoutData: {
      deep: true,
      handler(data) {
        console.log(data);
        data.totalPriceFormat = this.currencyFormat(data.totalPrice);
        data.timePriceFormat = this.currencyFormat(data.timePrice);
        _.each(data.services, (service) => {
          service.priceFormat = this.currencyFormat(service.price * service.qty);
        });
      },
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },

  computed: {
    isStart: function () {},
  },

  mounted: async function () {
    try {
      let status = await Cloud.subscribe.with().protocol(io.socket);
      console.log(status.message);
    } catch (e) {
      console.error('Could not subscribe', e);
    }

    try {
      let sv = await Cloud.getServices.with().protocol(io.socket);
      this.services = sv;
    } catch (e) {
      console.error('Could not load services', e);
    }
  },

  //  ╦  ╦╦╦═╗╔╦╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ╚╗╔╝║╠╦╝ ║ ║ ║╠═╣║    ╠═╝╠═╣║ ╦║╣ ╚═╗
  //   ╚╝ ╩╩╚═ ╩ ╚═╝╩ ╩╩═╝  ╩  ╩ ╩╚═╝╚═╝╚═╝
  // Configure deep-linking (aka client-side routing)
  virtualPagesRegExp: /^\/welcome\/?([^\/]+)?\/?/,
  afterNavigate: async function (virtualPageSlug) {
    // `virtualPageSlug` is determined by the regular expression above, which
    // corresponds with `:unused?` in the server-side route for this page.
    switch (virtualPageSlug) {
      case 'service':
        if (!this.serviceFormData.timerId) {
          this.goto('/');
        }
        this.modal = 'service';
        break;
      default:
        this.modal = '';
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    updateTable: async function (table) {
      let index = _.findIndex(this.tables, (o) => {
        return o.id === table.id;
      });
      this.tables[index] = table;
    },

    openModal: async function (data) {
      this.serviceFormData.tableId = data.id;
      this.serviceFormData.timerId = data.timer.id;
      this.serviceFormData.tableName = data.name;
      this.serviceFormData.id = this.services[0].id;
      this.serviceFormData.qty = 1;
      this.timerServices = data.services;
      this.modal = 'service';
    },

    checkoutModel: async function (data) {
      const cData = await Cloud.tableData.with({id: data.id});
      this.checkoutData = data;

      let endTime = moment();
      var timer = cData.timer;
      const startTime = moment(new Date(timer.startTime));
      const stopTime = moment(new Date(endTime));
      let dur = moment.duration(stopTime.diff(startTime));

      var tbPrice = parseInt(cData.price, 10);
      let hPrice = dur.get('hours') * tbPrice;
      let mPrice = (dur.get('minutes') / 60) * tbPrice;
      let totalTimePrice = this.calculatePrice(hPrice + mPrice);
      this.checkoutData.timePrice = totalTimePrice;

      var sPrice = 0;
      _.each(this.checkoutData.services, (item, index) => {
        let p = item.price * item.qty;
        sPrice += p;
      });
      this.checkoutData.totalPrice = sPrice + totalTimePrice;
      this.modal = 'checkout';
    },

    submitCheckout: async function() {
      const data = this.checkoutData;
      this.checkoutData.status = 'complete';
      await Cloud.checkout.with({id: data.id});
    },

    printInvoice: async function () {
      window.print();
    },

    addService: async function () {
      let data = this.serviceFormData;
      if (!data.id) {
        return false;
      }
      if (!data.qty) {
        data.qty = 1;
      }

      try {
        let s = await Cloud.addTimerServices.with(data);
        let index = _.findIndex(this.timerServices, (o) => o.id === s.id);
        if (index === -1) {
          this.timerServices.push(s);
        } else {
          this.timerServices[index].qty = s.qty;
        }
      } catch (e) {
        console.error('Can not add service', e);
      }
    },

    deleteService: async function (id) {
      try {
        await Cloud.deleteTimerServices.with({
          id: id,
          timerId: this.serviceFormData.timerId,
          tableId: this.serviceFormData.tableId,
        });
        var newData = _.filter(this.timerServices, (o) => {
          return o.id !== id;
        });

        this.timerServices = newData;
      } catch (e) {
        console.error('Can not delete service', e);
      }
    },

    updateServiceQty: async function () {
      _.each(this.timerServices, async (item) => {
        try {
          let s = await Cloud.updateTimerServices.with({
            id: item.id,
            qty: item.qty,
          });

          let index = _.findIndex(this.timerServices, (o) => o.id === s.id);
          if (index === -1) {
            this.timerServices.push(s);
          } else {
            this.timerServices[index].qty = s.qty;
          }
        } catch (e) {
          console.error('Can not update service', e);
        }
      });
    },

    closeExampleModal: async function () {
      this.serviceData = {};
      this.timerServices = [];
      this.checkoutData = {};
      this.modal = '';
    },

    calculatePrice: function(price) {
      var p1 = Math.ceil(parseFloat(price));

      p1 = parseFloat(new Intl.NumberFormat('vi-VN').format(p1));
      p1 = Math.trunc(p1);
      var p2 =  p1 % 10;
      if(p2 !== 0) {
        var p3 = Math.abs(p2 - 10);
        if(p2 <= 5) {
          p3 = Math.abs(p2 - 5);
        }
        price = p1+p3;
      } else {
        price = p1;
      }
      //price = new Intl.NumberFormat('vi-VN', {currency: 'VND'}).format(price * 1000);
      return price * 1000;
    },

    currencyFormat: function(price, currency){
      currency = currency || 'VND';
      return new Intl.NumberFormat('vi-VN', {style : 'currency', currency: currency }).format(price);
    },

    formatMoney: function (
      amount,
      decimalCount,
      decimal,
      thousands
    ) {
      decimalCount = decimalCount || 2;
      decimal = decimal || '.';
      thousands = thousands || ',';
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : '') +
          i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : '')
        );
      } catch (e) {
        console.log(e);
      }
    },
  },
});
