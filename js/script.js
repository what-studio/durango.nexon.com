var now = new Date();
var $win = $(window);
var $doc = $(document);
var $body = $(document.body);

function _ga() {
  // It calls the Google Analytics function if exists.
  window.ga && window.ga.apply(window.ga, arguments);
}

// copyright

var $year = $('.copyright .year');
var since = Number($year.text());
var year = now.getFullYear();
if (since != year) {
  $year.html(since + '&ndash;' + year);
}

// contents

var $contents = $('.contents:eq(0)');
var $view = $('.view:eq(0)');
var $video = $('video:eq(0)');
var $youtubes = $('.youtube');

function show($elem) {
  return $elem.addClass('active');
}

function hide($elem) {
  return $elem.removeClass('active');
}

function switchYoutube() {
  var $youtubes = $('.youtube');
  $youtubes.each(function() {
    var $youtube = $(this);
    var $iframe = $youtube.find('iframe');
    if (!$iframe.length) {
      var youtube = $youtube.data('youtube');
      $iframe = $('<iframe frameborder="0" allowfullscreen="true">');
      $iframe.attr({
        src: '//youtube.com/embed/' + youtube +
             '?rel=0&showinfo=0&enablejsapi=1'
      });
      $youtube.append($iframe);
    }
    var func = $youtube.is(':visible') ? 'playVideo' : 'pauseVideo';
    var message = '{"event":"command","func":"' + func + '","args":""}';
    $iframe.get(0).contentWindow.postMessage(message, '*');
  });
}

var _prevHash = null;
History.Adapter.bind(window, 'anchorchange', function() {
  var hash = History.getHash();
  if (hash === _prevHash) {
    // avoid duplication
    return;
  } else {
    _prevHash = hash;
  }
  // video
  if (!hash) {
    _ga('send', 'pageview', '/');
    hide($contents);
    $video.get(0).play();
    switchYoutube();
    return;
  } else {
    _ga('send', 'pageview', '/#' + hash, '/#' + hash);
    show($contents);
    $video.get(0).pause();
    $view.attr({href: '#' + hash});
  }
  // content
  var $articles = hide($contents.find('article'));
  var $article = show($contents.find('#' + hash));
  switchYoutube();
  // navigators
  var $prevArticle = $article.prev();
  var $nextArticle = $article.next();
  if (!$prevArticle.length) {
    $prevArticle = $articles.eq(-1);
  }
  if (!$nextArticle.length) {
    $nextArticle = $articles.eq(0);
  }
  $contents.find('.nav .prev').attr({href: '#' + $prevArticle.attr('id')});
  $contents.find('.nav .next').attr({href: '#' + $nextArticle.attr('id')});
});

$('article, .viewport').on('click', function(e) {
  if (e.target !== e.currentTarget) {
    return;
  }
  location.href = '#';
  History.Adapter.trigger(window, 'anchorchange');
  e.preventDefault();
});

$('article img.content').each(function() {
  var $img = $(this);
  var $link = $('<a target="_blank">').attr({href: $img.attr('src')});
  $img.wrap($link);
});

$win.on('keydown', function(e) {
  if (!$contents.is(':visible')) {
    return;
  }
  var $nav;
  if ($.inArray(e.keyCode, [37, 38, 65, 87, 72, 75]) !== -1) {
    // left|top or a|w or h|k
    $nav = $('.nav .prev');
  } else if ($.inArray(e.keyCode, [39, 40, 68, 83, 74, 76]) !== -1) {
    // right|down or d|s or j|l
    $nav = $('.nav .next');
  } else if (e.keyCode === 27) {
    // esc
    $('.article, .viewport').click();
    return;
  } else {
    return;
  }
  location.href = $nav.attr('href');
  $nav.stop().css({opacity: 1}).animate({opacity: 0.5}, function() {
    $(this).css({opacity: ''});
  });
});

// responsive

$win.on('resize', function() {
  // centralize the background video
  var $parent = $video.parent();
  var width = $video.width();
  var height = $video.height();
  var aspectRatio = width / height;
  var expectedAspectRatio = Number($video.attr('width')) /
                            Number($video.attr('height'));
  if (Math.abs(expectedAspectRatio - aspectRatio) > 0.01) {
    setTimeout($.proxy(arguments.callee, this), 1);
    return;
  }
  $video.css({
    left: Math.min(0, ($parent.width() - width) / 2),
    top: Math.min(0, ($parent.height() - height) / 2)
  });
  switchYoutube();
});

$youtubes.each(function() {
  var $youtube = $(this);
  var $embed = $youtube.find('>:eq(0)');
  var aspectRatioString = $youtube.data('aspect-ratio');
  var aspectRatioArray = aspectRatioString.split(':');
  var aspectRatio = Number(aspectRatioArray[0]) / Number(aspectRatioArray[1]);
  $youtube.css({paddingBottom: 1 / aspectRatio * 100 + '%'});
});

// less than IE9
if (window.ltie9) {
  var $bg = $('<div class="bg">');
  $bg.append('<img src="bg/bg1.jpg" />');
  $bg.append('<img src="bg/bg2.jpg" />');
  $bg.append('<img src="bg/bg3.jpg" />');
  $bg.append('<img src="bg/bg4.jpg" />');
  $bg.append('<img src="bg/bg5.jpg" />');
  $bg.append('<img src="bg/bg6.jpg" />');
  $('video').replaceWith($bg);
  var $imgs = $('.bg img');
  $win.on('resize', function() {
    var width = $imgs.width();
    var height = $imgs.height();
    var aspectRatio = width / height;
    var bgWidth = $bg.width();
    var bgHeight = $bg.height();
    var bgAspectRatio = bgWidth / bgHeight;
    if (aspectRatio > bgAspectRatio) {
      $imgs.css({width: bgHeight * aspectRatio, height: bgHeight});
      $imgs.css({marginTop: 0, marginLeft: (bgWidth - $imgs.width()) / 2});
    } else {
      $imgs.css({width: bgWidth, height: bgWidth / aspectRatio});
      $imgs.css({marginTop: (bgHeight - $imgs.height()) / 2, marginLeft: 0});
    }
    $bg.addClass('active');
  });
  var i = 0;
  function bgAnimation() {
    var $img = $imgs.eq(i++ % $imgs.length);
    var $nextImg = $img.next();
    if (!$nextImg.length) {
      $nextImg = $imgs.eq(0);
    }
    $img.css({zIndex: i + 1}).fadeOut('slow');
    $nextImg.css({zIndex: i}).show();
  }
  $imgs.filter(':gt(0)').hide();
  setInterval(bgAnimation, 5000);
  $imgs.eq(0).on('load', function() {
    $win.trigger('resize');
  });
} else {
  $win.trigger('resize');
}
