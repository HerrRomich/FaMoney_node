'use strict';

const launcher = require('..');
const assert = require('assert').strict;

assert.strictEqual(launcher(), 'Hello from launcher');
console.info("launcher tests passed");
