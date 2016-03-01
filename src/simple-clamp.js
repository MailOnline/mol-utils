'use strict';

var utilities = require('./utility-functions');

var defaults = {
  separators : [' ', ''],
  ellipsis: '&hellip;'
};

function getLineHeight(element){
  //var style = window.getComputedStyle(element);
  //var lh = style.lineHeight;
  //if (lh != 'normal'){
  //  return parseFloat(lh);
  //}
  var temp = document.createElement(element.nodeName);
  temp.setAttribute('style','margin:0px;padding:0px;font-family:'+element.style.fontFamily+';font-size:'+element.style.fontSize);
  temp.innerHTML = 'test';
  temp = element.parentNode.appendChild(temp);
  var ret = temp.clientHeight;
  temp.parentNode.removeChild(temp);
  return ret;
}

function getVerticalPadding(el){
  var style;
  if (window.getComputedStyle){
    style = window.getComputedStyle(el);
  }
  else {
    style = el.currentStyle;
  }
  return parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
}

function executeClamp(el, opts){
  var i, sep, segments, text, lastSegment;
  opts = opts || {};
  var separators = opts.separators || defaults.separators;
  var ellipsis = opts.ellipsis || defaults.ellipsis;
  var maxlines = opts.maxlines;
  var maxHeight;
  if (maxlines){
    // fixed number of lines
    maxHeight = (maxlines * getLineHeight(el)) + getVerticalPadding(el);
  }
  else {
    //fit the parent
    maxHeight = el.parentNode.clientHeight -  getVerticalPadding(el.parentNode);
  }


  text = el.getAttribute('clamp-full-text');

  if (text){
    // restoring text
    el.innerHTML = text;
  }
  else {
    text = el.innerHTML;
    el.setAttribute('clamp-full-text', text);
  }

  if (el.clientHeight <= maxHeight){
    return;
  }

  for (i = 0; i < separators.length; i++){
    sep = separators[i];
    if(lastSegment){
      text += lastSegment;
      el.innerHTML = text + ellipsis;
    }
    segments = text.split(sep);
    while (el.clientHeight > maxHeight && segments.length > 0){
      lastSegment = sep + segments.pop();
      text = segments.join(sep);
      el.innerHTML = text + ellipsis;
    }
  }
}

function simpleClamp(el, opts) {
  if(!el) {
    return;
  }

  if (utilities.isNodeList(el)){
    for (var i = 0 ; i < el.length; i++){
      executeClamp(el[i], opts);
    }
  }
  else {
    executeClamp(el, opts);
  }
}

module.exports = simpleClamp;

