require('../less/app.less');
Vue.use(require('vue-cookies'));
const ajaxPromises = require('ajax-promises');
const $ = jQuery = require('jquery');
require('bootstrap');

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
  mounted: function () {
    this.protocol = this.$cookies.get('x-protocol') || 'https';
    this.domain = this.$cookies.get('x-domain') || 'github.com';
    this.group = this.$cookies.get('x-group') || 'wzdxt';
    this.repository = this.$cookies.get('x-repository') || 'findtext';
    this.from = this.$cookies.get('x-from') || 'master~1';
    this.to = this.$cookies.get('x-to') || 'master';
  },
  methods: {
    findText: function (e) {
      e.preventDefault();
      this.protocol = this.$refs.protocol.innerText.trim().replace(/\s/g, '');
      this.domain = this.$refs.domain.innerText.trim().replace(/\s/g, '');
      this.group = this.$refs.group.innerText.trim().replace(/\s/g, '');
      this.repository = this.$refs.repository.innerText.trim().replace(/\s/g, '');
      this.$cookies.set('x-protocol', this.protocol);
      this.$cookies.set('x-domain', this.domain);
      this.$cookies.set('x-group', this.group);
      this.$cookies.set('x-repository', this.repository);
      this.$cookies.set('x-from', this.from);
      this.$cookies.set('x-to', this.to);
      // var compareUrl = '/proxy/' + this.protocol + '/' + this.domain + '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to;
      var compareUrl = '/' + this.group + '/' + this.repository + '/compare/' + this.from + '...' + this.to + '?expanded=1';
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
