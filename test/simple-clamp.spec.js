'use strict';

var dom = require('utils/dom');
var simpleClamp = require('utils/simple-clamp');

describe('simple_clamp', function(){
  var testDiv1, testDiv2, testDiv3, testDiv3Wrapper;
  var ipsum = 'In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula quis, ' +
    'facilisis a orci. In aliquet facilisis condimentum. Donec at orci orci, a dictum justo. ' +
    'Sed a nunc non lectus fringilla suscipit. Vivamus pretium sapien sit amet mauris aliquet eleifend vel vitae arcu.';
  var short_ipsum = 'Lorem ipsum';

  function createEl(tagName, content, appendTo) {
    var el = document.createElement(tagName);
    el.innerHTML = content || '';
    el.style.width = '200px';
    if (appendTo) {
      appendTo.appendChild(el);
    }
    else {
      document.body.appendChild(el);
    }
    return el;
  }

  beforeEach(function () {
    testDiv1 = createEl('div', ipsum);
    testDiv2 = createEl('div', short_ipsum);
    testDiv3Wrapper = createEl('div', '');
    testDiv3Wrapper.style.height = '50px';
    testDiv3Wrapper.style.paddingTop = '10px';
    testDiv3Wrapper.style.paddingBottom = '10px';

    testDiv3 = createEl('div', ipsum, testDiv3Wrapper);
  });

  afterEach(function () {
    dom.remove(testDiv1);
    dom.remove(testDiv2);
    dom.remove(testDiv3Wrapper);
  });


  it('must truncate long div', function(){
    simpleClamp(testDiv1, {maxlines: 3});
    assert.include(testDiv1.innerHTML, '…');

    simpleClamp(testDiv2, {maxlines: 3});
    assert.notInclude(testDiv2.innerHTML, '…');
  });

  it('must truncate long div', function(){
    simpleClamp(testDiv3);
    assert.include(testDiv3.innerHTML, '…');
  });

});
