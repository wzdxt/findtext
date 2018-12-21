const ajaxPromises = require('ajax-promises');

new Vue({
  el: '#app',
  data: {
    // protocol: 'http',
    // domain: 'product-ci',
    // group: 'company',
    // repository: 'hue-com-batchworkflow',
    // from: 'develop~1',
    // to: 'develop',
    protocol: 'https',
    domain: 'github.com',
    group: 'wzdxt',
    repository: 'findtext',
    from: 'master~1',
    to: 'master',
    gitDiff: '',
  },
  methods: {
    findText: function () {
      var compareUrl = '/proxy/' + this.protocol + '/' + this.domain + '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to;
      console.log(compareUrl);
      ajaxPromises.get(compareUrl)
      .then(function(response) {
        this.gitDiff = response;
      }.bind(this));
    }
  }
});
