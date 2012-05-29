(function() {
  var $, $$, baseSpeed, cssAnimation, cssPrefix, imageSizes, imageSpeed, p, parts, prefix, resizeTimer, setupAnimation, _i, _len;

  $ = function(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  };

  $$ = function(sel) {
    return document.querySelector(sel);
  };

  prefix = (function() {
    var div, p, _i, _len, _ref;
    div = document.createElement('div');
    _ref = ['Webkit', 'Moz', 'O', 'ms'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (div.style[p + 'Transform'] != null) return p;
    }
  })();

  cssPrefix = !prefix ? '' : "-" + (prefix.toLowerCase()) + "-";

  parts = [$$('.p0'), $$('.p1'), $$('.p2'), $$('.p3'), $$('.p4')];

  for (_i = 0, _len = parts.length; _i < _len; _i++) {
    p = parts[_i];
    p.style.display = 'block';
  }

  imageSizes = [[980, 400], [980, 440], [625, 60], [625, 80], [625, 105]];

  imageSpeed = [1, 1.5, 4.5, 5.2, 7];

  baseSpeed = 500;

  cssAnimation = null;

  (setupAnimation = function() {
    var rules;
    if (!prefix || screen.width < 980) return;
    cssAnimation = document.createElement('style');
    cssAnimation.type = 'text/css';
    $$('head').appendChild(cssAnimation);
    $$('html').style.background = '#324544';
    rules = '';
    parts.forEach(function(p, i) {
      var height, imageWidth, styles, width;
      styles = getComputedStyle(p);
      width = parseInt(styles.getPropertyValue('width'), 10);
      height = parseInt(styles.getPropertyValue('height'), 10);
      imageWidth = Math.floor((height / imageSizes[i][1]) * imageSizes[i][0]);
      return rules += "@" + cssPrefix + "keyframes slice" + i + " {\n    0%   { " + cssPrefix + "transform:translateX(0); }\n    100% { " + cssPrefix + "transform:translateX(-" + imageWidth + "px); }\n}\n.p" + i + " {\n    width: " + (width + imageWidth) + "px;\n    " + cssPrefix + "animation: slice" + i + " " + (Math.floor(baseSpeed / imageSpeed[i])) + "s ease infinite;\n\n}";
    });
    if (cssAnimation.styleSheet) {
      cssAnimation.styleSheet.cssText = rules;
    } else {
      cssAnimation.appendChild(document.createTextNode(rules));
    }
  })();

  resizeTimer = 0;

  window.onresize = function() {
    clearTimeout(resizeTimer);
    return resizeTimer = setTimeout(function() {
      if (cssAnimation != null) cssAnimation.parentNode.removeChild(cssAnimation);
      return setupAnimation();
    }, 300);
  };

}).call(this);
