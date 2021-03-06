# backbone-partial-render

This package allows you to render your Backbone Views by updating the
View's DOM rather than completely replacing it every time you
`render`. This is similar to how React renders HTML. You can also have
Backbone leave custom rendering that happens outside `render` in
place.

## Install

`npm install backbone-partial-render` on [npm](https://www.npmjs.com/package/backbone-partial-render )

## Usage

You have a template that renders Backbone Model data as it updates
(with the help of your Backbone View).

Because we're in the real world you also have to update something in
your markup outside the normal `render` workflow. Now you start
doubting yourself. "Did I do this right?" "Why doesn't Backbone take
this into consideration?" "Is my whole life a lie?"

Not anymore!

With backbone-partial-render you can keep using `render` like normal
_and_ do all the custom UI work you want and never the twain shall
meet.

Your page:
```html
<div class="js-book">
</div>
```

Your JS:
```js
var PartialViewUpdateMixin = require('backbone-partial-render');
var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash');

var Book = Backbone.Model.extend({
  defaults: {
    title: "The Muted Heart",
    rating: "2.5",
    author: "Glenn Close, Sally Field"
  }
});

var BookView = Backbone.View.extend({
  template: _.template(
    '<h1><%= title %></h1><input class="js-title-text" type="text"/><button class="js-button">refresh</button><button class="js-image-button">image</button><img class="js-image"/>'
  ),
  events: {
    'click .js-button': '_setTitle',
    'click .js-image-button': '_setImage'
  },
  initialize: function() {
    this.initializePartialViewUpdateMixin();
    this.model.on('change', this.render.bind(this));
    this.render();
  },
  _setTitle: function() {
    this.model.set('title', this.$('.js-title-text').val());
  },
  _setImage: function() {
    this.$('.js-image').attr('src', 'http://assets.inhabitat.com/wp-content/blogs.dir/1/files/2014/07/true-cost-of-cheeseburger.jpg');
  },
  render: function() {
    // --------------------------------------
    // NOTE: This is where the magic happens
    // --------------------------------------
    this.renderByPatching({ignore: ['.js-image']});
    
    // or: this.renderByPatching({data: {a: '1', b: '2'}}). See "options" below.
  }
});
_.extend(BookView.prototype, PartialViewUpdateMixin);

$(function() {
  var bookView = new BookView({model: new Book(),
                               el: document.querySelector('.js-book')});
});

```

Now you can render all the books you want _and_ look at delectable
cheeseburgers at the same time.

Additionally, your form inputs won't be ruined and input focus will be
unaffected.

## options

- **`renderByPatching`** by default passes **`this.model.attributes`** to the template when rendering. You can **override** this by passing a `data` parameter. For example: **`renderByPatching({data: this.serialize()})`**.  

## pull requests

You submit em, I'll merge em.

## dedication

I dedicate this package to my family, my other family (BuzzFeed), and of course Cthulhu.
