const ajaxPromises = require('ajax-promises');

new Vue({
  el: '#app',
  data: {
    domain: 'product-ci',
    group: 'company',
    repository: 'hue-com-batchworkflow',
    from: 'develop~1',
    to: 'develop',
    gitDiff: '',
  },
  methods: {
    findText: function () {
      var compareUrl = 'http://' + this.domain + '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to;
      console.log(compareUrl);
      ajaxPromises.get(compareUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Access-Control-*, Origin, X-Requested-With, Content-Type, Accept',
        }
      })
      .then(function(response) {
        this.gitDiff = response.data;
      }, this);
    }
  }
})