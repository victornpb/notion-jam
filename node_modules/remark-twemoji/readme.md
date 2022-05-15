# remark-twemoji

[![prettier][prettier-image]][prettier-url]
[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]

[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[npm-image]: https://img.shields.io/npm/v/remark-twemoji.svg
[npm-url]: https://npmjs.org/package/remark-twemoji
[travis-url]: https://travis-ci.org/madiodio/remark-twemoji
[travis-image]: https://img.shields.io/travis/madiodio/remark-twemoji/master.svg

Remark plugin to replace your emoji by using [twemoji](https://github.com/twitter/twemoji).

## Install

```bash
npm install --dev remark-twemoji
```

## Usage

```js
remark().use(remarkTwemoji, { options });
```

1.  Basic usage

```js
const remark = require("remark");
const twemoji = require("remark-twemoji");

const doc = "😂";
remark()
  .use(emoji)
  .process(doc, function(err, file) {
    console.log(String(file));
  });
// => <img class="emoji" draggable="false" alt="😂" src="https://twemoji.maxcdn.com/2/128x128/1f602.png" title="😂"/>
```

2.  Usage with [mdx](https://github.com/mdx-js/mdx) (basically what this plugin has been for):

Somewhere in your webpack config file:

```js
const webpack = require("webpack");
const twemoji = require("remark-twemoji");

...{
  test: /\.md$/,
  exclude: /node_modules/,
  use: [
    "babel-loader",
    {
      loader: "@mdx-js/loader",
      options: {
        mdPlugins: [twemoji, { isReact: true }]
      }
    }
  ]
},...
```

For more informations, check [this section](https://github.com/mdx-js/mdx#plugins) on the mdx docs.

## Options

### `options.isReact` (boolean)

When using this plugin in a React setup, Twemoji will parse a dom node containing the attribute `class` instead of `className` which causes a warning at runtime. So if you're using React in your setup, use this to instruct the plugin to replace `class` by `className` in the final node, eg: ...`[twemoji, { isReact: true }]`...

## Other options

### `Object`

```js
  {
    callback: Function,   // default the common replacer
    attributes: Function, // default returns {}
    base: string,         // default MaxCDN
    ext: string,          // default ".png"
    className: string,    // default "emoji"
    size: string|number,  // default "36x36"
    folder: string        // in case it's specified
                          // it replaces .size info, if any
  }
```

These are the options you can pass to this plugin as the twemoji options, you can read more about them [here](https://github.com/twitter/twemoji#object-as-parameter).

## Inspirations

* [gatsby-remark-twemoji](https://github.com/btnwtn/gatsby-remark-twemoji)
* [remark-emoji](https://github.com/rhysd/remark-emoji/)

## License

MIT
