/* IELTS Reading passages: checking, saving answers (in this browser and online), timer and question navigator.
   The page carries its answers in <script type="application/json" id="answer-data">:
   { total, questions: [{ id, ns: [numbers], kind: 'choice' | 'text' | 'multi', accept: [...], limit?, choose? }] }
   No libraries. The only network requests go to the IELTS Harper Portal (see "Saving" below). */
(function () {
  'use strict';

  var data = JSON.parse(document.getElementById('answer-data').textContent);
  var storeKey = 'ih-reading:' + location.pathname;
  var $ = function (id) {
    return document.getElementById(id);
  };
  var announce = $('announce');

  // ---- Answer comparison ----
  function normalize(s) {
    return String(s || '')
      .normalize('NFKC')
      .replace(/[‘’‚‛ʼ`´]/g, "'")
      .replace(/[“”„‟]/g, '"')
      .replace(/[‐-―−]/g, '-')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.,;:!?]+$/, '')
      .trim();
  }
  // "(the) water supply" in the key means the article is optional.
  function acceptedForms(accept) {
    var out = [];
    accept.forEach(function (a) {
      var m = /^\((the|a|an)\)\s+(.*)$/i.exec(a);
      if (m) {
        out.push(normalize(m[2]));
        out.push(normalize(m[1] + ' ' + m[2]));
      } else out.push(normalize(a));
    });
    return out;
  }
  function overLimit(value, limit) {
    if (!limit) return false;
    var tokens = normalize(value).split(' ').filter(Boolean);
    if (!limit.number) return tokens.length > limit.words;
    var numbers = tokens.filter(function (t) {
      return /\d/.test(t);
    }).length;
    return tokens.length - numbers > limit.words || numbers > 1;
  }

  // ---- Reading the inputs ----
  function inputs(q) {
    return document.querySelectorAll('[data-q="' + q.id + '"]');
  }
  function valueOf(q) {
    var els = inputs(q);
    if (q.kind === 'multi') {
      return Array.prototype.filter
        .call(els, function (e) {
          return e.checked;
        })
        .map(function (e) {
          return e.value;
        });
    }
    if (els[0].type === 'radio') {
      for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
      return '';
    }
    // A question with two blanks ("1 …… and ……"): both boxes, in page order.
    if (q.kind === 'pair') {
      return Array.prototype.map.call(els, function (e) {
        return e.value;
      });
    }
    return els[0].value;
  }
  function setValue(q, v) {
    var els = inputs(q);
    Array.prototype.forEach.call(els, function (e, i) {
      if (e.type === 'radio' || e.type === 'checkbox') e.checked = Array.isArray(v) ? v.indexOf(e.value) >= 0 : e.value === v;
      else e.value = (Array.isArray(v) ? v[i] : v) || '';
    });
  }
  function isBlank(v) {
    return Array.isArray(v)
      ? v.every(function (x) {
          return !String(x).trim();
        })
      : !String(v).trim();
  }
  function answeredCount(q) {
    var v = valueOf(q);
    if (q.kind === 'multi') return Math.min(v.length, q.choose);
    if (q.kind === 'pair')
      return v.every(function (x) {
        return String(x).trim();
      })
        ? 1
        : 0;
    return isBlank(v) ? 0 : 1;
  }

  // ---- Saving: in this browser at once, and online (IELTS Harper Portal) a moment later ----
  // The pages and the portal are on the same site, so a portal sign-in is readable here: a signed-in
  // student is saved to their account. Anyone else types a name before starting and is saved under it
  // (the same name on another device continues the same work). The teacher sees it on the portal.
  var API_URL = 'https://script.google.com/macros/s/AKfycbwKm1zvqca2-WO20f49M4mNW2qn9Aq4uxJZ3_bnQrErWPL5TN4jHycXZUQBDJ1W7wWg/exec';
  var PORTAL = 'https://ieltsharper.github.io/portal/';
  var SITE = 'https://ieltsharper.github.io/IELTS-Reading-Passages-Compilation/';
  var NAME_KEY = 'ih-reading:name';
  var pageAddr = SITE + location.pathname.split('/').slice(-2).join('/');
  var pageTitle = document.title.replace(/ – IELTS Reading Passages$/, '');
  var who = null; // { name, signedIn } once the portal has answered
  var online = false; // the saved answers have been loaded, so changes may be sent
  var local = {}; // { values, at, who, score, checkedAt }: this page in this browser
  var pending = false;
  var sending = null; // the save request on its way
  var timer = null;
  var retryOpen = null;

  function token() {
    try {
      return localStorage.getItem('portal.session');
    } catch (e) {
      return null;
    }
  }
  function storedName() {
    try {
      return localStorage.getItem(NAME_KEY) || '';
    } catch (e) {
      return '';
    }
  }
  function cleanName(s) {
    return String(s || '')
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .trim();
  }
  function nameProblem(n) {
    if (n.length < 2 || n.length > 40 || !/\p{L}/u.test(n) || /[<>]/.test(n)) return 'Please type your name (2–40 letters).';
    return '';
  }
  function whoKey(w) {
    return w ? (w.signedIn ? 'account:' : 'name:') + w.name.toLowerCase() : '';
  }
  function currentValues() {
    var values = {};
    data.questions.forEach(function (q) {
      values[q.id] = valueOf(q);
    });
    return values;
  }
  function hasAnswers(values) {
    return (
      !!values &&
      Object.keys(values).some(function (k) {
        return !isBlank(values[k]);
      })
    );
  }
  function keepLocal() {
    try {
      localStorage.setItem(storeKey, JSON.stringify(local));
    } catch (e) {
      /* storage full or blocked: answers stay on the page (and online) */
    }
  }
  function apiCall(action, payload, keepalive) {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, token: token(), payload: payload }),
      redirect: 'follow',
      credentials: 'omit',
      keepalive: !!keepalive,
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (env) {
        if (env.ok) return env.data;
        var e = new Error(env.error.message);
        e.code = env.error.code;
        throw e;
      });
  }

  // Called after every change on the page.
  function save() {
    local.values = currentValues();
    local.at = new Date().toISOString();
    local.who = whoKey(who);
    keepLocal();
    pending = true;
    schedule(4000);
  }
  function restore() {
    try {
      local = JSON.parse(localStorage.getItem(storeKey) || 'null') || {};
    } catch (e) {
      local = {};
    }
    if (!local.values) return;
    data.questions.forEach(function (q) {
      if (local.values[q.id] !== undefined) setValue(q, local.values[q.id]);
    });
  }
  // Shows another set of answers (saved online, or none), unmarked.
  function showValues(values) {
    data.questions.forEach(function (q) {
      setValue(q, values && values[q.id] !== undefined ? values[q.id] : q.kind === 'multi' ? [] : '');
      clearMark(q);
    });
    $('score').textContent = '';
    update();
  }
  function takeSaved(s) {
    showValues(s.values);
    local = { values: s.values, at: s.at, who: whoKey(who), score: s.score, checkedAt: s.checkedAt };
    keepLocal();
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      flush(false);
    }, ms);
  }
  // Sends the latest answers; the promise settles when they are saved (or could not be).
  function flush(keepalive) {
    clearTimeout(timer);
    timer = null;
    if (sending) return sending;
    if (!pending || !online || !who) return Promise.resolve();
    pending = false;
    var p = {
      url: pageAddr,
      title: pageTitle,
      values: JSON.stringify(local.values || {}),
      answered: +$('answered').textContent || 0,
      total: data.total,
      at: local.at,
    };
    if (!who.signedIn) p.name = who.name;
    if (typeof local.score === 'number') {
      p.score = local.score;
      p.checkedAt = local.checkedAt;
    }
    drawStatus('saving');
    sending = apiCall('reading.progress.save', p, keepalive)
      .then(function (r) {
        if (r.newer) {
          takeSaved(r.newer);
          drawStatus('newer');
        } else drawStatus(pending ? 'saving' : 'saved');
      })
      .catch(function (e) {
        pending = true;
        drawStatus('error', e.message);
        schedule(20000);
      })
      .then(function () {
        sending = null;
        if (pending && !timer) schedule(1000);
      });
    return sending;
  }
  window.addEventListener('pagehide', function () {
    flush(true);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flush(true);
  });

  // Loads the saved answers of this person (name = null: the portal account).
  function open(name) {
    clearTimeout(retryOpen);
    online = false;
    drawStatus('loading');
    apiCall('reading.progress.get', name ? { url: pageAddr, name: name } : { url: pageAddr })
      .then(function (res) {
        if (!res.who) {
          // The portal sign-in has ended: carry on with a name.
          var n = storedName();
          return n ? open(n) : askName(false);
        }
        who = res.who;
        online = true;
        var s = res.saved;
        // Answers already on this page belong to this person if saved under them (or before names).
        var mine = local.who ? local.who === whoKey(who) : hasAnswers(local.values);
        if (s && (!mine || !local.at || s.at > local.at)) {
          takeSaved(s);
          pending = false;
        } else if (!mine) {
          showValues({});
          local = { who: whoKey(who) };
          keepLocal();
          pending = false;
        } else {
          local.who = whoKey(who);
          keepLocal();
          if (hasAnswers(local.values) && (!s || local.at > s.at)) pending = true;
        }
        drawWho();
        if (pending) flush(false);
        else drawStatus('saved');
      })
      .catch(function (e) {
        var badName = e.code === 'invalid' && /name/i.test(e.message);
        if (badName && name) {
          try {
            localStorage.removeItem(NAME_KEY);
          } catch (err) {}
          return askName(false, e.message);
        }
        // Not connected (or this page is not saved online): work on this device, try again later.
        if (!who) who = name ? { name: name, signedIn: false } : null;
        drawWho();
        drawStatus('offline');
        if (e.code !== 'invalid')
          retryOpen = setTimeout(function () {
            open(name);
          }, 30000);
      });
  }

  // ---- "Who is answering": the line in the toolbar and the name box ----
  var saver = document.createElement('p');
  saver.className = 'saver';
  saver.setAttribute('aria-live', 'polite');
  saver.innerHTML = '<span class="saver-who"></span> <span class="saver-status"></span>';
  var title = document.querySelector('.toolbar-title');
  if (title) title.parentNode.insertBefore(saver, title.nextSibling);
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function drawWho() {
    var el = saver.querySelector('.saver-who');
    if (!who) el.innerHTML = '';
    else if (who.signedIn) el.innerHTML = 'Saved to your portal account (<strong>' + esc(who.name) + '</strong>)';
    else
      el.innerHTML =
        'Name: <strong>' + esc(who.name) + '</strong> <button type="button" class="link-btn" id="change-name">Change</button>';
    var btn = $('change-name');
    if (btn)
      btn.addEventListener('click', function () {
        askName(true);
      });
  }
  var STATUS = {
    loading: 'Loading your saved answers…',
    saving: 'Saving…',
    saved: '✓ Saved',
    newer: '✓ Answers from your other device loaded',
    offline: 'Not connected: your answers are kept on this device for now.',
    error: 'Not saved online yet; kept on this device, trying again.',
  };
  function drawStatus(s) {
    var el = saver.querySelector('.saver-status');
    el.textContent = STATUS[s] || '';
    el.className = 'saver-status ' + s;
  }

  var overlay = null;
  // The name box: before starting (cannot be closed), or to change the name.
  function askName(change, problem) {
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.className = 'name-overlay';
    overlay.innerHTML =
      '<form class="name-box" role="dialog" aria-modal="true" aria-labelledby="name-title" novalidate>' +
      '<h2 id="name-title">' + (change ? 'Change your name' : 'Before you start: what is your name?') + '</h2>' +
      '<p>Your answers are saved online under this name, so your teacher can see your progress and you can continue on another device.</p>' +
      '<p class="name-rule"><strong>Please use only one name on this website</strong>, spelt the same way every time (for example, your full name). A different name starts again with no answers.</p>' +
      '<label for="name-input">Your name</label>' +
      '<input id="name-input" type="text" autocomplete="name" maxlength="40" spellcheck="false">' +
      '<p class="name-error" id="name-error" role="alert"></p>' +
      '<div class="name-actions"><button type="submit" class="btn btn-primary">' + (change ? 'Save name' : 'Start') + '</button>' +
      (change ? '<button type="button" class="btn" id="name-cancel">Cancel</button>' : '') + '</div>' +
      '<p class="name-alt">Have an IELTS Harper Portal account? <a href="' + PORTAL + '" target="_blank" rel="noopener">Sign in to the portal</a>, then reload this page.</p>' +
      '</form>';
    document.body.appendChild(overlay);
    setInert(true);
    var input = $('name-input');
    var error = $('name-error');
    if (change && who) input.value = who.name;
    if (problem) error.textContent = problem;
    input.focus();
    function close() {
      overlay.remove();
      overlay = null;
      setInert(false);
    }
    if (change) {
      $('name-cancel').addEventListener('click', close);
      overlay.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
    }
    overlay.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var n = cleanName(input.value);
      var bad = nameProblem(n);
      if (bad) {
        error.textContent = bad;
        input.focus();
        return;
      }
      if (change && who && n.toLowerCase() === who.name.toLowerCase()) return close();
      // Answers of the old name are sent first, then the new name's answers are loaded.
      var before = change ? flush(false) : Promise.resolve();
      before.then(function () {
        if (change && pending && !window.confirm('Your latest answers are not saved online yet. Change the name anyway?')) return;
        try {
          localStorage.setItem(NAME_KEY, n);
        } catch (err) {}
        close();
        who = null;
        pending = false;
        open(n);
      });
    });
  }
  function setInert(on) {
    ['header', '.toolbar', 'main', 'footer'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) {
        if (on) el.setAttribute('inert', '');
        else el.removeAttribute('inert');
      }
    });
  }
  function startSync() {
    if (token()) return open(null);
    var n = storedName();
    if (n) open(n);
    else askName(false);
  }

  // ---- Marking ----
  function item(q) {
    return $('item-' + q.id);
  }
  function clearMark(q) {
    var it = item(q);
    it.classList.remove('is-correct', 'is-wrong');
    if (q.kind === 'pair')
      Array.prototype.forEach.call(inputs(q), function (e) {
        e.closest('.gap').classList.remove('is-correct', 'is-wrong');
      });
    $('mark-' + q.id).textContent = '';
    Array.prototype.forEach.call(it.querySelectorAll('.choice'), function (c) {
      c.classList.remove('right', 'wrong');
    });
    var fb = $('fb-' + q.id);
    fb.hidden = true;
    fb.querySelector('.fb-result').textContent = '';
    fb.querySelector('.fb-result').className = 'fb-result';
    q.ns.forEach(function (n) {
      $('nav-' + n).classList.remove('ok', 'bad');
    });
  }
  function result(q) {
    var v = valueOf(q);
    if (q.kind === 'multi') {
      var right = v.filter(function (x) {
        return q.accept.indexOf(x) >= 0;
      }).length;
      return { points: Math.min(right, q.choose), value: v };
    }
    if (q.kind === 'pair') {
      // Both blanks right, in either order.
      var given = v.map(normalize).sort().join('|');
      return { points: given === q.accept.map(normalize).sort().join('|') ? 1 : 0, value: v };
    }
    var forms = acceptedForms(q.accept);
    var ok = String(v).trim() !== '' && forms.indexOf(normalize(v)) >= 0;
    // Two answers that may come in either order: the second must not repeat the first.
    if (ok && q.unordered && q.unordered.second) {
      var other = data.questions.filter(function (x) {
        return x.id === q.unordered.with;
      })[0];
      if (normalize(valueOf(other)) === normalize(v)) ok = false;
    }
    return { points: ok ? 1 : 0, value: v, over: q.kind === 'text' && !ok && overLimit(v, q.limit) };
  }
  function mark(q) {
    clearMark(q);
    var r = result(q);
    var it = item(q);
    var fb = $('fb-' + q.id);
    var line = fb.querySelector('.fb-result');
    fb.hidden = false;
    if (q.kind === 'multi') {
      Array.prototype.forEach.call(inputs(q), function (e) {
        if (e.checked) e.closest('.choice').classList.add(q.accept.indexOf(e.value) >= 0 ? 'right' : 'wrong');
      });
      var all = r.points === q.choose;
      it.classList.add(all ? 'is-correct' : 'is-wrong');
      line.textContent = (all ? '✓ ' : '✗ ') + r.points + ' of ' + q.choose + ' correct' + (r.value.length ? '. Your answer: ' + r.value.join(', ') : '. Not answered');
      line.className = 'fb-result ' + (all ? 'ok' : 'bad');
      $('mark-' + q.id).textContent = (all ? '✓ ' : '✗ ') + r.points + '/' + q.choose;
      q.ns.forEach(function (n, i) {
        $('nav-' + n).classList.add(i < r.points ? 'ok' : 'bad');
      });
      return r.points;
    }
    var ok = r.points === 1;
    it.classList.add(ok ? 'is-correct' : 'is-wrong');
    if (q.kind === 'pair')
      Array.prototype.forEach.call(inputs(q), function (e) {
        e.closest('.gap').classList.add(ok ? 'is-correct' : 'is-wrong');
      });
    $('mark-' + q.id).textContent = ok ? '✓' : '✗';
    Array.prototype.forEach.call(inputs(q), function (e) {
      if (e.type === 'radio' && e.checked) e.closest('.choice').classList.add(ok ? 'right' : 'wrong');
    });
    var text;
    if (ok) text = '✓ Correct';
    else if (isBlank(r.value)) text = '✗ Not answered';
    else text = '✗ Incorrect. Your answer: ' + (Array.isArray(r.value) ? r.value.join(' / ') : r.value) + (r.over ? ' (longer than the word limit: ' + q.limit.text + ')' : '');
    line.textContent = text;
    line.className = 'fb-result ' + (ok ? 'ok' : 'bad');
    $('nav-' + q.ns[0]).classList.add(ok ? 'ok' : 'bad');
    return r.points;
  }

  function check() {
    var score = 0;
    data.questions.forEach(function (q) {
      score += mark(q);
    });
    var msg = 'Score: ' + score + ' / ' + data.total;
    $('score').textContent = msg;
    announce.textContent = msg + '. Correct answers and explanations are shown below each question.';
    local.score = score;
    local.checkedAt = new Date().toISOString();
    save();
    flush(false);
  }
  function showAnswers() {
    data.questions.forEach(function (q) {
      $('fb-' + q.id).hidden = false;
    });
    announce.textContent = 'All answers and explanations are shown below the questions.';
  }
  function reset() {
    if (!window.confirm('Clear all your answers on this page?')) return;
    data.questions.forEach(function (q) {
      setValue(q, q.kind === 'multi' ? [] : '');
      clearMark(q);
    });
    $('score').textContent = '';
    resetTimer();
    update();
    save();
    announce.textContent = 'All answers cleared.';
  }

  // ---- Progress and limits ----
  function update() {
    var n = 0;
    data.questions.forEach(function (q) {
      var c = answeredCount(q);
      n += c;
      q.ns.forEach(function (num, i) {
        $('nav-' + num).classList.toggle('answered', i < c);
      });
      if (q.kind === 'multi') {
        var full = valueOf(q).length >= q.choose;
        Array.prototype.forEach.call(inputs(q), function (e) {
          e.disabled = full && !e.checked;
        });
      }
    });
    $('answered').textContent = n;
  }

  document.addEventListener('change', onEdit);
  document.addEventListener('input', onEdit);
  function onEdit(e) {
    var id = e.target && e.target.getAttribute('data-q');
    if (!id) return;
    var q = data.questions.filter(function (x) {
      return x.id === id;
    })[0];
    if (q && !$('fb-' + q.id).hidden) clearMark(q);
    update();
    save();
  }

  // ---- Navigator: jump to a question and focus its input ----
  document.querySelector('.q-nav').addEventListener('click', function (e) {
    var a = e.target.closest('[data-nav]');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('data-nav');
    var target = $(id);
    $('item-' + id).scrollIntoView({ block: 'center' });
    if (target) target.focus({ preventScroll: true });
  });

  // ---- Timer (20 minutes, off until started) ----
  var LIMIT = 20 * 60;
  var left = LIMIT;
  var timerId = null;
  var timerEl = $('timer');
  var timerBtn = $('timer-btn');
  function fmt(s) {
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }
  function drawTimer() {
    timerEl.textContent = fmt(left);
    timerEl.classList.toggle('low', left <= 120);
    timerEl.setAttribute('aria-label', 'Time left ' + Math.floor(left / 60) + ' minutes ' + (left % 60) + ' seconds');
  }
  function startTimer() {
    if (timerId || left <= 0) return;
    timerId = setInterval(function () {
      left--;
      drawTimer();
      if (left === 300) announce.textContent = '5 minutes left.';
      if (left <= 0) {
        clearInterval(timerId);
        timerId = null;
        timerBtn.textContent = 'Time is up';
        timerBtn.disabled = true;
        announce.textContent = 'Time is up.';
      }
    }, 1000);
    timerBtn.textContent = 'Pause timer';
  }
  function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    timerBtn.textContent = 'Resume timer';
  }
  function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    left = LIMIT;
    timerBtn.disabled = false;
    timerBtn.textContent = 'Start timer';
    drawTimer();
  }
  timerBtn.addEventListener('click', function () {
    if (timerId) pauseTimer();
    else startTimer();
  });

  $('check-btn').addEventListener('click', check);
  $('show-btn').addEventListener('click', showAnswers);
  $('reset-btn').addEventListener('click', reset);

  // ---- Resizable panes: drag the divider (or focus it and use the arrow keys); double-click resets ----
  var splitter = $('splitter');
  var split = splitter && splitter.parentNode;
  var SPLIT_KEY = 'ih-reading:split';
  function setSplit(pct, save) {
    pct = Math.max(20, Math.min(80, Math.round(pct)));
    split.style.setProperty('--left', pct + '%');
    splitter.setAttribute('aria-valuenow', String(pct));
    if (save) {
      try {
        localStorage.setItem(SPLIT_KEY, String(pct));
      } catch (e) {}
    }
  }
  if (splitter) {
    var savedSplit = +(localStorage.getItem(SPLIT_KEY) || 0);
    if (savedSplit) setSplit(savedSplit, false);
    var dragging = false;
    var moveTo = function (clientX) {
      var r = split.getBoundingClientRect();
      setSplit(((clientX - r.left) / r.width) * 100, false);
    };
    // Moves are followed on the whole page (pointer capture is not available everywhere).
    splitter.addEventListener('pointerdown', function (e) {
      dragging = true;
      try {
        splitter.setPointerCapture(e.pointerId);
      } catch (err) {}
      splitter.classList.add('dragging');
      document.body.classList.add('resizing');
      e.preventDefault();
    });
    splitter.addEventListener('mousedown', function (e) {
      e.preventDefault(); // no text selection while dragging
    });
    document.addEventListener('pointermove', function (e) {
      if (dragging) moveTo(e.clientX);
    });
    var stop = function () {
      if (!dragging) return;
      dragging = false;
      splitter.classList.remove('dragging');
      document.body.classList.remove('resizing');
      setSplit(+splitter.getAttribute('aria-valuenow'), true);
    };
    document.addEventListener('pointerup', stop);
    document.addEventListener('pointercancel', stop);
    splitter.addEventListener('dblclick', function () {
      setSplit(50, true);
    });
    splitter.addEventListener('keydown', function (e) {
      var now = +splitter.getAttribute('aria-valuenow');
      var step = e.shiftKey ? 10 : 5;
      if (e.key === 'ArrowLeft') setSplit(now - step, true);
      else if (e.key === 'ArrowRight') setSplit(now + step, true);
      else if (e.key === 'Home') setSplit(20, true);
      else if (e.key === 'End') setSplit(80, true);
      else return;
      e.preventDefault();
    });
  }

  restore();
  update();
  drawTimer();
  startSync();

  // For the automated checks only (no effect on students).
  window.__reading = { normalize: normalize, overLimit: overLimit, result: result, check: check, data: data, setValue: setValue };
})();
