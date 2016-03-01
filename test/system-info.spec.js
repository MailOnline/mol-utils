'use strict';

var systemInfo = require('utils/system-info');

describe('systemInfo', function(){
  it('must be an object', function(){
    assert.isObject(systemInfo);
  });
});