// Language switch for the resume page.
// Order of preference: ?lang=ko|en in the URL, the last choice made on this
// device, then the browser language. English is the fallback.
(function () {
  var KEY = 'resume-lang';
  var TITLES = {
    en: 'Jack Jiyong Kim | Lead Data Scientist & AI Engineer',
    ko: '김지용 | Lead Data Scientist'
  };

  function valid(v) { return v === 'en' || v === 'ko'; }

  function initial() {
    var q = new URLSearchParams(location.search).get('lang');
    if (valid(q)) return q;
    try {
      var saved = localStorage.getItem(KEY);
      if (valid(saved)) return saved;
    } catch (e) { /* storage unavailable */ }
    return (navigator.language || '').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';
  }

  function apply(lang) {
    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    document.title = TITLES[lang];
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
  }

  // Runs in <head>, before the body is painted, so the wrong language never flashes.
  apply(initial());

  document.addEventListener('DOMContentLoaded', function () {
    apply(document.documentElement.getAttribute('data-lang'));

    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var lang = this.getAttribute('data-set-lang');
        apply(lang);
        try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
        // Keep the choice in the URL so the link can be shared in that language.
        history.replaceState(null, '', location.pathname + '?lang=' + lang);
      });
    }

    var print = document.getElementById('print');
    if (print) print.addEventListener('click', function () { window.print(); });
  });
})();
