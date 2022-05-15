(function (root, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); }
    else if (typeof module === 'object' && module.exports) { module.exports = factory(); }
    else { root.returnExports = factory(); }
}(this, function () {

    /**
     * Create a ASCII table based on a bi-dimensional array of strings
     * @param  {Array}   m                                   bi-dimensional array of strings
     * @param  {Object}  [options]                           Options object
     * @param  {Object}  [options.row]                       Row options
     * @param  {String}  [options.row.paddingLeft="|"]       String added before the first column
     * @param  {String}  [options.row.paddingRight="|"]      String added after the last column
     * @param  {String}  [options.row.colSeparator="|"]      String added between columns
     * @param  {String}  [options.row.lineBreak="\n"]        String used to break rows
     * @param  {Object}  [options.cell]                      Cell options
     * @param  {String}  [options.cell.paddingLeft=" "]      String added before the cell content
     * @param  {String}  [options.cell.paddingRight=" "]     String added after the cell content
     * @param  {Number}  [options.cell.defaultAlignDir="1"]  Define the default alignment when not specified (-1=left, 0=center, 1=right)
     * @param  {Object}  [options.hr]                        Horizontal Line options
     * @param  {String}  [options.hr.str="—"]                String that will be repeated to make the Horizontal Line
     * @param  {String}  [options.hr.colSeparator="|"]       String added between columns
     * @return {string}                                      The final ASCII table
     * @author Victor N. wwww.victorborges.com
     * @date   2016-12-28
     */
    function matrixToAsciiTable(m, options) {

        options = defaults({
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
            hr: {
                str: "—",
                colSeparator: "|"
            }
        }, options);


        function defaults(defaultObj, options) {
            var isObj = function (x) { return x !== null && typeof x === "object"; };
            if(isObj(options))
                for (var prop in defaultObj) {
                    if (Object.prototype.hasOwnProperty.call(defaultObj, prop) && Object.prototype.hasOwnProperty.call(options, prop)) {
                        if (isObj(defaultObj[prop])) defaults(defaultObj[prop], options[prop])
                        else defaultObj[prop] = options[prop];
                    }
                }
            return defaultObj;
        }


        function repeatStr(width, str) {
            str = str || " ";
            var result = (width > 0) ? Array(Math.ceil(width / str.length) + 1).join(str) : "";
            return result.length > width ? result.substr(0, width) : result;
        }

        function alignText(txt, width) {
            function pad(txt, width, dir) {
                var p = width - txt.length;
                var pL = (dir > 0) ? p : (p / 2) << 0;
                var pR = (dir < 0) ? p : pL + (p - (pL * 2));
                return p > 0 ? (dir >= 0 ? Array(pL + 1).join(" ") : '') + txt + (dir <= 0 ? Array(pR + 1).join(" ") : '') : txt;
            }
            txt = "" + txt; //toString
            switch (txt.charAt(0)) {
                case '<':
                    return pad(txt.substr(1), width, -1); //align left
                case '^':
                    return pad(txt.substr(1), width, 0); //align center
                case '>':
                    return pad(txt.substr(1), width, 1); //align right
                default:
                    return pad(txt, width, options.cell.defaultAlignDir);
            }
        }

        function calcColumnsWidth(matrix) {
            //calculate columns width
            var colsWidth = [];
            rows: for (var r = 0, rLen = matrix.length; r < rLen; r++) {
                if (!matrix[r]) continue; //separator
                cols: for (var c = 0, cLen = matrix[r].length; c < cLen; c++) {
                    if (!colsWidth[c]) colsWidth[c] = 0;
                    colsWidth[c] = Math.max(colsWidth[c], ("" + matrix[r][c]).length);
                }
            }
            return colsWidth;
        }

        var paddingLength = options.cell.paddingLeft.length + options.cell.paddingRight.length;
        var hrSeparator = repeatStr(options.row.colSeparator.length, options.hr.colSeparator || options.hr.str);
        var colsWidth = calcColumnsWidth(m);

        //create table
        var table = [];
        for (var r = 0, rLen = m.length; r < rLen; r++) {
            var cols = [];

            if (m[r]) { //create columns
                for (c = 0; c < colsWidth.length; c++) {
                    cols.push(options.cell.paddingLeft + alignText(m[r][c], colsWidth[c]) + options.cell.paddingRight);
                }
                table.push([options.row.paddingLeft, cols.join(options.row.colSeparator), options.row.paddingRight].join(''));
            }
            else { //create horizontal line
                for (c = 0; c < colsWidth.length; c++) {
                    cols.push(repeatStr(colsWidth[c] + paddingLength, options.hr.str));
                }
                table.push([options.row.paddingLeft, cols.join(hrSeparator), options.row.paddingRight].join(''));
            }
        }
        return table.join(options.row.lineBreak);
    }
    
    return matrixToAsciiTable;
}));
