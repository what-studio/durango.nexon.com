var i18n = {};
i18n[null] = {title: 'Durango', logo: 'img/logo-en.png'};
i18n['ko'] = {title: '야생의 땅: 듀랑고', logo: 'img/logo-ko.png'};

// apply
var locale = null;
if (/ko/.exec(navigator.language || navigator.userLanguage)) {
  locale = 'ko';
}
var data = i18n[locale];
document.title = data.title;
$('h1 img').attr({src: data.logo, alt: data.title});
