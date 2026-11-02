/* IELTS Harper – Highlight and Note for reading pages (the same tool as the IELTS 11 Reading Mock Test).
   Select text in a passage or a question: a small menu offers Highlight, Note and Clear. Notes show a 📝
   after the highlight (click it to edit). Everything is saved in this browser only (localStorage).
   Use: <link rel="stylesheet" href="ih-annotate.css"> and
        <script src="ih-annotate.js" data-roots="CSS selector of the areas" data-skip="CSS selector"
                data-colors="#fff59d,#a5d6a7" defer></script>
   data-roots: the areas that can be highlighted (each passage, each question group…).
   data-skip:  parts inside them whose text changes while working (feedback, scores); they are not highlighted
               and do not count when highlights are saved.
   data-colors (optional): colour choices shown in the menu.
   When an area's content is replaced (another exercise shown), its own highlights come back with it.
   window.IHAnnotate.list() returns [{ text, note }] for every saved highlight (e.g. to send to the teacher);
   IHAnnotate.clearIn(element) removes the highlights inside an element, IHAnnotate.clearAll() all of them.
   No libraries, no network requests. */
(function () {
  'use strict';

  var me = document.currentScript;
  var ROOTS = (me && me.getAttribute('data-roots')) || 'main';
  var SKIP = (me && me.getAttribute('data-skip')) || '';
  var COLORS = ((me && me.getAttribute('data-colors')) || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
  var KEY = 'ih-annot:' + location.pathname;
  var NOT_TEXT = 'script,style,select,option,input,textarea,button,.ih-tip,.ih-note,.ih-ni' + (SKIP ? ',' + SKIP : '');

  // state.scopes[scope][id] = { a, b, note, color, text }  (a, b: character offsets in the area's text)
  var state = { n: 0, scopes: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.scopes) state = saved;
  } catch (e) {}
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // ---- Text of an area ----
  function okText(n) {
    var p = n.parentNode;
    return !(p && p.closest && p.closest(NOT_TEXT));
  }
  function texts(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var out = [];
    var n;
    while ((n = w.nextNode())) if (okText(n)) out.push(n);
    return out;
  }
  function offs(root) {
    var pos = 0;
    return texts(root).map(function (n) {
      var o = { n: n, s: pos };
      pos += n.nodeValue.length;
      return o;
    });
  }
  // An area is known by its place on the page and the start of its text, so a re-drawn exercise finds its own notes.
  function scopeOf(root) {
    var t = texts(root).map(function (n) { return n.nodeValue; }).join('').replace(/\s+/g, ' ').trim().slice(0, 300);
    var h = 0;
    for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    return root.getAttribute('data-ih-root') + ':' + (h >>> 0).toString(36);
  }
  function rootOf(node) {
    var el = node && (node.nodeType === 1 ? node : node.parentNode);
    return el && el.closest ? el.closest('[data-ih-root]') : null;
  }

  // ---- Marks ----
  var busy = false;
  function wrapPart(n, s, e, id, color) {
    var t = n.nodeValue;
    if (!t.slice(s, e).trim()) return;
    var mid = n;
    if (e < t.length) n.splitText(e);
    if (s > 0) mid = n.splitText(s);
    var m = document.createElement('mark');
    m.className = 'ih-hl';
    m.setAttribute('data-aid', id);
    if (color) m.style.backgroundColor = color;
    mid.parentNode.insertBefore(m, mid);
    m.appendChild(mid);
  }
  function marksOf(id) {
    return document.querySelectorAll('mark.ih-hl[data-aid="' + id + '"]');
  }
  function noteIcon(id, a) {
    document.querySelectorAll('.ih-ni[data-aid="' + id + '"]').forEach(function (x) { x.remove(); });
    var ms = marksOf(id);
    ms.forEach(function (m) { m.classList.toggle('ih-has-note', !!(a && a.note)); });
    if (a && a.note && ms.length) {
      var last = ms[ms.length - 1];
      var i = document.createElement('button');
      i.type = 'button';
      i.className = 'ih-ni';
      i.setAttribute('data-aid', id);
      i.setAttribute('aria-label', 'Note: ' + a.note);
      i.title = a.note;
      i.textContent = '📝';
      last.parentNode.insertBefore(i, last.nextSibling);
    }
  }
  function find(id) {
    for (var s in state.scopes) if (state.scopes[s][id]) return state.scopes[s][id];
    return null;
  }
  function create(range, color) {
    var root = rootOf(range.startContainer);
    if (!root || root !== rootOf(range.endContainer)) return null;
    var items = [];
    offs(root).forEach(function (o) {
      if (!range.intersectsNode(o.n)) return;
      var len = o.n.nodeValue.length;
      var ls = o.n === range.startContainer ? range.startOffset : 0;
      var le = o.n === range.endContainer ? range.endOffset : len;
      if (le <= ls || o.n.parentNode.closest('mark.ih-hl') || !o.n.nodeValue.slice(ls, le).trim()) return;
      items.push({ n: o.n, ls: ls, le: le, s: o.s });
    });
    if (!items.length) return null;
    var scope = scopeOf(root);
    var id = 'h' + ++state.n;
    var f = items[0];
    var l = items[items.length - 1];
    // The highlighted words (a space where the selection runs from one paragraph into the next).
    var block = function (n) { return n.parentNode.closest('p,li,dd,dt,td,th,h1,h2,h3,h4,div'); };
    var text = items.map(function (it, k) {
      return (k && block(it.n) !== block(items[k - 1].n) ? ' ' : '') + it.n.nodeValue.slice(it.ls, it.le);
    }).join('').replace(/\s+/g, ' ').trim();
    (state.scopes[scope] = state.scopes[scope] || {})[id] = { a: f.s + f.ls, b: l.s + l.le, note: '', color: color || '', text: text };
    busy = true;
    items.forEach(function (it) { wrapPart(it.n, it.ls, it.le, id, color); });
    busy = false;
    return id;
  }
  function remove(id) {
    busy = true;
    document.querySelectorAll('.ih-ni[data-aid="' + id + '"]').forEach(function (x) { x.remove(); });
    marksOf(id).forEach(function (m) {
      var p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
      p.normalize();
    });
    busy = false;
    for (var s in state.scopes) {
      delete state.scopes[s][id];
      if (!Object.keys(state.scopes[s]).length) delete state.scopes[s];
    }
  }
  function apply(root) {
    if (root.querySelector('mark.ih-hl')) return; // already drawn
    var list = state.scopes[scopeOf(root)];
    if (!list) return;
    busy = true;
    Object.keys(list).forEach(function (id) {
      var a = list[id];
      offs(root).forEach(function (o) {
        var len = o.n.nodeValue.length;
        if (o.s + len <= a.a || o.s >= a.b || o.n.parentNode.closest('mark.ih-hl')) return;
        wrapPart(o.n, Math.max(a.a, o.s) - o.s, Math.min(a.b, o.s + len) - o.s, id, a.color);
      });
      noteIcon(id, a);
    });
    busy = false;
  }

  // ---- Menu (Highlight / Note / Clear) and note box ----
  var tip = document.createElement('div');
  tip.className = 'ih-tip';
  tip.setAttribute('role', 'toolbar');
  tip.setAttribute('aria-label', 'Highlight and note');
  tip.innerHTML =
    COLORS.map(function (c, i) {
      return '<button type="button" class="ih-swatch' + (i ? '' : ' on') + '" data-color="' + c + '" aria-label="Highlight colour ' + (i + 1) + '"></button>';
    }).join('') +
    '<button type="button" data-act="hl">Highlight</button><button type="button" data-act="note">Note</button><button type="button" data-act="clear">Clear</button>';
  tip.querySelectorAll('.ih-swatch').forEach(function (s) {
    s.style.backgroundColor = s.getAttribute('data-color');
  });
  var box = document.createElement('div');
  box.className = 'ih-note';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Note');
  box.innerHTML = '<b>Note</b><textarea placeholder="Type your note here" aria-label="Note"></textarea><div><button type="button" data-act="save">Save</button><button type="button" class="ih-secondary" data-act="del">Remove highlight</button></div>';
  var color = COLORS[0] || '';
  var range = null;
  var boxId = null;
  var area = box.querySelector('textarea');

  function hideTip() {
    tip.style.display = 'none';
  }
  function endSel() {
    var s = window.getSelection();
    if (s) s.removeAllRanges();
    hideTip();
  }
  function hits(r) {
    var ids = {};
    document.querySelectorAll('mark.ih-hl').forEach(function (m) {
      if (r.intersectsNode(m)) ids[m.getAttribute('data-aid')] = 1;
    });
    return Object.keys(ids);
  }
  function openBox(id, rect) {
    boxId = id;
    box.style.display = 'block';
    area.value = (find(id) || {}).note || '';
    box.style.left = Math.min(window.innerWidth - 300, Math.max(8, rect.left)) + 'px';
    box.style.top = Math.min(window.innerHeight - 200, rect.bottom + 6) + 'px';
    area.focus();
  }
  function closeBox() {
    box.style.display = 'none';
    boxId = null;
  }
  function saveNote() {
    var a = boxId && find(boxId);
    if (a) {
      a.note = area.value.trim();
      noteIcon(boxId, a);
      save();
    }
    closeBox();
  }
  tip.addEventListener('mousedown', function (e) {
    e.preventDefault(); // keep the selection
  });
  tip.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || !range) return;
    if (b.classList.contains('ih-swatch')) {
      color = b.getAttribute('data-color');
      tip.querySelectorAll('.ih-swatch').forEach(function (s) { s.classList.toggle('on', s === b); });
      return;
    }
    var act = b.getAttribute('data-act');
    if (act === 'hl') {
      create(range, color);
      endSel();
      save();
    } else if (act === 'clear') {
      hits(range).forEach(remove);
      endSel();
      save();
    } else if (act === 'note') {
      var rect = range.getBoundingClientRect();
      var id = hits(range)[0] || create(range, color);
      endSel();
      if (id) {
        save();
        openBox(id, rect);
      }
    }
  });
  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.getAttribute('data-act') === 'save') saveNote();
    else if (b.getAttribute('data-act') === 'del') {
      if (boxId) remove(boxId);
      closeBox();
      save();
    }
  });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') saveNote();
  });

  function check() {
    var s = window.getSelection();
    if (!s || !s.rangeCount || s.isCollapsed || !s.toString().trim()) return hideTip();
    var r = s.getRangeAt(0);
    var root = rootOf(r.startContainer);
    if (!root || root !== rootOf(r.endContainer)) return hideTip();
    var c = r.commonAncestorContainer;
    var el = c.nodeType === 1 ? c : c.parentNode;
    if (el.closest('input,textarea,select,.ih-note,.ih-tip')) return hideTip();
    range = r.cloneRange();
    var b = r.getBoundingClientRect();
    tip.style.display = 'flex';
    tip.style.left = Math.max(8, Math.min(window.innerWidth - tip.offsetWidth - 8, b.left)) + 'px';
    tip.style.top = (b.top > 52 ? b.top - tip.offsetHeight - 6 : b.bottom + 6) + 'px';
  }
  document.addEventListener('mouseup', function (e) {
    if (e.target.closest && e.target.closest('.ih-tip,.ih-note')) return;
    setTimeout(check, 0);
  });
  document.addEventListener('touchend', function (e) {
    if (e.target.closest && e.target.closest('.ih-tip,.ih-note')) return;
    setTimeout(check, 350);
  });
  document.addEventListener('keyup', function (e) {
    if (e.shiftKey || e.key === 'Shift') setTimeout(check, 0);
  });
  document.addEventListener('mousedown', function (e) {
    if (box.style.display === 'block' && !e.target.closest('.ih-note') && !e.target.closest('.ih-ni')) saveNote();
    if (!e.target.closest('.ih-tip')) hideTip();
  });
  document.addEventListener('click', function (e) {
    var ni = e.target.closest && e.target.closest('.ih-ni');
    if (!ni) return;
    e.preventDefault();
    e.stopPropagation();
    openBox(ni.getAttribute('data-aid'), ni.getBoundingClientRect());
  }, true);
  window.addEventListener('scroll', hideTip, true);

  // ---- Start ----
  function init() {
    document.body.appendChild(tip);
    document.body.appendChild(box);
    var roots = document.querySelectorAll(ROOTS);
    roots.forEach(function (root, i) {
      root.setAttribute('data-ih-root', String(i));
      apply(root);
      // Content drawn again (another exercise): bring back that content's highlights.
      new MutationObserver(function () {
        if (busy) return;
        clearTimeout(root.ihT);
        root.ihT = setTimeout(function () { apply(root); }, 30);
      }).observe(root, { childList: true, subtree: true });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IHAnnotate = {
    list: function () {
      var out = [];
      Object.keys(state.scopes).forEach(function (s) {
        Object.keys(state.scopes[s]).forEach(function (id) {
          var a = state.scopes[s][id];
          out.push({ text: a.text || '', note: a.note || '' });
        });
      });
      return out;
    },
    clearIn: function (el) {
      var ids = {};
      el.querySelectorAll('mark.ih-hl').forEach(function (m) { ids[m.getAttribute('data-aid')] = 1; });
      Object.keys(ids).forEach(remove);
      save();
    },
    clearAll: function () {
      Object.keys(state.scopes).forEach(function (s) { Object.keys(state.scopes[s]).forEach(remove); });
      state.scopes = {};
      save();
    },
  };
})();
