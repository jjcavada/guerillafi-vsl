/* GuerillaFi VSL funnel: flywheel tabs, video slot, calendar slot. Vanilla, no framework. */
(function () {
  'use strict';

  /* ---------- Flywheel (ARIA tabs, roving tabindex) ---------- */
  var wheel = document.querySelector('.wheel');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.spoke[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  var fly = document.querySelector('.fly');
  var nav = document.querySelector('.fly__nav');
  var count = document.getElementById('fly-count');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = 0;
  var ready = false;
  var leaving = null, leaveTimer = 0;
  var onPanelChange = function () {};   // set by the Meta ad unit below

  function finishLeave() {
    clearTimeout(leaveTimer);
    if (!leaving) return;
    leaving.classList.remove('is-leaving');
    leaving.removeAttribute('aria-hidden');
    if (!leaving.classList.contains('is-on')) leaving.hidden = true;
    leaving = null;
  }

  function pulse(tab) {
    var dot = tab.querySelector('.spoke__dot');
    if (!dot) return;
    dot.classList.remove('is-pulse');
    void dot.offsetWidth;            // restart the one-shot pulse
    dot.classList.add('is-pulse');
  }

  // instant = keyboard (arrows, Home, End): no motion on keyboard-driven changes.
  function select(i, focus, instant) {
    var n = tabs.length;
    i = ((i % n) + n) % n;
    var prev = current;
    var changed = i !== prev;
    var animate = ready && changed && !instant && !reduceMotion.matches;
    finishLeave();
    if (fly) fly.classList.toggle('fly--anim', animate);
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].classList.toggle('is-on', on);
      panels[k].hidden = !on;
    });
    if (animate) {
      // the old panel fades out in place for --dur-out, underneath the new one
      leaving = panels[prev];
      leaving.hidden = false;
      leaving.setAttribute('aria-hidden', 'true');
      leaving.classList.add('is-leaving');
      leaveTimer = setTimeout(finishLeave, 140);
      pulse(tabs[i]);
    }
    // keep the pointer turning the short way round
    var delta = i - (current % n);
    if (delta > n / 2) delta -= n;
    if (delta < -n / 2) delta += n;
    var turns = (parseFloat(wheel.style.getPropertyValue('--sel')) || 0) + delta;
    wheel.style.setProperty('--sel', String(turns));
    current = i;
    if (count) count.textContent = (i + 1) + ' of ' + n;
    if (focus) tabs[i].focus();
    onPanelChange();
  }

  // When the card sits below the wheel (phone, tablet), bring the arrows and the top of the card into view after a tap.
  function reveal() {
    var target = (nav && !nav.hidden) ? nav : panels[current];
    if (!target) return;
    var top = target.getBoundingClientRect().top;
    var navH = (document.querySelector('.nav') || { offsetHeight: 0 }).offsetHeight;
    if (top < navH || top > window.innerHeight * 0.66) {
      target.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  if (wheel && tabs.length) {
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { select(k, false); reveal(); });
      t.addEventListener('keydown', function (e) {
        var key = e.key;
        if (key === 'ArrowRight' || key === 'ArrowDown') { e.preventDefault(); select(current + 1, true, true); }
        else if (key === 'ArrowLeft' || key === 'ArrowUp') { e.preventDefault(); select(current - 1, true, true); }
        else if (key === 'Home') { e.preventDefault(); select(0, true, true); }
        else if (key === 'End') { e.preventDefault(); select(tabs.length - 1, true, true); }
      });
      var dot = t.querySelector('.spoke__dot');
      if (dot) dot.addEventListener('animationend', function () { dot.classList.remove('is-pulse'); });
    });
    if (nav) {
      nav.hidden = false;
      document.getElementById('fly-prev').addEventListener('click', function () { select(current - 1, false); reveal(); });
      document.getElementById('fly-next').addEventListener('click', function () { select(current + 1, false); reveal(); });
    }
    wheel.style.setProperty('--sel', '0');
    select(0, false);
    ready = true;
  }

  /* ---------- Meta ad unit: Uni K Wax Arizona's live ads (copy verbatim from assets/ads/ads.json) ----------
     The loop plays muted, inline, looping, only while the Meta spoke is open AND the unit is on screen.
     Reduced motion: never autoplays; the viewer gets a play button. Their own dashes are kept, written as unicode escapes. */
  var ADS = [
    { id: '28927950736870580', onscreen: 'What if',
      text: ["A Brazilian you don't have to brace for.",
        "Experienced waxers, all-natural elastic wax, and a studio that doesn't rush you through it \u2014 so your results stay consistent instead of fighting ingrowns between every appointment.",
        'First-time guests get 25% off your entire first order. Now open at multiple locations across the valley.',
        'Book your service online below.'],
      link: 'UNIKWAXSTUDIO.COM', h: '25% Off Your First Order', d: 'Now open valley-wide', cta: 'Book now',
      hook: 'What if your Brazilian wax felt comfortable instead of something you just have to get through for bikini season?' },
    { id: '1122593966810701', onscreen: 'Arizona summers make',
      text: ["Waxing shouldn't be something you put off until you can't put it off anymore.",
        "Uni K Wax uses an all-natural elastic wax and waxers who've done this long enough to do it right \u2014 no rushing you out the door, no gritting your teeth through it.",
        'First-time guests get 25% off your entire first order. Now open at multiple locations across the valley.',
        'Book below and see how easy it can be.'],
      link: 'UNIKWAXSTUDIO.COM', h: '25% Off Your First Order', d: 'Now open valley-wide', cta: 'Book now',
      hook: 'Arizona summers make bikini waxing a must, but ingrowns and discomfort cause lots of women to avoid waxing altogether.' },
    { id: '1128244913365083', onscreen: 'Waxing gets a',
      text: ['Experience our all-natural elastic wax for less. First-time guests receive 25% off your entire first order.'],
      link: 'HTTPS://BOOK.UNIKWAXAZ.COM/BOOKING-FUNNEL/', h: 'First time at Uni K Wax? Enjoy 25% off your entire first order and experience waxing the natural way.', d: '', cta: 'Learn more',
      hook: "Waxing gets a bad reputation, but we're here to make it a comfortable part of your self-care routine." },
    { id: '1481290280559778', onscreen: 'INTERACTIVE.',
      text: [],
      link: 'HTTPS://BOOK.UNIKWAXAZ.COM/BOOKING-FUNNEL/', h: '25% Off First Order', d: '', cta: 'Learn more',
      hook: "I got my arms waxed today, which is new for me. I've always been very nervous because I have eczema, very sensitive and dry skin, but I am getting married this year." },
    { id: '2071516706853486', onscreen: 'WHAT TRULY',
      text: ['Experience our all-natural elastic wax for less. First-time guests receive 25% off your entire first order.'],
      link: 'HTTPS://BOOK.UNIKWAXAZ.COM/BOOKING-FUNNEL/', h: 'First time at Uni K Wax? Enjoy 25% off your entire first order and experience waxing the natural way.', d: '', cta: 'Learn more',
      hook: "Waxing gets a bad reputation, but we're here to make it a comfortable part of your self-care routine." }
  ];

  var fb = document.getElementById('fbad');
  var metaPanel = document.getElementById('p-1');
  var video = document.getElementById('fbad-video');
  if (fb && metaPanel && video) {
    var media = document.getElementById('fbad-media');
    var poster = document.getElementById('fbad-poster');
    var toggle = document.getElementById('fbad-toggle');
    var textBox = document.getElementById('fbad-text');
    var lead = document.getElementById('fbad-lead');
    var more = document.getElementById('fbad-more');
    var see = document.getElementById('fbad-see');
    var hookEl = document.getElementById('ad-hook');
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.adthumb'));
    var inView = !('IntersectionObserver' in window);
    var choice = null;              // null = follow the defaults, 'play' or 'pause' = the viewer decided
    var adIdx = 0;

    video.muted = true;
    video.defaultMuted = true;

    function wantPlay() {
      if (!metaPanel.classList.contains('is-on') || !inView || document.visibilityState === 'hidden') return false;
      if (choice) return choice === 'play';
      return !reduceMotion.matches;
    }
    function paint() {
      var playing = !video.paused && !video.ended;
      media.classList.toggle('is-playing', playing && video.readyState > 2);
      toggle.hidden = false;
      toggle.classList.toggle('is-playing', playing);
      toggle.classList.toggle('is-big', !playing && (choice === 'pause' || (choice === null && reduceMotion.matches)));
      toggle.setAttribute('aria-label', playing ? 'Pause the ad video' : 'Play the ad video (muted)');
    }
    function sync() {
      if (wantPlay()) {
        if (!video.getAttribute('src')) video.src = video.getAttribute('data-src');
        video.muted = true;
        var p = video.play();
        if (p && p.catch) p.catch(paint);
      } else if (!video.paused) {
        video.pause();
      }
      paint();
    }
    onPanelChange = sync;

    ['playing', 'pause', 'loadeddata'].forEach(function (ev) { video.addEventListener(ev, paint); });
    document.addEventListener('visibilitychange', sync);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', sync);
    if (!('IntersectionObserver' in window)) sync();
    else new IntersectionObserver(function (entries) { inView = entries[entries.length - 1].isIntersecting; sync(); }, { threshold: 0.35 }).observe(media);

    toggle.addEventListener('click', function () {
      if (!video.paused) { choice = 'pause'; video.pause(); paint(); }
      else { choice = 'play'; sync(); }
    });

    see.addEventListener('click', function () {
      more.hidden = false;
      see.hidden = true;
      see.setAttribute('aria-expanded', 'true');
      more.focus({ preventScroll: true });
    });

    function show(k) {
      var a = ADS[k];
      if (!a || k === adIdx) return;
      adIdx = k;
      thumbs.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-ad') === String(k) ? 'true' : 'false'); });
      // primary text: first paragraph, then "See more" for the rest (as the feed truncates it)
      textBox.hidden = !a.text.length;
      lead.textContent = a.text[0] || '';
      more.replaceChildren.apply(more, a.text.slice(1).map(function (t) { var p = document.createElement('p'); p.textContent = t; return p; }));
      more.hidden = true;
      see.hidden = a.text.length < 2;
      see.setAttribute('aria-expanded', 'false');
      // media: poster first, the loop only if it is wanted
      var base = 'assets/ads/meta_' + a.id;
      video.pause();
      media.classList.remove('is-playing');
      poster.src = base + '_poster.webp';
      poster.alt = 'Frame from the ad, on-screen text: ' + a.onscreen;
      video.poster = base + '_poster.webp';
      video.setAttribute('data-src', base + '_loop.mp4');
      if (video.getAttribute('src')) video.src = base + '_loop.mp4';
      document.getElementById('fbad-link').textContent = a.link;
      document.getElementById('fbad-h').textContent = a.h;
      document.getElementById('fbad-d').textContent = a.d;
      document.getElementById('fbad-cta').textContent = a.cta;
      hookEl.textContent = '“' + a.hook + '”';
      if (!reduceMotion.matches && fb.animate) {
        var ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
        fb.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 240, easing: ease });
        hookEl.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 240, delay: 35, easing: ease, fill: 'backwards' });
      }
      sync();
    }
    thumbs.forEach(function (b) {
      b.addEventListener('click', function () { show(parseInt(b.getAttribute('data-ad'), 10)); });
    });
    paint();
  }

  /* ---------- Video slot ---------- */
  var vsl = document.getElementById('vsl');
  var play = document.getElementById('vsl-play');
  var note = document.getElementById('vsl-note');

  function embedUrl(src) {
    var m;
    if ((m = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/))) {
      return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    }
    if ((m = src.match(/vimeo\.com\/(?:video\/)?(\d+)/))) {
      return 'https://player.vimeo.com/video/' + m[1] + '?autoplay=1&title=0&byline=0&portrait=0';
    }
    if ((m = src.match(/loom\.com\/(?:share|embed)\/([\w-]+)/))) {
      return 'https://www.loom.com/embed/' + m[1] + '?autoplay=1&hide_owner=true';
    }
    return null;
  }

  if (vsl && play) {
    play.addEventListener('click', function () {
      var src = (vsl.getAttribute('data-video-src') || '').trim();
      if (!src) {
        note.textContent = "Daylon’s video is coming soon. You can book a call with him below in the meantime.";
        return;
      }
      var frame = document.createElement('div');
      frame.className = 'vsl__frame';
      var url = embedUrl(src);
      if (url) {
        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.title = "Daylon Bennett, GuerillaFi, 90-second video";
        ifr.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        ifr.allowFullscreen = true;
        frame.appendChild(ifr);
      } else {
        var v = document.createElement('video');
        v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
        v.setAttribute('aria-label', "Daylon Bennett, GuerillaFi, 90-second video");
        frame.appendChild(v);
      }
      play.replaceWith(frame);
      note.textContent = '';
    });
  }

  /* ---------- Calendar slot ---------- */
  var book = document.getElementById('book');
  var cal = document.getElementById('book-cal');
  var bookBtn = document.getElementById('book-btn');
  var calUrl = book ? (book.getAttribute('data-calendar-url') || '').trim() : '';

  if (calUrl && cal) {
    var ifr2 = document.createElement('iframe');
    ifr2.src = calUrl;
    ifr2.title = "Daylon’s calendar, book a 15-minute call";
    ifr2.loading = 'lazy';
    cal.replaceChildren(ifr2);
    if (bookBtn) { bookBtn.href = calUrl; bookBtn.target = '_blank'; bookBtn.rel = 'noopener'; }
  } else if (bookBtn && cal) {
    bookBtn.addEventListener('click', function (e) {
      e.preventDefault();
      cal.focus({ preventScroll: false });
    });
  }
})();
