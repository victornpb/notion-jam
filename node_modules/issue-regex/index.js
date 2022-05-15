'use strict';

// https://regex101.com/r/SQrOlx/14
module.exports = () => /(?:(?<![/\w-.])\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/g;
