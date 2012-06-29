// Generated by CoffeeScript 1.3.3
(function() {
  var $, $$, animateScrollTo, circle, createCanvas, offsetTop, poa, pokeHoles, stamp, _ref;

  $ = function(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  };

  $$ = function(sel) {
    return document.querySelector(sel);
  };

  if ((_ref = window.requestAnimationFrame) == null) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(fn, el) {
      return setTimeout(fn, 1000 / 60);
    };
  }

  poa = document.getElementById('poa');

  /*
  Paralaxe na imagem do topo
  */


  if (screen.width > 640) {
    window.addEventListener('scroll', function(e) {
      var position;
      position = document.body.scrollTop;
      if (position < 600) {
        poa.style.backgroundPositionY = (-position / 2.2).toFixed(1) + 'px';
      }
    });
  }

  $('.speaker-image').forEach(function(svg) {
    var active, href, pattern;
    return;
    pattern = svg.getElementsByTagName('image')[0];
    href = pattern.getAttribute('xlink:href');
    active = href.replace('.jpg', '-active.jpg?jun28');
    svg.addEventListener('mouseover', function() {
      return pattern.setAttribute('xlink:href', active);
    });
    return svg.addEventListener('mouseout', function() {
      return pattern.setAttribute('xlink:href', href);
    });
  });

  /*
  Faz buracos nas fotos dos palestrantes. PNG é para os fracos,
  e assim as imagens ficam muito mais leves
  */


  createCanvas = function(w, h) {
    var canvas;
    canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
  };

  circle = function(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    return ctx.closePath();
  };

  stamp = function(image, x, y) {
    var canvas, ctx;
    canvas = createCanvas(120, 120);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = ctx.createPattern(image, 'no-repeat');
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(100,100,100,0.2)';
    circle(ctx, 60, 60, 60);
    ctx.translate(x, y);
    ctx.fill();
    ctx.stroke();
    return canvas;
  };

  pokeHoles = function(image) {
    var canvas1, canvas2;
    canvas1 = stamp(image, 0, 0);
    image.parentNode.appendChild(canvas1);
    canvas2 = stamp(image, 0, -120);
    canvas2.className = 'active';
    image.parentNode.appendChild(canvas2);
    image.parentNode.removeChild(image);
    localStorage[image.src] = canvas1.toDataURL();
    localStorage[image.src + ':hover'] = canvas2.toDataURL();
    return console.log(localStorage[image.src + ':hover'] != null);
  };

  if (document.createElement('canvas').getContext != null) {
    $('.speakers .photo img').forEach(function(image) {
      var active, cached, img, source;
      image.className = 'preparing';
      source = image.src;
      try {
        if (cached = localStorage[source]) {
          image.src = cached;
          image.className = 'gen';
          active = new Image;
          active.src = localStorage[source + ':hover'];
          active.className = 'active';
          return image.parentNode.appendChild(active);
        } else {
          img = new Image;
          img.onload = function() {
            return pokeHoles(image);
          };
          return img.src = image.src;
        }
      } catch (e) {
        return image.className = '';
      }
    });
  }

  /*
  Scrolling effect for navigation
  */


  offsetTop = function(el) {
    var top;
    if (!el.offsetParent) {
      return;
    }
    top = el.offsetTop;
    while (el = el.offsetParent) {
      top += el.offsetTop;
    }
    return top;
  };

  animateScrollTo = function(end, speed) {
    var direction, move, pos, range, start;
    if (speed == null) {
      speed = 5;
    }
    pos = 0;
    start = document.body.scrollTop;
    range = end - start;
    direction = end > start ? 1 : -1;
    move = function() {
      var scroll;
      pos += direction * speed;
      scroll = document.body.scrollTop = start + range * Math.sin(Math.PI / 2 * pos / 100);
      if (direction === 1 && scroll >= end) {
        return;
      }
      if (direction === -1 && scroll <= end) {
        return;
      }
      return requestAnimationFrame(move);
    };
    return move();
  };

  if (screen.width > 600) {
    $('#nav a').forEach(function(a) {
      return a.addEventListener('click', function(e) {
        var end, target;
        target = (e.target.href.split('#') || [])[1];
        if (target == null) {
          return;
        }
        end = offsetTop($$('#' + target));
        return animateScrollTo(end);
      });
    });
  }

  window.addEventListener('load', function() {
    var end, target;
    if (screen.width < 600) {
      return;
    }
    if (window.location.hash !== "") {
      if (target = $$(location.hash)) {
        end = offsetTop(target) - 20;
        return animateScrollTo(end, 20);
      }
    } else if ($$('.page') != null) {
      console.lg;
      end = offsetTop($$('.main'));
      return animateScrollTo(end);
    }
  }, false);

  /*
  External links
  */


  $('a[rel=external]').forEach(function(a) {
    return a.addEventListener('click', function(e) {
      e.preventDefault();
      return window.open(e.target.href || e.target.parentNode.href);
    });
  });

}).call(this);
