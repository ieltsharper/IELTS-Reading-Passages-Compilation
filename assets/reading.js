/* IELTS Reading passages: checking, saving answers in this browser, timer and question navigator.
   The page carries its answers in <script type="application/json" id="answer-data">:
   { total, questions: [{ id, ns: [numbers], kind: 'choice' | 'text' | 'multi', accept: [...], limit?, choose? }] }
   No libraries, no network requests. */
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
    return els[0].value;
  }
  function setValue(q, v) {
    var els = inputs(q);
    Array.prototype.forEach.call(els, function (e) {
      if (e.type === 'radio' || e.type === 'checkbox') e.checked = Array.isArray(v) ? v.indexOf(e.value) >= 0 : e.value === v;
      else e.value = v || '';
    });
  }
  function answeredCount(q) {
    var v = valueOf(q);
    if (q.kind === 'multi') return Math.min(v.length, q.choose);
    return String(v).trim() ? 1 : 0;
  }

  // ---- Saving in this browser ----
  function save() {
    var values = {};
    data.questions.forEach(function (q) {
      values[q.id] = valueOf(q);
    });
    try {
      localStorage.setItem(storeKey, JSON.stringify({ values: values }));
    } catch (e) {
      /* storage full or blocked: answers stay on the page only */
    }
  }
  function restore() {
    try {
      var saved = JSON.parse(localStorage.getItem(storeKey) || 'null');
      if (!saved || !saved.values) return;
      data.questions.forEach(function (q) {
        if (saved.values[q.id] !== undefined) setValue(q, saved.values[q.id]);
      });
    } catch (e) {
      /* ignore unreadable storage */
    }
  }

  // ---- Marking ----
  function item(q) {
    return $('item-' + q.id);
  }
  function clearMark(q) {
    var it = item(q);
    it.classList.remove('is-correct', 'is-wrong');
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
    var forms = acceptedForms(q.accept);
    var ok = String(v).trim() !== '' && forms.indexOf(normalize(v)) >= 0;
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
    $('mark-' + q.id).textContent = ok ? '✓' : '✗';
    Array.prototype.forEach.call(inputs(q), function (e) {
      if (e.type === 'radio' && e.checked) e.closest('.choice').classList.add(ok ? 'right' : 'wrong');
    });
    var text;
    if (ok) text = '✓ Correct';
    else if (!String(r.value).trim()) text = '✗ Not answered';
    else text = '✗ Incorrect. Your answer: ' + r.value + (r.over ? ' (longer than the word limit: ' + q.limit.text + ')' : '');
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
    try {
      localStorage.removeItem(storeKey);
    } catch (e) {
      /* ignore */
    }
    resetTimer();
    update();
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

  restore();
  update();
  drawTimer();

  // For the automated checks only (no effect on students).
  window.__reading = { normalize: normalize, overLimit: overLimit, result: result, check: check, data: data, setValue: setValue };
})();
