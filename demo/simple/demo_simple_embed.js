'use strict';

var injectDOMElement = function injectDOMElement(tagName, targetSelector) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var element = document.createElement(tagName);
  Object.keys(options).forEach(function (key) {
    return element[key] = options[key];
  });
  document.querySelector(targetSelector).appendChild(element);
  return element;
};


var globalInitData;

var init = function init(initData) {
  globalInitData = initData;
  var host = 'http://localhost/three/demo/simple/';
  var cssHref = host+'/demo_simple_embed.css';
  injectDOMElement('link', 'head', { rel: 'stylesheet', href: cssHref });
  var iframeSrc = host+'/index.html';
  var height = ' height="'+initData.height+'px" ';
  var width = ' width="400px" ';
  var iframeHTML = '<iframe '+height+width+' id=\'bp-widget\' frameborder=\'0\' src=\'' + iframeSrc + '\' />';
  injectDOMElement('div', 'body', { id: 'bp-web-widget', innerHTML: iframeHTML });
  var iframeWindow = document.querySelector('#bp-web-widget > #bp-widget').contentWindow;
  console.log(initData.userName+' is username');
};


window.CactusWebChat = { init: init };

window.onload = function() {
  var globalInitDataInJSON =JSON.stringify(globalInitData);
  var iframeWindow = document.querySelector('#bp-web-widget > #bp-widget').contentWindow;
  iframeWindow.postMessage(globalInitDataInJSON, '*');
}