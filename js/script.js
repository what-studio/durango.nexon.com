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

function show($elem) {
  return $elem.addClass('active');
}

function hide($elem) {
  return $elem.removeClass('active');
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
}).trigger('resize');

$('.youtube').each(function() {
  var $youtube = $(this);
  var $embed = $youtube.find('>:eq(0)');
  var aspectRatio = $embed.attr('height') / $embed.attr('width');
  $youtube.css({paddingBottom: aspectRatio * 100 + '%'});
});
