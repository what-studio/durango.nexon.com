var now = new Date();

// copyright
var $year = $('.copyright .year');
var since = Number($year.text());
var year = now.getFullYear();
if (since != year) {
  $year.html(since + '&ndash;' + year);
}

// contents
var $contents = $('.contents:eq(0)');
var $video = $('video:eq(0)');

History.Adapter.bind(window, 'anchorchange', function() {
  var hash = History.getHash();
  // video
  if (!hash) {
    $contents.hide();
    $video.get(0).play();
    return;
  } else {
    $contents.css({display: 'table'});
    $video.get(0).pause();
  }
  // content
  var $articles = $contents.find('article').hide();
  var $article = $contents.find('#' + hash).show();
  // navigators
  var $prev = $contents.find('.nav .prev');
  var $next = $contents.find('.nav .next');
  var isFirst = $article.is($articles.eq(0));
  var isLast = $article.is($articles.eq(-1));
  if (isFirst) {
    $prev.hide();
  } else {
    $prev.attr({href: '#' + $article.prev().attr('id')}).show();
  }
  if (isLast) {
    $next.hide();
  } else {
    $next.attr({href: '#' + $article.next().attr('id')}).show();
  }
});

$('.play').on('click', function() {
  History.pushState(null, null, '#teaser');
  return false;
});

$('article, .viewport').on('click', function(e) {
  if (e.target !== e.currentTarget) {
    return;
  }
  location.href = '#';
  History.Adapter.trigger(window, 'anchorchange');
  return false;
});

// i18n
var locale = null;
if (/ko/.exec(navigator.language)) {
  locale = 'ko';
}
var data = i18n[locale];
document.title = data.title;
$('h1 img').attr({src: data.logo, alt: data.title});
