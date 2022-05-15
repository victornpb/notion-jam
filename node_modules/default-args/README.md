# default-args
<!-- badge -->
[![Version](https://img.shields.io/npm/v/default-args.svg?style=flat-square)](https://www.npmjs.com/package/default-args)
[![CodeFactor](https://www.codefactor.io/repository/github/victornpb/default-args/badge?style=flat-square)](https://www.codefactor.io/repository/github/victornpb/default-args)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/victornpb/tiny-dedent?style=flat-square)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/default-args?style=flat-square)](https://www.npmjs.com/package/default-args)

[![Downloads](https://img.shields.io/npm/dt/default-args.svg?style=flat-square)](https://www.npmjs.com/package/default-args)
[![Node](https://img.shields.io/node/v/default-args.svg?style=flat-square)](package.json)
[![LICENSE](https://img.shields.io/github/license/victornpb/default-args?style=flat-square)](LICENSE)
<!-- endbadge -->

A simple function for providing defaults to an options to argument. No dependencies, tiny amount of code.

## Usage

```js
import defaults from 'default-args';

function helloWorld(options) {
    options = defaults({
        foo: true,
        bar: {
            a: 1,
            b: 2,
        },
    }, options);

    // do something with options
}
```
## Installation

### [NPM](https://npmjs.com/package/default-args)

    npm install default-args
### [Yarn](https://github.com/yarnpkg/yarn)

    yarn add default-args

### CDN

    <script type="text/javascript" src="https://unpkg.com/default-args/"></script>

## Packages

<!-- Output table (auto generated do not modify) -->

| File                      | Module Type | Transpiled | Source Maps |
|---------------------------|-------------|------------|-------------|
| dist/default-args.esm.mjs | esm         | No         | No          |
| dist/default-args.cjs.js  | cjs         | Yes        | Yes         |
| dist/default-args.esm.js  | esm         | Yes        | Yes         |
| dist/default-args.js      | umd         | Yes        | Yes         |

<!-- END -->



## License

The code is available under the [MIT](LICENSE) license.

## Contributing

We are open to contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) for more info.
