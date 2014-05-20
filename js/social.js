(function(doc, script) {
  var fjs = doc.getElementsByTagName(script)[0];
  var frag = doc.createDocumentFragment();
  function add(url, id) {
    if (doc.getElementById(id)) {
      return;
    }
    var js = doc.createElement(script);
    js.src = url;
    id && (js.id = id);
    frag.appendChild(js);
  };
  // Facebook SDK
  add('//connect.facebook.net/en_US/all.js#xfbml=1&appId=200103733347528',
      'facebook-jssdk');
  // Twitter SDK
  add('//platform.twitter.com/widgets.js');
  fjs.parentNode.insertBefore(frag, fjs);
}(document, 'script'));
