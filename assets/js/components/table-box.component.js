parasails.registerComponent('tableBox', {
  props: {
    syncing: {
      type: Boolean
    },
    tableId: {
      type: Number,
      required: true,
    }
  },

  data: function (){
    return {
      table: {},
      dur: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      price: 0,
      sPrice: 0,
      durInterval: null,
      services: []
    };
  },

  watch: {
    table: {
      deep: true,
      handler(data){
        if(data.status === 'playing') {
          this.durInterval = setInterval(this.calcDuration, 1000);
        }
        // Calc services price
        var sPrice = 0;
        if(data.services && data.services.length) {
          _.each(data.services, (item) => {
            sPrice += (item.price * item.qty);
          });
        }
        this.sPrice = sPrice;
      }
    },
    dur: function({hours, minutes}) {
      var tbPrice = parseInt(this.table.price, 10);
      let hPrice = hours * tbPrice;
      let mPrice = (minutes / 60) * tbPrice;
      let tPrice = Math.ceil(hPrice + mPrice);

      if(tPrice < 1000) {
        tPrice = 1000;
      } 
      this.price = this.calculatePrice(tPrice);
    }
  },

  computed: {
    tablePrice: function() {
      return this.currencyFormat(this.table.price);
    },
    totalPrice: function(){
      return this.currencyFormat(this.price + this.sPrice);
    },
    servicesPrice: function( ) {
      return this.currencyFormat(this.sPrice);
    },
    playingPrice: function( ) {
      return this.currencyFormat(this.price);
    },
  },


  beforeMount: function() {
    clearInterval(this.durInterval);
  },

  mounted: function(){
    Cloud.tableData.with({id: this.tableId}).protocol(io.socket).exec((err, result) => {
      if(err) {
        console.log(err);
      } else {
        this.table = result;
      }
    });

    io.socket.on('table_'+this.tableId, (data) => {
      if(data.services) {
        this.table.services = data.services;
      } else if(data) {
        var oldVal = this.table;
        let t = _.merge(oldVal, data);
        this.table = t;
      }
    });
  },

  methods: {
    calcDuration: function() {
      var timer = this.table.timer;
      const startTime = moment(new Date(timer.startTime));
      const now = new moment();
      let dur = moment.duration(now.diff(startTime));
      this.dur = {
        hours: dur.get('hours'),
        minutes: dur.get('minutes'),
        seconds: dur.get('seconds')
      };
      return 0;
    },

    onPlay: async function() {
      try {
        let tb = await Cloud.tableStart.with({id: this.table.id});
        this.table = tb;
      } catch(e) {
        console.log(e);
      }
    },

    checkout: async function() {
      this.$emit('show-checkout', this.table);
    },

    clickService: function() {
      this.$emit('show-model', this.table);
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

    formatMoney: function(amount, decimalCount = 2, decimal = '.', thousands = ',') {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? '-' : '';

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '');
      } catch (e) {
        console.log(e);
      }
    }
  },

  template: `<div class="col-sm col-sm-4">
  <div v-bind:id="table.id" v-bind:class="['card', 'bill-card', { 'bill-start-pending': (table.status !== 'playing')}]">
  <div class="card-header text-center bold">
    {{table.name}}
    <a :href="'/edit-table/'+table.id" class="float-right"><i class="fal fa-edit text-warning"></i></a>
  </div>
  <div v-if="!table.status || table.status === 'available'" class="card-body d-flex align-items-center justify-content-center">
    <div class="start-count text-center">
      <button v-on:click="onPlay()" class="btn btn-lg btn-primary">BẮTẦU CHƠI</button>
    </div>
  </div>
  <div v-if="table.status === 'playing'" class="card-body d-flex align-items-center justify-content-center">
    <div class="time-calc d-flex bd-highlight">
      <div class="p-2">
        <span class="s1-txt">{{dur.hours}}</span>
        <span class="s2-txt text-muted">GIỜ</span>
      </div>
      <div class="p-2">
        <span class="s1-txt">{{dur.minutes}}</span>
        <span class="s2-txt text-muted">PHÚT</span>
      </div>
      <div class="p-2">
        <span class="s1-txt">{{dur.seconds}}</span>
        <span class="s2-txt text-muted">GIÂY</span>
      </div>
    </div>
  </div>
  <table v-if="table.status === 'playing'"  class="table  table-striped table-sm">
    <tr>
      <td>Giá mỗi giờ</td>
      <td class="text-right">{{tablePrice}}</td>
    </tr>
    <tr>
      <td>Tiền giờ</td>
      <td class="text-right">{{playingPrice}}</td>
    </tr>
    <tr>
      <td>Dịch vụ</td>
      <td class="text-right">{{servicesPrice}}</td>
    </tr>
    <tr>
      <td>Tổng</td>
      <td class="text-right text-danger bold">{{totalPrice}}</td>
    </tr>
  </table>
  <div v-if="table.status === 'playing'" class="card-footer justify-content-center">
    <div class="row">
      <div class="col-sm px-sm-1">
        <button v-on:click="clickService" class="btn btn-success btn-block">Dịch vụ</button>
      </div>
      <div class="col-sm px-sm-1">
        <button class="btn btn-danger btn-block" v-on:click="checkout">Thanh toán</button>
      </div>
    </div>
  </div>
</div></div>`
});
