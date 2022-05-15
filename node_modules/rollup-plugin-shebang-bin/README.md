# rollup-plugin-shebang-bin

[![Latest version](https://img.shields.io/npm/v/rollup-plugin-shebang-bin)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/rollup-plugin-shebang-bin)
](https://www.npmjs.com/package/rollup-plugin-shebang-bin)
[![Coverage](https://codecov.io/gh/prantlf/rollup-plugin-shebang-bin/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/rollup-plugin-shebang-bin)

Richly configurable [Rollup] plugin for preserving or inserting shebang (hashbang) and making scripts executable.

## Requirements

This plugin requires [Node.js] 14 or newer and [Rollup] 2 or newer.

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 6 or newer.

```sh
npm i -D rollup-plugin-shebang-bin
pnpm i -D rollup-plugin-shebang-bin
yarn add rollup-plugin-shebang-bin
```

## Usage

Create a `rollup.config.js` [configuration file] and import the plugin:

```js
import shebang from 'rollup-plugin-shebang-bin'

export default {
  input: 'src/cli.js',
  output: {
    dir: 'bin',
    format: 'cjs'
  },
  plugins: [shebang()]
}
```

Then call `rollup` either via the [command-line] or [programmatically].

The file `bin/cli.js` will be executable with the following content:

```js
#!/usr/bin/env node

... // content of src/cli.js
```

## Options

The following options can be passed in an object to the plugin function to change the default values.

### `include`

Type: `Array<String>`<br>
Default: ['**/*.js']

[Pattern] to match files which will be processed by the plugin.

### `exclude`

Type: `Array<String>`<br>
Default: []

[Pattern] to match files which will be ignored by the plugin.

### `regexp`

Type: `RegExp`<br>
Default: `/^\s*#!.*\n*/`

The regular expression to match the shebang at the beginning of an input file.

### `shebang`

Type: `String`<br>
Default: `'#!/usr/bin/env node'`

The shebang to insert to the beginning of an output file.

### `separator`

Type: `String`<br>
Default: `'\n\n'`

The whitespace to insert after the shebang to separate if from the rest of an output file.

### `mode`

Type: `Number`<br>
Default: `0o755`

The permissions to apply to an output file. The value will be masked by the process `umask`.

### `insert`

Type: `Boolean`<br>
Default: `true`

If the shebang will be inserted to an output file.

### `preserve`

Type: `Boolean`<br>
Default: `true`

If an existing shebang will be preserved in an output file.

If you set `preserve` to `false` and `insert` to `true`, the existing shebang will be removed and a new one inserted to an output file.

### `executable`

Type: `Boolean`<br>
Default: `true`

If an output file should become executable permissions.

## License

Copyright (C) 2022 Ferdinand Prantl

Licensed under the [MIT License].

[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[Rollup]: https://rollupjs.org/
[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[configuration file]: https://www.rollupjs.org/guide/en/#configuration-files
[command-line]: https://www.rollupjs.org/guide/en/#command-line-reference
[programmatically]: https://www.rollupjs.org/guide/en/#javascript-api
[Pattern]: https://www.linuxjournal.com/content/bash-extended-globbing
