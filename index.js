var diffDOM = require('diff-dom');
var $ = require('jquery');
var _ = require('lodash');

var PartialViewUpdateMixin = {
  /**
   *
   */
  initializePartialViewUpdateMixin: function() {
    this._diffdom = new diffDOM({valueDiffing: false});
  },

  /**
   * Only renders what's necessary by performing a diff between the
   * existing rendering and what an updated rendering would look like.
   *
   * @param {{ignore: String[]}} config - (optional) ignore: array of
   * selectors for elements to be ignored (not overwritten) when
   * rendering.
   */
  renderByPatching: function(config) {
    var ignore = [];
    if (config && config.ignore) {
      ignore = config.ignore;
    }
    var $updated = $(this.el.cloneNode(true));
    var attrs = {};
    if (this.model) {
      attrs = this.model.attributes;
    }
    $updated.html(this.template(attrs));
    var diff = this._diffdom.diff(this.$el[0], $updated[0]);
    var toDelete = [];
    _.each(diff, function(item) {
      var el = this._diffdom.getFromRoute(this.el, item.route);
      _.each(ignore, function (selector) {
        if ($(el).is(selector)) {
          toDelete.push(item.route);
          return;
        }
      }.bind(this));
    }.bind(this));
    diff = _.filter(diff, function(item) {
      return toDelete.indexOf(item.route) == -1;
    }.bind(this));
    this._diffdom.apply(this.el, diff);
  }
};

module.exports = PartialViewUpdateMixin;
