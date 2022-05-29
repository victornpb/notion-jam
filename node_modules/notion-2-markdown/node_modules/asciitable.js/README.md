# asciitable.js
<!-- badge -->
[![LICENSE](https://img.shields.io/github/license/victornpb/asciitable.js?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/node/v/asciitable.js.svg?style=flat-square)](package.json)
[![CodeFactor](https://www.codefactor.io/repository/github/victornpb/asciitable.js/badge?style=flat-square)](https://www.codefactor.io/repository/github/victornpb/asciitable.js)
[![Coverage Status](https://img.shields.io/coveralls/victornpb/asciitable.js.svg?style=flat-square)](https://coveralls.io/github/victornpb/asciitable.js)

[![Version](https://img.shields.io/npm/v/asciitable.js.svg?style=flat-square)](https://www.npmjs.com/package/asciitable.js)
[![Downloads](https://img.shields.io/npm/dt/asciitable.js.svg?style=flat-square)](https://www.npmjs.com/package/asciitable.js)
[![](https://img.shields.io/bundlephobia/minzip/asciitable.js?style=flat-square)](https://www.npmjs.com/package/asciitable.js)
[![](https://img.shields.io/tokei/lines/github/victornpb/asciitable.js?style=flat-square)](https://www.npmjs.com/package/asciitable.js)
<!-- endbadge -->

Generate a ASCII Table from a bidimensional array of strings

Live Test: https://jsfiddle.net/Victornpb/3j7wt2a1/show/

#### Source
```js
const matrix = [
    ['ID', '^Price', '^Amount', '^Column D', '^Column E'],
    null, // horizontal line
    ['1', '$ 100.00', '0', 'Very long text on this cell', '^1'],
    ['2', '$ 100.00', '10', '<Left aligned', '^123'],
    ['3', '$ 100.00', '100', '^Centered', '^12345'],
    ['4', '$ 100.00', '1000', '>Right aligned', '123456789'],
];

const table = asciitable(matrix);
```

```
| ID |  Price   | Amount  |          Column D           | Column E  |
|----|----------|---------|-----------------------------|-----------|
|  1 | $ 100.00 |       0 | Very long text on this cell |     1     |
|  2 | $ 100.00 |      10 | Left aligned                |    123    |
|  3 | $ 100.00 |     100 |          Centered           |   12345   |
|  4 | $ 100.00 |    1000 |               Right aligned | 123456789 |
```

Default style generates a table compatible with GitHub flavored md

| ID |  Price   | Amount  |          Column D           | Column E  |
|----|----------|---------|-----------------------------|-----------|
|  1 | $ 100.00 |       0 | Very long text on this cell |     1     |
|  2 | $ 100.00 |      10 | Left aligned                |    123    |
|  3 | $ 100.00 |     100 |          Centered           |   12345   |
|  4 | $ 100.00 |    1000 |               Right aligned | 123456789 |

## Installation

### [NPM](https://www.npmjs.com/package/asciitable.js)

    npm install asciitable.js
### [Yarn](https://github.com/yarnpkg/yarn)

    yarn add asciitable.js

### CDN

    <script type="text/javascript" src="https://unpkg.com/asciitable.js/"></script>

## Packages

<!-- Output table (auto generated do not modify) -->

| File                    | Module Type | Transpiled | Source Maps |
|-------------------------|-------------|------------|-------------|
| dist/asciitable.d.ts    | es          | No         | No          |
| dist/asciitable.esm.mjs | esm         | No         | No          |
| dist/asciitable.cjs.js  | cjs         | Yes        | Yes         |
| dist/asciitable.esm.js  | esm         | Yes        | Yes         |
| dist/asciitable.js      | umd         | Yes        | Yes         |

<!-- END -->

# Customizable style

Customizer: https://jsfiddle.net/Victornpb/3j7wt2a1/

```
| ID |  Price   | Amount  |          Column D           | Column E  |
|————|——————————|—————————|—————————————————————————————|———————————|
|  1 | $ 100.00 |       0 | Very long text on this cell |     1     |
|  2 | $ 100.00 |      10 | Left aligned                |    123    |
|  3 | $ 100.00 |     100 |          Centered           |   12345   |
|  4 | $ 100.00 |    1000 |               Right aligned | 123456789 |



ID| Price  |Amount |         Column D          |Column E 
--|--------|-------|---------------------------|---------
 1|$ 100.00|      0|Very long text on this cell|    1    
 2|$ 100.00|     10|Left aligned               |   123   
 3|$ 100.00|    100|         Centered          |  12345  
 4|$ 100.00|   1000|              Right aligned|123456789
    


|ID| Price  |Amount |         Column D          |Column E |
|--+--------+-------+---------------------------+---------|
| 1|$ 100.00|      0|Very long text on this cell|    1    |
| 2|$ 100.00|     10|Left aligned               |   123   |
| 3|$ 100.00|    100|         Centered          |  12345  |
| 4|$ 100.00|   1000|              Right aligned|123456789|



│ ID │  Price   │ Amount  │          Column D           │ Column E  │
│────┼──────────┼─────────┼─────────────────────────────┼───────────│
│  1 │ $ 100.00 │       0 │ Very long text on this cell │     1     │
│  2 │ $ 100.00 │      10 │ Left aligned                │    123    │
│  3 │ $ 100.00 │     100 │          Centered           │   12345   │
│  4 │ $ 100.00 │    1000 │               Right aligned │ 123456789 │



║ ID │  Price   │ Amount  │          Column D           │ Column E  ║
║────┼──────────┼─────────┼─────────────────────────────┼───────────║
║  1 │ $ 100.00 │       0 │ Very long text on this cell │     1     ║
║  2 │ $ 100.00 │      10 │ Left aligned                │    123    ║
║  3 │ $ 100.00 │     100 │          Centered           │   12345   ║
║  4 │ $ 100.00 │    1000 │               Right aligned │ 123456789 ║



ID    Price     Amount             Column D             Column E  
──── ────────── ───────── ───────────────────────────── ───────────
  1   $ 100.00         0   Very long text on this cell       1     
  2   $ 100.00        10   Left aligned                     123    
  3   $ 100.00       100            Centered               12345   
  4   $ 100.00      1000                 Right aligned   123456789 
    
    
    
ID    Price     Amount             Column D             Column E  

1   $ 100.00         0   Very long text on this cell       1     
2   $ 100.00        10   Left aligned                     123    
3   $ 100.00       100            Centered               12345   
4   $ 100.00      1000                 Right aligned   123456789 


| ID '  Price   ' Amount  '          Column D           ' Column E  |
|'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''|
|  1 ' $ 100.00 '       0 ' Very long text on this cell '     1     |
|  2 ' $ 100.00 '      10 ' Left aligned                '    123    |
|  3 ' $ 100.00 '     100 '          Centered           '   12345   |
|  4 ' $ 100.00 '    1000 '               Right aligned ' 123456789 |



 ID |  Price   | Amount  |          Column D           | Column E  
~~~~+~~~~~~~~~~+~~~~~~~~~+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~+~~~~~~~~~~~
  1 | $ 100.00 |       0 | Very long text on this cell |     1     
  2 | $ 100.00 |      10 | Left aligned                |    123    
  3 | $ 100.00 |     100 |          Centered           |   12345   
  4 | $ 100.00 |    1000 |               Right aligned | 123456789 



| ID |  Price   | Amount  |          Column D           | Column E  |
|````|``````````|`````````|`````````````````````````````|```````````|
|  1 | $ 100.00 |       0 | Very long text on this cell |     1     |
|  2 | $ 100.00 |      10 | Left aligned                |    123    |
|  3 | $ 100.00 |     100 |          Centered           |   12345   |
|  4 | $ 100.00 |    1000 |               Right aligned | 123456789 |



|| ID ||  Price   || Amount  ||          Column D           || Column E  ||
||====||==========||=========||=============================||===========||
||  1 || $ 100.00 ||       0 || Very long text on this cell ||     1     ||
||  2 || $ 100.00 ||      10 || Left aligned                ||    123    ||
||  3 || $ 100.00 ||     100 ||          Centered           ||   12345   ||
||  4 || $ 100.00 ||    1000 ||               Right aligned || 123456789 ||



:║[ ID ]||[  Price   ]||[ Amount  ]||[          Column D           ]||[ Column E  ]║:
:║-=-=-=┼┼-=-=-=-=-=-=┼┼-=-=-=-=-=-┼┼-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-┼┼-=-=-=-=-=-=-║:
:║[  1 ]||[ $ 100.00 ]||[       0 ]||[ Very long text on this cell ]||[     1     ]║:
:║[  2 ]||[ $ 100.00 ]||[      10 ]||[ Left aligned                ]||[    123    ]║:
:║[  3 ]||[ $ 100.00 ]||[     100 ]||[          Centered           ]||[   12345   ]║:
:║[  4 ]||[ $ 100.00 ]||[    1000 ]||[               Right aligned ]||[ 123456789 ]║:
```


## Horizontal Line

You can add a horizontal line, by just adding a `null` row.

## Alignment

You can align text right, left, and center.
Just prepend the string with one of the following characters:

 - `<` to align Left
 - `>` to align Right
 - `^` to align Center
 
 Example 
 
    "<I'm aligned left"
    ">I'm aligned right"
    "^I'm centered"


# Customizations

Check out the Theme generator fiddle -> https://jsfiddle.net/Victornpb/3j7wt2a1/show/ 

## Options

It does allow a fairly amount of customization, by changing the defaults via options parameter.

Defaults:
```js
{
    row: {
        paddingLeft: "|", //before first column
        paddingRight: "|", //after last column
        colSeparator: "|", //between each column
        lineBreak: "\n"
    },
    cell: {
        paddingLeft: " ",
        paddingRight: " ",
        defaultAlignDir: 1 //left=-1 center=0 right=1
    },
    hr: { //horizontal line
        str: "—",
        colSeparator: "|"
    }
}
```

## Dependencies

This module does not depend on anything. You can use it on a browser or node enviroment.

### Compability

It should work on anything that supports ECMAScript3 or above. Including IE6.

## Suggestions / Questions

File a [issue](https://github.com/victornpb/asciitable.js/issues) on this repository.

## License

The code is available under the [MIT](LICENSE) license.
