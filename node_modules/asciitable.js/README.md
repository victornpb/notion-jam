# asciitable.js
Generate a ASCII Table from a bidimensional array of strings

Live Test: https://jsfiddle.net/Victornpb/3j7wt2a1/show/

```
| ID |  Price   | Amount  |          Column D           | Column E  |
|————|——————————|—————————|—————————————————————————————|———————————|
|  1 | $ 100.00 |       0 | Very long text on this cell |     1     |
|  2 | $ 100.00 |      10 | Left aligned                |    123    |
|  3 | $ 100.00 |     100 |          Centered           |   12345   |
|  4 | $ 100.00 |    1000 |               Right aligned | 123456789 |
```


Source

    var m = [
        ['ID', '^Price', '^Amount', '^Column D', '^Column E'], //header
        null, //horizontal line
        ['1', '$ 100.00', '0', 'Very long text on this cell', '^1'],
        ['2', '$ 100.00', '10', '<Left aligned', '^123'],
        ['3', '$ 100.00', '100', '^Centered', '^12345'],
        ['4', '$ 100.00', '1000', '>Right aligned', '123456789'],
    ];
    
    var table = matrixToAsciiTable(m);
    
## Node Module (NPM)

From command line, run:

```
npm install asciitable.js
```

In your javascript file (Node.js / Webpack), write:

```
const matrixToAsciiTable = require('asciitable.js');
```


# Examples 

https://jsfiddle.net/Victornpb/3j7wt2a1/

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




## Dependencies

This module does not depend on anything. You can use it on a browser or node enviroment.

### Compability

It should work on anything that supports ECMAScript3 or above. Including IE.

## Suggestions / Questions

File a [issue](https://github.com/victornpb/asciitable.js/issues) on this repository.
