Vue.use(require('vue-cookies'));
const ajaxPromises = require('ajax-promises');
const $ = require('jquery');

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
  },
  methods: {
    findText: function () {
      this.$cookies.set('x-protocol', this.protocol);
      this.$cookies.set('x-domain', this.domain);
      // var compareUrl = '/proxy/' + this.protocol + '/' + this.domain + '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to;
      var compareUrl = '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to;
      console.log(compareUrl);
      ajaxPromises.get(compareUrl)
        .then(function (response) {
          $('#git-diff').html(response);
        }.bind(this))
        .then(function () {
          $('#git-diff table.diff-table tr:has(td.blob-code-addition span.x)').each(function (idx, $tr) {
            console.info($('td.blob-code-addition span.x', $tr).text());
          });
        });
    },
  }
});
