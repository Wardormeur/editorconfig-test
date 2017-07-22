define("github/editor/blob-editor", ["../form", "../jquery", "../sliding-promise-queue", "../typecast", "../debounce", "../fetch", "../code-editor", "invariant", "../observe", "../onfocus", "../google-analytics"], function(e, t, n, r, i, o, l, a, s, c, u) {
    function d(e) {
      return e && e.__esModule ? e : {
        "default": e
      }
    }

    function f(e, t) {
      e.classList.remove("show-code", "loading-preview", "show-preview", "no-changes-preview", "error-preview"), e.classList.add(t)
    }

    function h(t, n, r) {
      null == r && (r = !0), f(t, "loading-preview");
      var i = t.querySelector(".js-blob-edit-code");
      x["default"](i instanceof HTMLElement), i.classList.remove("selected");
      var o = t.querySelector(".js-blob-edit-preview");
      x["default"](o instanceof HTMLElement), o.classList.add("selected");
      var a = n.querySelector("input.js-blob-filename");
      x["default"](a instanceof HTMLInputElement), a.disabled = !0, a.style.cursor = "not-allowed";
      var s = document.querySelector(".js-quick-pull-branch-name"),
        c = null != s ? s.classList.contains("d-none") : !1,
        u = v["default"](document.querySelector(".js-blob-preview-form"), HTMLFormElement),
        d = l.getCodeEditor(t);
      if (null == d) throw new Error("Unable to get the code editor for the element");
      e.fillFormValues(u, {
        code: d.code(),
        commit: v["default"](n.querySelector(".js-commit-oid"), HTMLInputElement).value,
        blobname: v["default"](n.querySelector(".js-blob-filename"), HTMLInputElement).value,
        willcreatebranch: c.toString(),
        checkConflict: r.toString()
      }), e.submit(u)
    }

    function p() {
      function e(e) {
        if (r === n.value) {
          var t = e.normalized_ref;
          if (l.innerHTML = null == e.message_html ? "" : e.message_html, !t) {
            var o = v["default"](l.querySelector("code"), HTMLElement);
            o.textContent = i
          }
          w && (w.value = t)
        }
      }

      function t() {
        r === n.value && w && (w.value = r)
      }
      var n = v["default"](document.querySelector(".js-quick-pull-new-branch-name"), HTMLInputElement),
        r = n.value,
        i = n.getAttribute("data-generated-branch");
      if (null == i) throw new Error("Missing attribute `data-generated-branch`");
      var l = v["default"](document.querySelector(".js-quick-pull-normalization-info"), HTMLElement),
        a = null != n.getAttribute("data-check-authenticity-token") ? n.getAttribute("data-check-authenticity-token") : void 0,
        s = o.fetchJSON(n.getAttribute("data-check-url"), {
          method: "post",
          body: m["default"].param({
            ref: r,
            authenticity_token: a
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        });
      return b.push(s).then(e, t)
    }
    var m = d(t),
      g = d(n),
      v = d(r),
      y = d(i),
      x = d(a);
    c.onKey("keydown", "input.js-blob-filename", function(e) {
      if ("Enter" === e.key) {
        var t = v["default"](e.target.form, HTMLFormElement),
          n = t.querySelector("select.js-code-indent-mode");
        n && n.focus(), e.preventDefault()
      }
    }), m["default"](document).on("click", ".js-blob-edit-code", function(e) {
      e.preventDefault();
      var t = this.closest(".js-code-editor");
      if (!t.matches(".show-code")) {
        t.classList.remove("loading-preview", "show-preview", "no-changes-preview", "error-preview"), t.classList.add("show-code"), t.querySelector(".js-blob-edit-code").classList.add("selected"), t.querySelector(".js-blob-edit-preview").classList.remove("selected");
        var n = l.getCodeEditor(this.closest(".js-code-editor"));
        null != n && n.focus();
        var r = t.closest(".js-blob-form").querySelector(".js-blob-filename");
        r.disabled = !1, r.style.cursor = "auto"
      }
    }), m["default"](document).on("click", ".js-blob-edit-preview", function(e) {
      e.preventDefault();
      var t = this.closest(".js-code-editor");
      if (t.matches(".show-code")) {
        var n = t.closest(".js-blob-form");
        h(t, n, !0)
      }
    }), m["default"](document).on("ajaxSuccess", ".js-blob-preview-form", function(e, t, n, r) {
      for (var i = document.createDocumentFragment(), o = m["default"].parseHTML(r), l = 0, a = o.length; a > l; l++) {
        var s = o[l];
        i.appendChild(s)
      }
      var c = i.querySelector(".data.highlight");
      c || (c = i.querySelector("#readme")), c || (c = i.querySelector(".js-preview-new-file")), c || (c = i.querySelector(".js-preview-msg")), !c && (c = i.querySelector(".render-container")) && c.classList.add("is-render-requested");
      var u = v["default"](document.querySelector(".js-code-editor"), HTMLElement);
      if (c) {
        var d = v["default"](u.querySelector(".js-commit-preview"), HTMLElement);
        return d.innerHTML = "", d.appendChild(c), f(u, "show-preview")
      }
      return f(u, "no-changes-preview")
    }), m["default"](document).on("ajaxError", ".js-blob-preview-form", function() {
      var e = document.querySelector(".js-code-editor");
      e && f(e, "error-preview")
    }), m["default"](document).on("change", ".js-quick-pull-choice-option", function() {
      var e = "quick-pull" === m["default"](this).val(),
        t = m["default"](".js-quick-pull-target-branch"),
        n = m["default"](".js-quick-pull-choice-value"),
        r = m["default"](".js-blob-submit");
      if (v["default"](document.querySelector(".js-quick-pull-branch-name"), HTMLElement).classList.toggle("d-none", !e), e) {
        var i = m["default"](".js-quick-pull-new-branch-name");
        return i.val().length || i.val(i.attr("data-generated-branch")), i.focus().select(), t.val(i.val()), n.val(t.attr("data-default-value")), r.text(r.attr("data-pull-text"))
      }
      return t.val(t.attr("data-default-value")), n.val(""), r.text(r.attr("data-edit-text"))
    });
    var b = new g["default"],
      w = null,
      C = y["default"](p, 200);
    s.observe(".js-quick-pull-new-branch-name", function(e) {
      m["default"](e).on("input", function() {
        var e = this.value;
        w = v["default"](document.querySelector(".js-quick-pull-target-branch"), HTMLInputElement), w.value = e, e.length && C()
      })
    }), s.observe("[data-template-button]", function(e) {
      m["default"](e).on("click", function() {
        window.onbeforeunload = null
      })
    }), m["default"](document).on("submit", ".js-blob-form", function() {
      if ("quick-pull" === m["default"](this).find(".js-quick-pull-choice-option:checked").val()) {
        var e = m["default"](this).find(".js-blob-submit"),
          t = "location:editor view; text:" + e.attr("data-pull-text");
        u.trackEvent({
          category: "Repository",
          action: "go to new pull request form",
          label: t
        })
      }
    })
  }), define.register("codemirror/lib/codemirror"),
  function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.CodeMirror = t()
  }(this, function() {
    "use strict";

    function e(e) {
      return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
    }

    function t(e) {
      for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild);
      return e
    }

    function n(e, n) {
      return t(e).appendChild(n)
    }

    function r(e, t, n, r) {
      var i = document.createElement(e);
      if (n && (i.className = n), r && (i.style.cssText = r), "string" == typeof t) i.appendChild(document.createTextNode(t));
      else if (t)
        for (var o = 0; o < t.length; ++o) i.appendChild(t[o]);
      return i
    }

    function i(e, t, n, i) {
      var o = r(e, t, n, i);
      return o.setAttribute("role", "presentation"), o
    }

    function o(e, t) {
      if (3 == t.nodeType && (t = t.parentNode), e.contains) return e.contains(t);
      do
        if (11 == t.nodeType && (t = t.host), t == e) return !0; while (t = t.parentNode)
    }

    function l() {
      var e;
      try {
        e = document.activeElement
      } catch (t) {
        e = document.body || null
      }
      for (; e && e.shadowRoot && e.shadowRoot.activeElement;) e = e.shadowRoot.activeElement;
      return e
    }

    function a(t, n) {
      var r = t.className;
      e(n).test(r) || (t.className += (r ? " " : "") + n)
    }

    function s(t, n) {
      for (var r = t.split(" "), i = 0; i < r.length; i++) r[i] && !e(r[i]).test(n) && (n += " " + r[i]);
      return n
    }

    function c(e) {
      var t = Array.prototype.slice.call(arguments, 1);
      return function() {
        return e.apply(null, t)
      }
    }

    function u(e, t, n) {
      t || (t = {});
      for (var r in e) !e.hasOwnProperty(r) || n === !1 && t.hasOwnProperty(r) || (t[r] = e[r]);
      return t
    }

    function d(e, t, n, r, i) {
      null == t && (t = e.search(/[^\s\u00a0]/), -1 == t && (t = e.length));
      for (var o = r || 0, l = i || 0;;) {
        var a = e.indexOf("	", o);
        if (0 > a || a >= t) return l + (t - o);
        l += a - o, l += n - l % n, o = a + 1
      }
    }

    function f(e, t) {
      for (var n = 0; n < e.length; ++n)
        if (e[n] == t) return n;
      return -1
    }

    function h(e, t, n) {
      for (var r = 0, i = 0;;) {
        var o = e.indexOf("	", r); - 1 == o && (o = e.length);
        var l = o - r;
        if (o == e.length || i + l >= t) return r + Math.min(l, t - i);
        if (i += o - r, i += n - i % n, r = o + 1, i >= t) return r
      }
    }

    function p(e) {
      for (; Bl.length <= e;) Bl.push(m(Bl) + " ");
      return Bl[e]
    }

    function m(e) {
      return e[e.length - 1]
    }

    function g(e, t) {
      for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r);
      return n
    }

    function v(e, t, n) {
      for (var r = 0, i = n(t); r < e.length && n(e[r]) <= i;) r++;
      e.splice(r, 0, t)
    }

    function y() {}

    function x(e, t) {
      var n;
      return Object.create ? n = Object.create(e) : (y.prototype = e, n = new y), t && u(t, n), n
    }

    function b(e) {
      return /\w/.test(e) || e > "\x80" && (e.toUpperCase() != e.toLowerCase() || Ul.test(e))
    }

    function w(e, t) {
      return t ? t.source.indexOf("\\w") > -1 && b(e) ? !0 : t.test(e) : b(e)
    }

    function C(e) {
      for (var t in e)
        if (e.hasOwnProperty(t) && e[t]) return !1;
      return !0
    }

    function S(e) {
      return e.charCodeAt(0) >= 768 && Gl.test(e)
    }

    function L(e, t, n) {
      for (;
        (0 > n ? t > 0 : t < e.length) && S(e.charAt(t));) t += n;
      return t
    }

    function k(e, t, n) {
      for (;;) {
        if (Math.abs(t - n) <= 1) return e(t) ? t : n;
        var r = Math.floor((t + n) / 2);
        e(r) ? n = r : t = r
      }
    }

    function M(e, t, n) {
      var o = this;
      this.input = n, o.scrollbarFiller = r("div", null, "CodeMirror-scrollbar-filler"), o.scrollbarFiller.setAttribute("cm-not-content", "true"), o.gutterFiller = r("div", null, "CodeMirror-gutter-filler"), o.gutterFiller.setAttribute("cm-not-content", "true"), o.lineDiv = i("div", null, "CodeMirror-code"), o.selectionDiv = r("div", null, null, "position: relative; z-index: 1"), o.cursorDiv = r("div", null, "CodeMirror-cursors"), o.measure = r("div", null, "CodeMirror-measure"), o.lineMeasure = r("div", null, "CodeMirror-measure"), o.lineSpace = i("div", [o.measure, o.lineMeasure, o.selectionDiv, o.cursorDiv, o.lineDiv], null, "position: relative; outline: none");
      var l = i("div", [o.lineSpace], "CodeMirror-lines");
      o.mover = r("div", [l], null, "position: relative"), o.sizer = r("div", [o.mover], "CodeMirror-sizer"), o.sizerWidth = null, o.heightForcer = r("div", null, null, "position: absolute; height: " + Il + "px; width: 1px;"), o.gutters = r("div", null, "CodeMirror-gutters"), o.lineGutter = null, o.scroller = r("div", [o.sizer, o.heightForcer, o.gutters], "CodeMirror-scroll"), o.scroller.setAttribute("tabIndex", "-1"), o.wrapper = r("div", [o.scrollbarFiller, o.gutterFiller, o.scroller], "CodeMirror"), hl && 8 > pl && (o.gutters.style.zIndex = -1, o.scroller.style.paddingRight = 0), ml || cl && Ll || (o.scroller.draggable = !0), e && (e.appendChild ? e.appendChild(o.wrapper) : e(o.wrapper)), o.viewFrom = o.viewTo = t.first, o.reportedViewFrom = o.reportedViewTo = t.first, o.view = [], o.renderedView = null, o.externalMeasured = null, o.viewOffset = 0, o.lastWrapHeight = o.lastWrapWidth = 0, o.updateLineNumbers = null, o.nativeBarWidth = o.barHeight = o.barWidth = 0, o.scrollbarsClipped = !1, o.lineNumWidth = o.lineNumInnerWidth = o.lineNumChars = null, o.alignWidgets = !1, o.cachedCharWidth = o.cachedTextHeight = o.cachedPaddingH = null, o.maxLine = null, o.maxLineLength = 0, o.maxLineChanged = !1, o.wheelDX = o.wheelDY = o.wheelStartX = o.wheelStartY = null, o.shift = !1, o.selForContextMenu = null, o.activeTouch = null, n.init(o)
    }

    function T(e, t) {
      if (t -= e.first, 0 > t || t >= e.size) throw new Error("There is no line " + (t + e.first) + " in the document.");
      for (var n = e; !n.lines;)
        for (var r = 0;; ++r) {
          var i = n.children[r],
            o = i.chunkSize();
          if (o > t) {
            n = i;
            break
          }
          t -= o
        }
      return n.lines[t]
    }

    function O(e, t, n) {
      var r = [],
        i = t.line;
      return e.iter(t.line, n.line + 1, function(e) {
        var o = e.text;
        i == n.line && (o = o.slice(0, n.ch)), i == t.line && (o = o.slice(t.ch)), r.push(o), ++i
      }), r
    }

    function N(e, t, n) {
      var r = [];
      return e.iter(t, n, function(e) {
        r.push(e.text)
      }), r
    }

    function A(e, t) {
      var n = t - e.height;
      if (n)
        for (var r = e; r; r = r.parent) r.height += n
    }

    function E(e) {
      if (null == e.parent) return null;
      for (var t = e.parent, n = f(t.lines, e), r = t.parent; r; t = r, r = r.parent)
        for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize();
      return n + t.first
    }

    function D(e, t) {
      var n = e.first;
      e: do {
        for (var r = 0; r < e.children.length; ++r) {
          var i = e.children[r],
            o = i.height;
          if (o > t) {
            e = i;
            continue e
          }
          t -= o, n += i.chunkSize()
        }
        return n
      } while (!e.lines);
      for (var l = 0; l < e.lines.length; ++l) {
        var a = e.lines[l],
          s = a.height;
        if (s > t) break;
        t -= s
      }
      return n + l
    }

    function H(e, t) {
      return t >= e.first && t < e.first + e.size
    }

    function W(e, t) {
      return String(e.lineNumberFormatter(t + e.firstLineNumber))
    }

    function P(e, t, n) {
      return void 0 === n && (n = null), this instanceof P ? (this.line = e, this.ch = t, void(this.sticky = n)) : new P(e, t, n)
    }

    function j(e, t) {
      return e.line - t.line || e.ch - t.ch
    }

    function I(e, t) {
      return e.sticky == t.sticky && 0 == j(e, t)
    }

    function F(e) {
      return P(e.line, e.ch)
    }

    function R(e, t) {
      return j(e, t) < 0 ? t : e
    }

    function q(e, t) {
      return j(e, t) < 0 ? e : t
    }

    function z(e, t) {
      return Math.max(e.first, Math.min(t, e.first + e.size - 1))
    }

    function B(e, t) {
      if (t.line < e.first) return P(e.first, 0);
      var n = e.first + e.size - 1;
      return t.line > n ? P(n, T(e, n).text.length) : U(t, T(e, t.line).text.length)
    }

    function U(e, t) {
      var n = e.ch;
      return null == n || n > t ? P(e.line, t) : 0 > n ? P(e.line, 0) : e
    }

    function G(e, t) {
      for (var n = [], r = 0; r < t.length; r++) n[r] = B(e, t[r]);
      return n
    }

    function V() {
      Vl = !0
    }

    function K() {
      Kl = !0
    }

    function _(e, t, n) {
      this.marker = e, this.from = t, this.to = n
    }

    function X(e, t) {
      if (e)
        for (var n = 0; n < e.length; ++n) {
          var r = e[n];
          if (r.marker == t) return r
        }
    }

    function $(e, t) {
      for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r]);
      return n
    }

    function Y(e, t) {
      e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t], t.marker.attachLine(e)
    }

    function J(e, t, n) {
      var r;
      if (e)
        for (var i = 0; i < e.length; ++i) {
          var o = e[i],
            l = o.marker,
            a = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
          if (a || o.from == t && "bookmark" == l.type && (!n || !o.marker.insertLeft)) {
            var s = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
            (r || (r = [])).push(new _(l, o.from, s ? null : o.to))
          }
        }
      return r
    }

    function Q(e, t, n) {
      var r;
      if (e)
        for (var i = 0; i < e.length; ++i) {
          var o = e[i],
            l = o.marker,
            a = null == o.to || (l.inclusiveRight ? o.to >= t : o.to > t);
          if (a || o.from == t && "bookmark" == l.type && (!n || o.marker.insertLeft)) {
            var s = null == o.from || (l.inclusiveLeft ? o.from <= t : o.from < t);
            (r || (r = [])).push(new _(l, s ? null : o.from - t, null == o.to ? null : o.to - t))
          }
        }
      return r
    }

    function Z(e, t) {
      if (t.full) return null;
      var n = H(e, t.from.line) && T(e, t.from.line).markedSpans,
        r = H(e, t.to.line) && T(e, t.to.line).markedSpans;
      if (!n && !r) return null;
      var i = t.from.ch,
        o = t.to.ch,
        l = 0 == j(t.from, t.to),
        a = J(n, i, l),
        s = Q(r, o, l),
        c = 1 == t.text.length,
        u = m(t.text).length + (c ? i : 0);
      if (a)
        for (var d = 0; d < a.length; ++d) {
          var f = a[d];
          if (null == f.to) {
            var h = X(s, f.marker);
            h ? c && (f.to = null == h.to ? null : h.to + u) : f.to = i
          }
        }
      if (s)
        for (var p = 0; p < s.length; ++p) {
          var g = s[p];
          if (null != g.to && (g.to += u), null == g.from) {
            var v = X(a, g.marker);
            v || (g.from = u, c && (a || (a = [])).push(g))
          } else g.from += u, c && (a || (a = [])).push(g)
        }
      a && (a = ee(a)), s && s != a && (s = ee(s));
      var y = [a];
      if (!c) {
        var x, b = t.text.length - 2;
        if (b > 0 && a)
          for (var w = 0; w < a.length; ++w) null == a[w].to && (x || (x = [])).push(new _(a[w].marker, null, null));
        for (var C = 0; b > C; ++C) y.push(x);
        y.push(s)
      }
      return y
    }

    function ee(e) {
      for (var t = 0; t < e.length; ++t) {
        var n = e[t];
        null != n.from && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
      }
      return e.length ? e : null
    }

    function te(e, t, n) {
      var r = null;
      if (e.iter(t.line, n.line + 1, function(e) {
          if (e.markedSpans)
            for (var t = 0; t < e.markedSpans.length; ++t) {
              var n = e.markedSpans[t].marker;
              !n.readOnly || r && -1 != f(r, n) || (r || (r = [])).push(n)
            }
        }), !r) return null;
      for (var i = [{
          from: t,
          to: n
        }], o = 0; o < r.length; ++o)
        for (var l = r[o], a = l.find(0), s = 0; s < i.length; ++s) {
          var c = i[s];
          if (!(j(c.to, a.from) < 0 || j(c.from, a.to) > 0)) {
            var u = [s, 1],
              d = j(c.from, a.from),
              h = j(c.to, a.to);
            (0 > d || !l.inclusiveLeft && !d) && u.push({
              from: c.from,
              to: a.from
            }), (h > 0 || !l.inclusiveRight && !h) && u.push({
              from: a.to,
              to: c.to
            }), i.splice.apply(i, u), s += u.length - 3
          }
        }
      return i
    }

    function ne(e) {
      var t = e.markedSpans;
      if (t) {
        for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e);
        e.markedSpans = null
      }
    }

    function re(e, t) {
      if (t) {
        for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e);
        e.markedSpans = t
      }
    }

    function ie(e) {
      return e.inclusiveLeft ? -1 : 0
    }

    function oe(e) {
      return e.inclusiveRight ? 1 : 0
    }

    function le(e, t) {
      var n = e.lines.length - t.lines.length;
      if (0 != n) return n;
      var r = e.find(),
        i = t.find(),
        o = j(r.from, i.from) || ie(e) - ie(t);
      if (o) return -o;
      var l = j(r.to, i.to) || oe(e) - oe(t);
      return l ? l : t.id - e.id
    }

    function ae(e, t) {
      var n, r = Kl && e.markedSpans;
      if (r)
        for (var i = void 0, o = 0; o < r.length; ++o) i = r[o], i.marker.collapsed && null == (t ? i.from : i.to) && (!n || le(n, i.marker) < 0) && (n = i.marker);
      return n
    }

    function se(e) {
      return ae(e, !0)
    }

    function ce(e) {
      return ae(e, !1)
    }

    function ue(e, t, n, r, i) {
      var o = T(e, t),
        l = Kl && o.markedSpans;
      if (l)
        for (var a = 0; a < l.length; ++a) {
          var s = l[a];
          if (s.marker.collapsed) {
            var c = s.marker.find(0),
              u = j(c.from, n) || ie(s.marker) - ie(i),
              d = j(c.to, r) || oe(s.marker) - oe(i);
            if (!(u >= 0 && 0 >= d || 0 >= u && d >= 0) && (0 >= u && (s.marker.inclusiveRight && i.inclusiveLeft ? j(c.to, n) >= 0 : j(c.to, n) > 0) || u >= 0 && (s.marker.inclusiveRight && i.inclusiveLeft ? j(c.from, r) <= 0 : j(c.from, r) < 0))) return !0
          }
        }
    }

    function de(e) {
      for (var t; t = se(e);) e = t.find(-1, !0).line;
      return e
    }

    function fe(e) {
      for (var t; t = ce(e);) e = t.find(1, !0).line;
      return e
    }

    function he(e) {
      for (var t, n; t = ce(e);) e = t.find(1, !0).line, (n || (n = [])).push(e);
      return n
    }

    function pe(e, t) {
      var n = T(e, t),
        r = de(n);
      return n == r ? t : E(r)
    }

    function me(e, t) {
      if (t > e.lastLine()) return t;
      var n, r = T(e, t);
      if (!ge(e, r)) return t;
      for (; n = ce(r);) r = n.find(1, !0).line;
      return E(r) + 1
    }

    function ge(e, t) {
      var n = Kl && t.markedSpans;
      if (n)
        for (var r = void 0, i = 0; i < n.length; ++i)
          if (r = n[i], r.marker.collapsed) {
            if (null == r.from) return !0;
            if (!r.marker.widgetNode && 0 == r.from && r.marker.inclusiveLeft && ve(e, t, r)) return !0
          }
    }

    function ve(e, t, n) {
      if (null == n.to) {
        var r = n.marker.find(1, !0);
        return ve(e, r.line, X(r.line.markedSpans, n.marker))
      }
      if (n.marker.inclusiveRight && n.to == t.text.length) return !0;
      for (var i = void 0, o = 0; o < t.markedSpans.length; ++o)
        if (i = t.markedSpans[o], i.marker.collapsed && !i.marker.widgetNode && i.from == n.to && (null == i.to || i.to != n.from) && (i.marker.inclusiveLeft || n.marker.inclusiveRight) && ve(e, t, i)) return !0
    }

    function ye(e) {
      e = de(e);
      for (var t = 0, n = e.parent, r = 0; r < n.lines.length; ++r) {
        var i = n.lines[r];
        if (i == e) break;
        t += i.height
      }
      for (var o = n.parent; o; n = o, o = n.parent)
        for (var l = 0; l < o.children.length; ++l) {
          var a = o.children[l];
          if (a == n) break;
          t += a.height
        }
      return t
    }

    function xe(e) {
      if (0 == e.height) return 0;
      for (var t, n = e.text.length, r = e; t = se(r);) {
        var i = t.find(0, !0);
        r = i.from.line, n += i.from.ch - i.to.ch
      }
      for (r = e; t = ce(r);) {
        var o = t.find(0, !0);
        n -= r.text.length - o.from.ch, r = o.to.line, n += r.text.length - o.to.ch
      }
      return n
    }

    function be(e) {
      var t = e.display,
        n = e.doc;
      t.maxLine = T(n, n.first), t.maxLineLength = xe(t.maxLine), t.maxLineChanged = !0, n.iter(function(e) {
        var n = xe(e);
        n > t.maxLineLength && (t.maxLineLength = n, t.maxLine = e)
      })
    }

    function we(e, t, n, r) {
      if (!e) return r(t, n, "ltr");
      for (var i = !1, o = 0; o < e.length; ++o) {
        var l = e[o];
        (l.from < n && l.to > t || t == n && l.to == t) && (r(Math.max(l.from, t), Math.min(l.to, n), 1 == l.level ? "rtl" : "ltr"), i = !0)
      }
      i || r(t, n, "ltr")
    }

    function Ce(e, t, n) {
      var r;
      _l = null;
      for (var i = 0; i < e.length; ++i) {
        var o = e[i];
        if (o.from < t && o.to > t) return i;
        o.to == t && (o.from != o.to && "before" == n ? r = i : _l = i), o.from == t && (o.from != o.to && "before" != n ? r = i : _l = i)
      }
      return null != r ? r : _l
    }

    function Se(e, t) {
      var n = e.order;
      return null == n && (n = e.order = Xl(e.text, t)), n
    }

    function Le(e, t, n) {
      var r = L(e.text, t + n, n);
      return 0 > r || r > e.text.length ? null : r
    }

    function ke(e, t, n) {
      var r = Le(e, t.ch, n);
      return null == r ? null : new P(t.line, r, 0 > n ? "after" : "before")
    }

    function Me(e, t, n, r, i) {
      if (e) {
        var o = Se(n, t.doc.direction);
        if (o) {
          var l, a = 0 > i ? m(o) : o[0],
            s = 0 > i == (1 == a.level),
            c = s ? "after" : "before";
          if (a.level > 0) {
            var u = Jt(t, n);
            l = 0 > i ? n.text.length - 1 : 0;
            var d = Qt(t, u, l).top;
            l = k(function(e) {
              return Qt(t, u, e).top == d
            }, 0 > i == (1 == a.level) ? a.from : a.to - 1, l), "before" == c && (l = Le(n, l, 1))
          } else l = 0 > i ? a.to : a.from;
          return new P(r, l, c)
        }
      }
      return new P(r, 0 > i ? n.text.length : 0, 0 > i ? "before" : "after")
    }

    function Te(e, t, n, r) {
      var i = Se(t, e.doc.direction);
      if (!i) return ke(t, n, r);
      n.ch >= t.text.length ? (n.ch = t.text.length, n.sticky = "before") : n.ch <= 0 && (n.ch = 0, n.sticky = "after");
      var o = Ce(i, n.ch, n.sticky),
        l = i[o];
      if ("ltr" == e.doc.direction && l.level % 2 == 0 && (r > 0 ? l.to > n.ch : l.from < n.ch)) return ke(t, n, r);
      var a, s = function(e, n) {
          return Le(t, e instanceof P ? e.ch : e, n)
        },
        c = function(n) {
          return e.options.lineWrapping ? (a = a || Jt(e, t), vn(e, t, a, n)) : {
            begin: 0,
            end: t.text.length
          }
        },
        u = c("before" == n.sticky ? s(n, -1) : n.ch);
      if ("rtl" == e.doc.direction || 1 == l.level) {
        var d = 1 == l.level == 0 > r,
          f = s(n, d ? 1 : -1);
        if (null != f && (d ? f <= l.to && f <= u.end : f >= l.from && f >= u.begin)) {
          var h = d ? "before" : "after";
          return new P(n.line, f, h)
        }
      }
      var p = function(e, t, r) {
          for (var o = function(e, t) {
              return t ? new P(n.line, s(e, 1), "before") : new P(n.line, e, "after")
            }; e >= 0 && e < i.length; e += t) {
            var l = i[e],
              a = t > 0 == (1 != l.level),
              c = a ? r.begin : s(r.end, -1);
            if (l.from <= c && c < l.to) return o(c, a);
            if (c = a ? l.from : s(l.to, -1), r.begin <= c && c < r.end) return o(c, a)
          }
        },
        m = p(o + r, r, u);
      if (m) return m;
      var g = r > 0 ? u.end : s(u.begin, -1);
      return null == g || r > 0 && g == t.text.length || !(m = p(r > 0 ? 0 : i.length - 1, r, c(g))) ? null : m
    }

    function Oe(e, t) {
      return e._handlers && e._handlers[t] || $l
    }

    function Ne(e, t, n) {
      if (e.removeEventListener) e.removeEventListener(t, n, !1);
      else if (e.detachEvent) e.detachEvent("on" + t, n);
      else {
        var r = e._handlers,
          i = r && r[t];
        if (i) {
          var o = f(i, n);
          o > -1 && (r[t] = i.slice(0, o).concat(i.slice(o + 1)))
        }
      }
    }

    function Ae(e, t) {
      var n = Oe(e, t);
      if (n.length)
        for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
    }

    function Ee(e, t, n) {
      return "string" == typeof t && (t = {
        type: t,
        preventDefault: function() {
          this.defaultPrevented = !0
        }
      }), Ae(e, n || t.type, e, t), Ie(t) || t.codemirrorIgnore
    }

    function De(e) {
      var t = e._handlers && e._handlers.cursorActivity;
      if (t)
        for (var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r) - 1 == f(n, t[r]) && n.push(t[r])
    }

    function He(e, t) {
      return Oe(e, t).length > 0
    }

    function We(e) {
      e.prototype.on = function(e, t) {
        Yl(this, e, t)
      }, e.prototype.off = function(e, t) {
        Ne(this, e, t)
      }
    }

    function Pe(e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }

    function je(e) {
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
    }

    function Ie(e) {
      return null != e.defaultPrevented ? e.defaultPrevented : 0 == e.returnValue
    }

    function Fe(e) {
      Pe(e), je(e)
    }

    function Re(e) {
      return e.target || e.srcElement
    }

    function qe(e) {
      var t = e.which;
      return null == t && (1 & e.button ? t = 1 : 2 & e.button ? t = 3 : 4 & e.button && (t = 2)), kl && e.ctrlKey && 1 == t && (t = 3), t
    }

    function ze(e) {
      if (null == Pl) {
        var t = r("span", "\u200b");
        n(e, r("span", [t, document.createTextNode("x")])), 0 != e.firstChild.offsetHeight && (Pl = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(hl && 8 > pl))
      }
      var i = Pl ? r("span", "\u200b") : r("span", "\xa0", null, "display: inline-block; width: 1px; margin-right: -1px");
      return i.setAttribute("cm-text", ""), i
    }

    function Be(e) {
      if (null != jl) return jl;
      var r = n(e, document.createTextNode("A\u062eA")),
        i = Nl(r, 0, 1).getBoundingClientRect(),
        o = Nl(r, 1, 2).getBoundingClientRect();
      return t(e), i && i.left != i.right ? jl = o.right - i.right < 3 : !1
    }

    function Ue(e) {
      if (null != ta) return ta;
      var t = n(e, r("span", "x")),
        i = t.getBoundingClientRect(),
        o = Nl(t, 0, 1).getBoundingClientRect();
      return ta = Math.abs(i.left - o.left) > 1
    }

    function Ge(e, t) {
      arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)), na[e] = t
    }

    function Ve(e, t) {
      ra[e] = t
    }

    function Ke(e) {
      if ("string" == typeof e && ra.hasOwnProperty(e)) e = ra[e];
      else if (e && "string" == typeof e.name && ra.hasOwnProperty(e.name)) {
        var t = ra[e.name];
        "string" == typeof t && (t = {
          name: t
        }), e = x(t, e), e.name = t.name
      } else {
        if ("string" == typeof e && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) return Ke("application/xml");
        if ("string" == typeof e && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) return Ke("application/json")
      }
      return "string" == typeof e ? {
        name: e
      } : e || {
        name: "null"
      }
    }

    function _e(e, t) {
      t = Ke(t);
      var n = na[t.name];
      if (!n) return _e(e, "text/plain");
      var r = n(e, t);
      if (ia.hasOwnProperty(t.name)) {
        var i = ia[t.name];
        for (var o in i) i.hasOwnProperty(o) && (r.hasOwnProperty(o) && (r["_" + o] = r[o]), r[o] = i[o])
      }
      if (r.name = t.name, t.helperType && (r.helperType = t.helperType), t.modeProps)
        for (var l in t.modeProps) r[l] = t.modeProps[l];
      return r
    }

    function Xe(e, t) {
      var n = ia.hasOwnProperty(e) ? ia[e] : ia[e] = {};
      u(t, n)
    }

    function $e(e, t) {
      if (t === !0) return t;
      if (e.copyState) return e.copyState(t);
      var n = {};
      for (var r in t) {
        var i = t[r];
        i instanceof Array && (i = i.concat([])), n[r] = i
      }
      return n
    }

    function Ye(e, t) {
      for (var n; e.innerMode && (n = e.innerMode(t), n && n.mode != e);) t = n.state, e = n.mode;
      return n || {
        mode: e,
        state: t
      }
    }

    function Je(e, t, n) {
      return e.startState ? e.startState(t, n) : !0
    }

    function Qe(e, t, n, r) {
      var i = [e.state.modeGen],
        o = {};
      lt(e, t.text, e.doc.mode, n, function(e, t) {
        return i.push(e, t)
      }, o, r);
      for (var l = n.state, a = function(r) {
          var l = e.state.overlays[r],
            a = 1,
            s = 0;
          n.state = !0, lt(e, t.text, l.mode, n, function(e, t) {
            for (var n = a; e > s;) {
              var r = i[a];
              r > e && i.splice(a, 1, e, i[a + 1], r), a += 2, s = Math.min(e, r)
            }
            if (t)
              if (l.opaque) i.splice(n, a - n, e, "overlay " + t), a = n + 2;
              else
                for (; a > n; n += 2) {
                  var o = i[n + 1];
                  i[n + 1] = (o ? o + " " : "") + "overlay " + t
                }
          }, o)
        }, s = 0; s < e.state.overlays.length; ++s) a(s);
      return n.state = l, {
        styles: i,
        classes: o.bgClass || o.textClass ? o : null
      }
    }

    function Ze(e, t, n) {
      if (!t.styles || t.styles[0] != e.state.modeGen) {
        var r = et(e, E(t)),
          i = t.text.length > e.options.maxHighlightLength && $e(e.doc.mode, r.state),
          o = Qe(e, t, r);
        i && (r.state = i), t.stateAfter = r.save(!i), t.styles = o.styles, o.classes ? t.styleClasses = o.classes : t.styleClasses && (t.styleClasses = null), n === e.doc.highlightFrontier && (e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier))
      }
      return t.styles
    }

    function et(e, t, n) {
      var r = e.doc,
        i = e.display;
      if (!r.mode.startState) return new aa(r, !0, t);
      var o = at(e, t, n),
        l = o > r.first && T(r, o - 1).stateAfter,
        a = l ? aa.fromSaved(r, l, o) : new aa(r, Je(r.mode), o);
      return r.iter(o, t, function(n) {
        tt(e, n.text, a);
        var r = a.line;
        n.stateAfter = r == t - 1 || r % 5 == 0 || r >= i.viewFrom && r < i.viewTo ? a.save() : null, a.nextLine()
      }), n && (r.modeFrontier = a.line), a
    }

    function tt(e, t, n, r) {
      var i = e.doc.mode,
        o = new oa(t, e.options.tabSize, n);
      for (o.start = o.pos = r || 0, "" == t && nt(i, n.state); !o.eol();) rt(i, o, n.state), o.start = o.pos
    }

    function nt(e, t) {
      if (e.blankLine) return e.blankLine(t);
      if (e.innerMode) {
        var n = Ye(e, t);
        return n.mode.blankLine ? n.mode.blankLine(n.state) : void 0
      }
    }

    function rt(e, t, n, r) {
      for (var i = 0; 10 > i; i++) {
        r && (r[0] = Ye(e, n).mode);
        var o = e.token(t, n);
        if (t.pos > t.start) return o
      }
      throw new Error("Mode " + e.name + " failed to advance stream.")
    }

    function it(e, t, n, r) {
      var i, o = e.doc,
        l = o.mode;
      t = B(o, t);
      var a, s = T(o, t.line),
        c = et(e, t.line, n),
        u = new oa(s.text, e.options.tabSize, c);
      for (r && (a = []);
        (r || u.pos < t.ch) && !u.eol();) u.start = u.pos, i = rt(l, u, c.state), r && a.push(new sa(u, i, $e(o.mode, c.state)));
      return r ? a : new sa(u, i, c.state)
    }

    function ot(e, t) {
      if (e)
        for (;;) {
          var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/);
          if (!n) break;
          e = e.slice(0, n.index) + e.slice(n.index + n[0].length);
          var r = n[1] ? "bgClass" : "textClass";
          null == t[r] ? t[r] = n[2] : new RegExp("(?:^|s)" + n[2] + "(?:$|s)").test(t[r]) || (t[r] += " " + n[2])
        }
      return e
    }

    function lt(e, t, n, r, i, o, l) {
      var a = n.flattenSpans;
      null == a && (a = e.options.flattenSpans);
      var s, c = 0,
        u = null,
        d = new oa(t, e.options.tabSize, r),
        f = e.options.addModeClass && [null];
      for ("" == t && ot(nt(n, r.state), o); !d.eol();) {
        if (d.pos > e.options.maxHighlightLength ? (a = !1, l && tt(e, t, r, d.pos), d.pos = t.length, s = null) : s = ot(rt(n, d, r.state, f), o), f) {
          var h = f[0].name;
          h && (s = "m-" + (s ? h + " " + s : h))
        }
        if (!a || u != s) {
          for (; c < d.start;) c = Math.min(d.start, c + 5e3), i(c, u);
          u = s
        }
        d.start = d.pos
      }
      for (; c < d.pos;) {
        var p = Math.min(d.pos, c + 5e3);
        i(p, u), c = p
      }
    }

    function at(e, t, n) {
      for (var r, i, o = e.doc, l = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), a = t; a > l; --a) {
        if (a <= o.first) return o.first;
        var s = T(o, a - 1),
          c = s.stateAfter;
        if (c && (!n || a + (c instanceof la ? c.lookAhead : 0) <= o.modeFrontier)) return a;
        var u = d(s.text, null, e.options.tabSize);
        (null == i || r > u) && (i = a - 1, r = u)
      }
      return i
    }

    function st(e, t) {
      if (e.modeFrontier = Math.min(e.modeFrontier, t), !(e.highlightFrontier < t - 10)) {
        for (var n = e.first, r = t - 1; r > n; r--) {
          var i = T(e, r).stateAfter;
          if (i && (!(i instanceof la) || r + i.lookAhead < t)) {
            n = r + 1;
            break
          }
        }
        e.highlightFrontier = Math.min(e.highlightFrontier, n)
      }
    }

    function ct(e, t, n, r) {
      e.text = t, e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null), null != e.order && (e.order = null), ne(e), re(e, n);
      var i = r ? r(e) : 1;
      i != e.height && A(e, i)
    }

    function ut(e) {
      e.parent = null, ne(e)
    }

    function dt(e, t) {
      if (!e || /^\s*$/.test(e)) return null;
      var n = t.addModeClass ? fa : da;
      return n[e] || (n[e] = e.replace(/\S+/g, "cm-$&"))
    }

    function ft(e, t) {
      var n = i("span", null, null, ml ? "padding-right: .1px" : null),
        r = {
          pre: i("pre", [n], "CodeMirror-line"),
          content: n,
          col: 0,
          pos: 0,
          cm: e,
          trailingSpace: !1,
          splitSpaces: (hl || ml) && e.getOption("lineWrapping")
        };
      t.measure = {};
      for (var o = 0; o <= (t.rest ? t.rest.length : 0); o++) {
        var l = o ? t.rest[o - 1] : t.line,
          a = void 0;
        r.pos = 0, r.addToken = pt, Be(e.display.measure) && (a = Se(l, e.doc.direction)) && (r.addToken = gt(r.addToken, a)), r.map = [];
        var c = t != e.display.externalMeasured && E(l);
        yt(l, r, Ze(e, l, c)), l.styleClasses && (l.styleClasses.bgClass && (r.bgClass = s(l.styleClasses.bgClass, r.bgClass || "")), l.styleClasses.textClass && (r.textClass = s(l.styleClasses.textClass, r.textClass || ""))), 0 == r.map.length && r.map.push(0, 0, r.content.appendChild(ze(e.display.measure))), 0 == o ? (t.measure.map = r.map, t.measure.cache = {}) : ((t.measure.maps || (t.measure.maps = [])).push(r.map), (t.measure.caches || (t.measure.caches = [])).push({}))
      }
      if (ml) {
        var u = r.content.lastChild;
        (/\bcm-tab\b/.test(u.className) || u.querySelector && u.querySelector(".cm-tab")) && (r.content.className = "cm-tab-wrap-hack")
      }
      return Ae(e, "renderLine", e, t.line, r.pre), r.pre.className && (r.textClass = s(r.pre.className, r.textClass || "")), r
    }

    function ht(e) {
      var t = r("span", "\u2022", "cm-invalidchar");
      return t.title = "\\u" + e.charCodeAt(0).toString(16), t.setAttribute("aria-label", t.title), t
    }

    function pt(e, t, n, i, o, l, a) {
      if (t) {
        var s, c = e.splitSpaces ? mt(t, e.trailingSpace) : t,
          u = e.cm.state.specialChars,
          d = !1;
        if (u.test(t)) {
          s = document.createDocumentFragment();
          for (var f = 0;;) {
            u.lastIndex = f;
            var h = u.exec(t),
              m = h ? h.index - f : t.length - f;
            if (m) {
              var g = document.createTextNode(c.slice(f, f + m));
              hl && 9 > pl ? s.appendChild(r("span", [g])) : s.appendChild(g), e.map.push(e.pos, e.pos + m, g), e.col += m, e.pos += m
            }
            if (!h) break;
            f += m + 1;
            var v = void 0;
            if ("	" == h[0]) {
              var y = e.cm.options.tabSize,
                x = y - e.col % y;
              v = s.appendChild(r("span", p(x), "cm-tab")), v.setAttribute("role", "presentation"), v.setAttribute("cm-text", "	"), e.col += x
            } else "\r" == h[0] || "\n" == h[0] ? (v = s.appendChild(r("span", "\r" == h[0] ? "\u240d" : "\u2424", "cm-invalidchar")), v.setAttribute("cm-text", h[0]), e.col += 1) : (v = e.cm.options.specialCharPlaceholder(h[0]), v.setAttribute("cm-text", h[0]), hl && 9 > pl ? s.appendChild(r("span", [v])) : s.appendChild(v), e.col += 1);
            e.map.push(e.pos, e.pos + 1, v), e.pos++
          }
        } else e.col += t.length, s = document.createTextNode(c), e.map.push(e.pos, e.pos + t.length, s), hl && 9 > pl && (d = !0), e.pos += t.length;
        if (e.trailingSpace = 32 == c.charCodeAt(t.length - 1), n || i || o || d || a) {
          var b = n || "";
          i && (b += i), o && (b += o);
          var w = r("span", [s], b, a);
          return l && (w.title = l), e.content.appendChild(w)
        }
        e.content.appendChild(s)
      }
    }

    function mt(e, t) {
      if (e.length > 1 && !/  /.test(e)) return e;
      for (var n = t, r = "", i = 0; i < e.length; i++) {
        var o = e.charAt(i);
        " " != o || !n || i != e.length - 1 && 32 != e.charCodeAt(i + 1) || (o = "\xa0"), r += o, n = " " == o
      }
      return r
    }

    function gt(e, t) {
      return function(n, r, i, o, l, a, s) {
        i = i ? i + " cm-force-border" : "cm-force-border";
        for (var c = n.pos, u = c + r.length;;) {
          for (var d = void 0, f = 0; f < t.length && (d = t[f], !(d.to > c && d.from <= c)); f++);
          if (d.to >= u) return e(n, r, i, o, l, a, s);
          e(n, r.slice(0, d.to - c), i, o, null, a, s), o = null, r = r.slice(d.to - c), c = d.to
        }
      }
    }

    function vt(e, t, n, r) {
      var i = !r && n.widgetNode;
      i && e.map.push(e.pos, e.pos + t, i), !r && e.cm.display.input.needsContentAttribute && (i || (i = e.content.appendChild(document.createElement("span"))), i.setAttribute("cm-marker", n.id)), i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)), e.pos += t, e.trailingSpace = !1
    }

    function yt(e, t, n) {
      var r = e.markedSpans,
        i = e.text,
        o = 0;
      if (r)
        for (var l, a, s, c, u, d, f, h = i.length, p = 0, m = 1, g = "", v = 0;;) {
          if (v == p) {
            s = c = u = d = a = "", f = null, v = 1 / 0;
            for (var y = [], x = void 0, b = 0; b < r.length; ++b) {
              var w = r[b],
                C = w.marker;
              "bookmark" == C.type && w.from == p && C.widgetNode ? y.push(C) : w.from <= p && (null == w.to || w.to > p || C.collapsed && w.to == p && w.from == p) ? (null != w.to && w.to != p && v > w.to && (v = w.to, c = ""), C.className && (s += " " + C.className), C.css && (a = (a ? a + ";" : "") + C.css), C.startStyle && w.from == p && (u += " " + C.startStyle), C.endStyle && w.to == v && (x || (x = [])).push(C.endStyle, w.to), C.title && !d && (d = C.title), C.collapsed && (!f || le(f.marker, C) < 0) && (f = w)) : w.from > p && v > w.from && (v = w.from)
            }
            if (x)
              for (var S = 0; S < x.length; S += 2) x[S + 1] == v && (c += " " + x[S]);
            if (!f || f.from == p)
              for (var L = 0; L < y.length; ++L) vt(t, 0, y[L]);
            if (f && (f.from || 0) == p) {
              if (vt(t, (null == f.to ? h + 1 : f.to) - p, f.marker, null == f.from), null == f.to) return;
              f.to == p && (f = !1)
            }
          }
          if (p >= h) break;
          for (var k = Math.min(h, v);;) {
            if (g) {
              var M = p + g.length;
              if (!f) {
                var T = M > k ? g.slice(0, k - p) : g;
                t.addToken(t, T, l ? l + s : s, u, p + T.length == v ? c : "", d, a)
              }
              if (M >= k) {
                g = g.slice(k - p), p = k;
                break
              }
              p = M, u = ""
            }
            g = i.slice(o, o = n[m++]), l = dt(n[m++], t.cm.options)
          }
        } else
          for (var O = 1; O < n.length; O += 2) t.addToken(t, i.slice(o, o = n[O]), dt(n[O + 1], t.cm.options))
    }

    function xt(e, t, n) {
      this.line = t, this.rest = he(t), this.size = this.rest ? E(m(this.rest)) - n + 1 : 1, this.node = this.text = null, this.hidden = ge(e, t)
    }

    function bt(e, t, n) {
      for (var r, i = [], o = t; n > o; o = r) {
        var l = new xt(e.doc, T(e.doc, o), o);
        r = o + l.size, i.push(l)
      }
      return i
    }

    function wt(e) {
      ha ? ha.ops.push(e) : e.ownsGroup = ha = {
        ops: [e],
        delayedCallbacks: []
      }
    }

    function Ct(e) {
      var t = e.delayedCallbacks,
        n = 0;
      do {
        for (; n < t.length; n++) t[n].call(null);
        for (var r = 0; r < e.ops.length; r++) {
          var i = e.ops[r];
          if (i.cursorActivityHandlers)
            for (; i.cursorActivityCalled < i.cursorActivityHandlers.length;) i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
        }
      } while (n < t.length)
    }

    function St(e, t) {
      var n = e.ownsGroup;
      if (n) try {
        Ct(n)
      } finally {
        ha = null, t(n)
      }
    }

    function Lt(e, t) {
      var n = Oe(e, t);
      if (n.length) {
        var r, i = Array.prototype.slice.call(arguments, 2);
        ha ? r = ha.delayedCallbacks : pa ? r = pa : (r = pa = [], setTimeout(kt, 0));
        for (var o = function(e) {
            r.push(function() {
              return n[e].apply(null, i)
            })
          }, l = 0; l < n.length; ++l) o(l)
      }
    }

    function kt() {
      var e = pa;
      pa = null;
      for (var t = 0; t < e.length; ++t) e[t]();
    }

    function Mt(e, t, n, r) {
      for (var i = 0; i < t.changes.length; i++) {
        var o = t.changes[i];
        "text" == o ? At(e, t) : "gutter" == o ? Dt(e, t, n, r) : "class" == o ? Et(e, t) : "widget" == o && Ht(e, t, r)
      }
      t.changes = null
    }

    function Tt(e) {
      return e.node == e.text && (e.node = r("div", null, null, "position: relative"), e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text), e.node.appendChild(e.text), hl && 8 > pl && (e.node.style.zIndex = 2)), e.node
    }

    function Ot(e, t) {
      var n = t.bgClass ? t.bgClass + " " + (t.line.bgClass || "") : t.line.bgClass;
      if (n && (n += " CodeMirror-linebackground"), t.background) n ? t.background.className = n : (t.background.parentNode.removeChild(t.background), t.background = null);
      else if (n) {
        var i = Tt(t);
        t.background = i.insertBefore(r("div", null, n), i.firstChild), e.display.input.setUneditable(t.background)
      }
    }

    function Nt(e, t) {
      var n = e.display.externalMeasured;
      return n && n.line == t.line ? (e.display.externalMeasured = null, t.measure = n.measure, n.built) : ft(e, t)
    }

    function At(e, t) {
      var n = t.text.className,
        r = Nt(e, t);
      t.text == t.node && (t.node = r.pre), t.text.parentNode.replaceChild(r.pre, t.text), t.text = r.pre, r.bgClass != t.bgClass || r.textClass != t.textClass ? (t.bgClass = r.bgClass, t.textClass = r.textClass, Et(e, t)) : n && (t.text.className = n)
    }

    function Et(e, t) {
      Ot(e, t), t.line.wrapClass ? Tt(t).className = t.line.wrapClass : t.node != t.text && (t.node.className = "");
      var n = t.textClass ? t.textClass + " " + (t.line.textClass || "") : t.line.textClass;
      t.text.className = n || ""
    }

    function Dt(e, t, n, i) {
      if (t.gutter && (t.node.removeChild(t.gutter), t.gutter = null), t.gutterBackground && (t.node.removeChild(t.gutterBackground), t.gutterBackground = null), t.line.gutterClass) {
        var o = Tt(t);
        t.gutterBackground = r("div", null, "CodeMirror-gutter-background " + t.line.gutterClass, "left: " + (e.options.fixedGutter ? i.fixedPos : -i.gutterTotalWidth) + "px; width: " + i.gutterTotalWidth + "px"), e.display.input.setUneditable(t.gutterBackground), o.insertBefore(t.gutterBackground, t.text)
      }
      var l = t.line.gutterMarkers;
      if (e.options.lineNumbers || l) {
        var a = Tt(t),
          s = t.gutter = r("div", null, "CodeMirror-gutter-wrapper", "left: " + (e.options.fixedGutter ? i.fixedPos : -i.gutterTotalWidth) + "px");
        if (e.display.input.setUneditable(s), a.insertBefore(s, t.text), t.line.gutterClass && (s.className += " " + t.line.gutterClass), !e.options.lineNumbers || l && l["CodeMirror-linenumbers"] || (t.lineNumber = s.appendChild(r("div", W(e.options, n), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + i.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + e.display.lineNumInnerWidth + "px"))), l)
          for (var c = 0; c < e.options.gutters.length; ++c) {
            var u = e.options.gutters[c],
              d = l.hasOwnProperty(u) && l[u];
            d && s.appendChild(r("div", [d], "CodeMirror-gutter-elt", "left: " + i.gutterLeft[u] + "px; width: " + i.gutterWidth[u] + "px"))
          }
      }
    }

    function Ht(e, t, n) {
      t.alignable && (t.alignable = null);
      for (var r = t.node.firstChild, i = void 0; r; r = i) i = r.nextSibling, "CodeMirror-linewidget" == r.className && t.node.removeChild(r);
      Pt(e, t, n)
    }

    function Wt(e, t, n, r) {
      var i = Nt(e, t);
      return t.text = t.node = i.pre, i.bgClass && (t.bgClass = i.bgClass), i.textClass && (t.textClass = i.textClass), Et(e, t), Dt(e, t, n, r), Pt(e, t, r), t.node
    }

    function Pt(e, t, n) {
      if (jt(e, t.line, t, n, !0), t.rest)
        for (var r = 0; r < t.rest.length; r++) jt(e, t.rest[r], t, n, !1)
    }

    function jt(e, t, n, i, o) {
      if (t.widgets)
        for (var l = Tt(n), a = 0, s = t.widgets; a < s.length; ++a) {
          var c = s[a],
            u = r("div", [c.node], "CodeMirror-linewidget");
          c.handleMouseEvents || u.setAttribute("cm-ignore-events", "true"), It(c, u, n, i), e.display.input.setUneditable(u), o && c.above ? l.insertBefore(u, n.gutter || n.text) : l.appendChild(u), Lt(c, "redraw")
        }
    }

    function It(e, t, n, r) {
      if (e.noHScroll) {
        (n.alignable || (n.alignable = [])).push(t);
        var i = r.wrapperWidth;
        t.style.left = r.fixedPos + "px", e.coverGutter || (i -= r.gutterTotalWidth, t.style.paddingLeft = r.gutterTotalWidth + "px"), t.style.width = i + "px"
      }
      e.coverGutter && (t.style.zIndex = 5, t.style.position = "relative", e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + "px"))
    }

    function Ft(e) {
      if (null != e.height) return e.height;
      var t = e.doc.cm;
      if (!t) return 0;
      if (!o(document.body, e.node)) {
        var i = "position: relative;";
        e.coverGutter && (i += "margin-left: -" + t.display.gutters.offsetWidth + "px;"), e.noHScroll && (i += "width: " + t.display.wrapper.clientWidth + "px;"), n(t.display.measure, r("div", [e.node], null, i))
      }
      return e.height = e.node.parentNode.offsetHeight
    }

    function Rt(e, t) {
      for (var n = Re(t); n != e.wrapper; n = n.parentNode)
        if (!n || 1 == n.nodeType && "true" == n.getAttribute("cm-ignore-events") || n.parentNode == e.sizer && n != e.mover) return !0
    }

    function qt(e) {
      return e.lineSpace.offsetTop
    }

    function zt(e) {
      return e.mover.offsetHeight - e.lineSpace.offsetHeight
    }

    function Bt(e) {
      if (e.cachedPaddingH) return e.cachedPaddingH;
      var t = n(e.measure, r("pre", "x")),
        i = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
        o = {
          left: parseInt(i.paddingLeft),
          right: parseInt(i.paddingRight)
        };
      return isNaN(o.left) || isNaN(o.right) || (e.cachedPaddingH = o), o
    }

    function Ut(e) {
      return Il - e.display.nativeBarWidth
    }

    function Gt(e) {
      return e.display.scroller.clientWidth - Ut(e) - e.display.barWidth
    }

    function Vt(e) {
      return e.display.scroller.clientHeight - Ut(e) - e.display.barHeight
    }

    function Kt(e, t, n) {
      var r = e.options.lineWrapping,
        i = r && Gt(e);
      if (!t.measure.heights || r && t.measure.width != i) {
        var o = t.measure.heights = [];
        if (r) {
          t.measure.width = i;
          for (var l = t.text.firstChild.getClientRects(), a = 0; a < l.length - 1; a++) {
            var s = l[a],
              c = l[a + 1];
            Math.abs(s.bottom - c.bottom) > 2 && o.push((s.bottom + c.top) / 2 - n.top)
          }
        }
        o.push(n.bottom - n.top)
      }
    }

    function _t(e, t, n) {
      if (e.line == t) return {
        map: e.measure.map,
        cache: e.measure.cache
      };
      for (var r = 0; r < e.rest.length; r++)
        if (e.rest[r] == t) return {
          map: e.measure.maps[r],
          cache: e.measure.caches[r]
        };
      for (var i = 0; i < e.rest.length; i++)
        if (E(e.rest[i]) > n) return {
          map: e.measure.maps[i],
          cache: e.measure.caches[i],
          before: !0
        }
    }

    function Xt(e, t) {
      t = de(t);
      var r = E(t),
        i = e.display.externalMeasured = new xt(e.doc, t, r);
      i.lineN = r;
      var o = i.built = ft(e, i);
      return i.text = o.pre, n(e.display.lineMeasure, o.pre), i
    }

    function $t(e, t, n, r) {
      return Qt(e, Jt(e, t), n, r)
    }

    function Yt(e, t) {
      if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[Mn(e, t)];
      var n = e.display.externalMeasured;
      return n && t >= n.lineN && t < n.lineN + n.size ? n : void 0
    }

    function Jt(e, t) {
      var n = E(t),
        r = Yt(e, n);
      r && !r.text ? r = null : r && r.changes && (Mt(e, r, n, wn(e)), e.curOp.forceUpdate = !0), r || (r = Xt(e, t));
      var i = _t(r, t, n);
      return {
        line: t,
        view: r,
        rect: null,
        map: i.map,
        cache: i.cache,
        before: i.before,
        hasHeights: !1
      }
    }

    function Qt(e, t, n, r, i) {
      t.before && (n = -1);
      var o, l = n + (r || "");
      return t.cache.hasOwnProperty(l) ? o = t.cache[l] : (t.rect || (t.rect = t.view.text.getBoundingClientRect()), t.hasHeights || (Kt(e, t.view, t.rect), t.hasHeights = !0), o = tn(e, t, n, r), o.bogus || (t.cache[l] = o)), {
        left: o.left,
        right: o.right,
        top: i ? o.rtop : o.top,
        bottom: i ? o.rbottom : o.bottom
      }
    }

    function Zt(e, t, n) {
      for (var r, i, o, l, a, s, c = 0; c < e.length; c += 3)
        if (a = e[c], s = e[c + 1], a > t ? (i = 0, o = 1, l = "left") : s > t ? (i = t - a, o = i + 1) : (c == e.length - 3 || t == s && e[c + 3] > t) && (o = s - a, i = o - 1, t >= s && (l = "right")), null != i) {
          if (r = e[c + 2], a == s && n == (r.insertLeft ? "left" : "right") && (l = n), "left" == n && 0 == i)
            for (; c && e[c - 2] == e[c - 3] && e[c - 1].insertLeft;) r = e[(c -= 3) + 2], l = "left";
          if ("right" == n && i == s - a)
            for (; c < e.length - 3 && e[c + 3] == e[c + 4] && !e[c + 5].insertLeft;) r = e[(c += 3) + 2], l = "right";
          break
        }
      return {
        node: r,
        start: i,
        end: o,
        collapse: l,
        coverStart: a,
        coverEnd: s
      }
    }

    function en(e, t) {
      var n = ma;
      if ("left" == t)
        for (var r = 0; r < e.length && (n = e[r]).left == n.right; r++);
      else
        for (var i = e.length - 1; i >= 0 && (n = e[i]).left == n.right; i--);
      return n
    }

    function tn(e, t, n, r) {
      var i, o = Zt(t.map, n, r),
        l = o.node,
        a = o.start,
        s = o.end,
        c = o.collapse;
      if (3 == l.nodeType) {
        for (var u = 0; 4 > u; u++) {
          for (; a && S(t.line.text.charAt(o.coverStart + a));) --a;
          for (; o.coverStart + s < o.coverEnd && S(t.line.text.charAt(o.coverStart + s));) ++s;
          if (i = hl && 9 > pl && 0 == a && s == o.coverEnd - o.coverStart ? l.parentNode.getBoundingClientRect() : en(Nl(l, a, s).getClientRects(), r), i.left || i.right || 0 == a) break;
          s = a, a -= 1, c = "right"
        }
        hl && 11 > pl && (i = nn(e.display.measure, i))
      } else {
        a > 0 && (c = r = "right");
        var d;
        i = e.options.lineWrapping && (d = l.getClientRects()).length > 1 ? d["right" == r ? d.length - 1 : 0] : l.getBoundingClientRect()
      }
      if (hl && 9 > pl && !a && (!i || !i.left && !i.right)) {
        var f = l.parentNode.getClientRects()[0];
        i = f ? {
          left: f.left,
          right: f.left + bn(e.display),
          top: f.top,
          bottom: f.bottom
        } : ma
      }
      for (var h = i.top - t.rect.top, p = i.bottom - t.rect.top, m = (h + p) / 2, g = t.view.measure.heights, v = 0; v < g.length - 1 && !(m < g[v]); v++);
      var y = v ? g[v - 1] : 0,
        x = g[v],
        b = {
          left: ("right" == c ? i.right : i.left) - t.rect.left,
          right: ("left" == c ? i.left : i.right) - t.rect.left,
          top: y,
          bottom: x
        };
      return i.left || i.right || (b.bogus = !0), e.options.singleCursorHeightPerLine || (b.rtop = h, b.rbottom = p), b
    }

    function nn(e, t) {
      if (!window.screen || null == screen.logicalXDPI || screen.logicalXDPI == screen.deviceXDPI || !Ue(e)) return t;
      var n = screen.logicalXDPI / screen.deviceXDPI,
        r = screen.logicalYDPI / screen.deviceYDPI;
      return {
        left: t.left * n,
        right: t.right * n,
        top: t.top * r,
        bottom: t.bottom * r
      }
    }

    function rn(e) {
      if (e.measure && (e.measure.cache = {}, e.measure.heights = null, e.rest))
        for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {}
    }

    function on(e) {
      e.display.externalMeasure = null, t(e.display.lineMeasure);
      for (var n = 0; n < e.display.view.length; n++) rn(e.display.view[n])
    }

    function ln(e) {
      on(e), e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null, e.options.lineWrapping || (e.display.maxLineChanged = !0), e.display.lineNumChars = null
    }

    function an() {
      return vl && Sl ? -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) : window.pageXOffset || (document.documentElement || document.body).scrollLeft
    }

    function sn() {
      return vl && Sl ? -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) : window.pageYOffset || (document.documentElement || document.body).scrollTop
    }

    function cn(e, t, n, r, i) {
      if (!i && t.widgets)
        for (var o = 0; o < t.widgets.length; ++o)
          if (t.widgets[o].above) {
            var l = Ft(t.widgets[o]);
            n.top += l, n.bottom += l
          }
      if ("line" == r) return n;
      r || (r = "local");
      var a = ye(t);
      if ("local" == r ? a += qt(e.display) : a -= e.display.viewOffset, "page" == r || "window" == r) {
        var s = e.display.lineSpace.getBoundingClientRect();
        a += s.top + ("window" == r ? 0 : sn());
        var c = s.left + ("window" == r ? 0 : an());
        n.left += c, n.right += c
      }
      return n.top += a, n.bottom += a, n
    }

    function un(e, t, n) {
      if ("div" == n) return t;
      var r = t.left,
        i = t.top;
      if ("page" == n) r -= an(), i -= sn();
      else if ("local" == n || !n) {
        var o = e.display.sizer.getBoundingClientRect();
        r += o.left, i += o.top
      }
      var l = e.display.lineSpace.getBoundingClientRect();
      return {
        left: r - l.left,
        top: i - l.top
      }
    }

    function dn(e, t, n, r, i) {
      return r || (r = T(e.doc, t.line)), cn(e, r, $t(e, r, t.ch, i), n)
    }

    function fn(e, t, n, r, i, o) {
      function l(t, l) {
        var a = Qt(e, i, t, l ? "right" : "left", o);
        return l ? a.left = a.right : a.right = a.left, cn(e, r, a, n)
      }

      function a(e, t, n) {
        var r = s[t],
          i = r.level % 2 != 0;
        return l(n ? e - 1 : e, i != n)
      }
      r = r || T(e.doc, t.line), i || (i = Jt(e, r));
      var s = Se(r, e.doc.direction),
        c = t.ch,
        u = t.sticky;
      if (c >= r.text.length ? (c = r.text.length, u = "before") : 0 >= c && (c = 0, u = "after"), !s) return l("before" == u ? c - 1 : c, "before" == u);
      var d = Ce(s, c, u),
        f = _l,
        h = a(c, d, "before" == u);
      return null != f && (h.other = a(c, f, "before" != u)), h
    }

    function hn(e, t) {
      var n = 0;
      t = B(e.doc, t), e.options.lineWrapping || (n = bn(e.display) * t.ch);
      var r = T(e.doc, t.line),
        i = ye(r) + qt(e.display);
      return {
        left: n,
        right: n,
        top: i,
        bottom: i + r.height
      }
    }

    function pn(e, t, n, r, i) {
      var o = P(e, t, n);
      return o.xRel = i, r && (o.outside = !0), o
    }

    function mn(e, t, n) {
      var r = e.doc;
      if (n += e.display.viewOffset, 0 > n) return pn(r.first, 0, null, !0, -1);
      var i = D(r, n),
        o = r.first + r.size - 1;
      if (i > o) return pn(r.first + r.size - 1, T(r, o).text.length, null, !0, 1);
      0 > t && (t = 0);
      for (var l = T(r, i);;) {
        var a = yn(e, l, i, t, n),
          s = ce(l),
          c = s && s.find(0, !0);
        if (!s || !(a.ch > c.from.ch || a.ch == c.from.ch && a.xRel > 0)) return a;
        i = E(l = c.to.line)
      }
    }

    function gn(e, t, n, r) {
      var i = function(r) {
          return cn(e, t, Qt(e, n, r), "line")
        },
        o = t.text.length,
        l = k(function(e) {
          return i(e - 1).bottom <= r
        }, o, 0);
      return o = k(function(e) {
        return i(e).top > r
      }, l, o), {
        begin: l,
        end: o
      }
    }

    function vn(e, t, n, r) {
      var i = cn(e, t, Qt(e, n, r), "line").top;
      return gn(e, t, n, i)
    }

    function yn(e, t, n, r, i) {
      i -= ye(t);
      var o, l = 0,
        a = t.text.length,
        s = Jt(e, t),
        c = Se(t, e.doc.direction);
      if (c) {
        if (e.options.lineWrapping) {
          var u;
          u = gn(e, t, s, i), l = u.begin, a = u.end, u
        }
        o = new P(n, Math.floor(l + (a - l) / 2));
        var d, f, h = fn(e, o, "line", t, s).left,
          p = r > h ? 1 : -1,
          m = h - r,
          g = Math.ceil((a - l) / 4);
        e: do {
          d = m, f = o;
          for (var v = 0; g > v; ++v) {
            var y = o;
            if (o = Te(e, t, o, p), null == o || o.ch < l || a <= ("before" == o.sticky ? o.ch - 1 : o.ch)) {
              o = y;
              break e
            }
          }
          if (m = fn(e, o, "line", t, s).left - r, g > 1) {
            var x = Math.abs(m - d) / g;
            g = Math.min(g, Math.ceil(Math.abs(m) / x)), p = 0 > m ? 1 : -1
          }
        } while (0 != m && (g > 1 || 0 > p != 0 > m && Math.abs(m) <= Math.abs(d)));
        if (Math.abs(m) > Math.abs(d)) {
          if (0 > m == 0 > d) throw new Error("Broke out of infinite loop in coordsCharInner");
          o = f
        }
      } else {
        var b = k(function(n) {
          var o = cn(e, t, Qt(e, s, n), "line");
          return o.top > i ? (a = Math.min(n, a), !0) : o.bottom <= i ? !1 : o.left > r ? !0 : o.right < r ? !1 : r - o.left < o.right - r
        }, l, a);
        b = L(t.text, b, 1), o = new P(n, b, b == a ? "before" : "after")
      }
      var w = fn(e, o, "line", t, s);
      return (i < w.top || w.bottom < i) && (o.outside = !0), o.xRel = r < w.left ? -1 : r > w.right ? 1 : 0, o
    }

    function xn(e) {
      if (null != e.cachedTextHeight) return e.cachedTextHeight;
      if (null == ua) {
        ua = r("pre");
        for (var i = 0; 49 > i; ++i) ua.appendChild(document.createTextNode("x")), ua.appendChild(r("br"));
        ua.appendChild(document.createTextNode("x"))
      }
      n(e.measure, ua);
      var o = ua.offsetHeight / 50;
      return o > 3 && (e.cachedTextHeight = o), t(e.measure), o || 1
    }

    function bn(e) {
      if (null != e.cachedCharWidth) return e.cachedCharWidth;
      var t = r("span", "xxxxxxxxxx"),
        i = r("pre", [t]);
      n(e.measure, i);
      var o = t.getBoundingClientRect(),
        l = (o.right - o.left) / 10;
      return l > 2 && (e.cachedCharWidth = l), l || 10
    }

    function wn(e) {
      for (var t = e.display, n = {}, r = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, l = 0; o; o = o.nextSibling, ++l) n[e.options.gutters[l]] = o.offsetLeft + o.clientLeft + i, r[e.options.gutters[l]] = o.clientWidth;
      return {
        fixedPos: Cn(t),
        gutterTotalWidth: t.gutters.offsetWidth,
        gutterLeft: n,
        gutterWidth: r,
        wrapperWidth: t.wrapper.clientWidth
      }
    }

    function Cn(e) {
      return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
    }

    function Sn(e) {
      var t = xn(e.display),
        n = e.options.lineWrapping,
        r = n && Math.max(5, e.display.scroller.clientWidth / bn(e.display) - 3);
      return function(i) {
        if (ge(e.doc, i)) return 0;
        var o = 0;
        if (i.widgets)
          for (var l = 0; l < i.widgets.length; l++) i.widgets[l].height && (o += i.widgets[l].height);
        return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t
      }
    }

    function Ln(e) {
      var t = e.doc,
        n = Sn(e);
      t.iter(function(e) {
        var t = n(e);
        t != e.height && A(e, t)
      })
    }

    function kn(e, t, n, r) {
      var i = e.display;
      if (!n && "true" == Re(t).getAttribute("cm-not-content")) return null;
      var o, l, a = i.lineSpace.getBoundingClientRect();
      try {
        o = t.clientX - a.left, l = t.clientY - a.top
      } catch (t) {
        return null
      }
      var s, c = mn(e, o, l);
      if (r && 1 == c.xRel && (s = T(e.doc, c.line).text).length == c.ch) {
        var u = d(s, s.length, e.options.tabSize) - s.length;
        c = P(c.line, Math.max(0, Math.round((o - Bt(e.display).left) / bn(e.display)) - u))
      }
      return c
    }

    function Mn(e, t) {
      if (t >= e.display.viewTo) return null;
      if (t -= e.display.viewFrom, 0 > t) return null;
      for (var n = e.display.view, r = 0; r < n.length; r++)
        if (t -= n[r].size, 0 > t) return r
    }

    function Tn(e) {
      e.display.input.showSelection(e.display.input.prepareSelection())
    }

    function On(e, t) {
      for (var n = e.doc, r = {}, i = r.cursors = document.createDocumentFragment(), o = r.selection = document.createDocumentFragment(), l = 0; l < n.sel.ranges.length; l++)
        if (t !== !1 || l != n.sel.primIndex) {
          var a = n.sel.ranges[l];
          if (!(a.from().line >= e.display.viewTo || a.to().line < e.display.viewFrom)) {
            var s = a.empty();
            (s || e.options.showCursorWhenSelecting) && Nn(e, a.head, i), s || An(e, a, o)
          }
        }
      return r
    }

    function Nn(e, t, n) {
      var i = fn(e, t, "div", null, null, !e.options.singleCursorHeightPerLine),
        o = n.appendChild(r("div", "\xa0", "CodeMirror-cursor"));
      if (o.style.left = i.left + "px", o.style.top = i.top + "px", o.style.height = Math.max(0, i.bottom - i.top) * e.options.cursorHeight + "px", i.other) {
        var l = n.appendChild(r("div", "\xa0", "CodeMirror-cursor CodeMirror-secondarycursor"));
        l.style.display = "", l.style.left = i.other.left + "px", l.style.top = i.other.top + "px", l.style.height = .85 * (i.other.bottom - i.other.top) + "px"
      }
    }

    function An(e, t, n) {
      function i(e, t, n, i) {
        0 > t && (t = 0), t = Math.round(t), i = Math.round(i), s.appendChild(r("div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px;\n                             top: " + t + "px; width: " + (null == n ? d - e : n) + "px;\n                             height: " + (i - t) + "px"))
      }

      function o(t, n, r) {
        function o(n, r) {
          return dn(e, P(t, n), "div", c, r)
        }
        var l, s, c = T(a, t),
          f = c.text.length;
        return we(Se(c, a.direction), n || 0, null == r ? f : r, function(e, t, a) {
          var c, h, p, m = o(e, "left");
          if (e == t) c = m, h = p = m.left;
          else {
            if (c = o(t - 1, "right"), "rtl" == a) {
              var g = m;
              m = c, c = g
            }
            h = m.left, p = c.right
          }
          null == n && 0 == e && (h = u), c.top - m.top > 3 && (i(h, m.top, null, m.bottom), h = u, m.bottom < c.top && i(h, m.bottom, null, c.top)), null == r && t == f && (p = d), (!l || m.top < l.top || m.top == l.top && m.left < l.left) && (l = m), (!s || c.bottom > s.bottom || c.bottom == s.bottom && c.right > s.right) && (s = c), u + 1 > h && (h = u), i(h, c.top, p - h, c.bottom)
        }), {
          start: l,
          end: s
        }
      }
      var l = e.display,
        a = e.doc,
        s = document.createDocumentFragment(),
        c = Bt(e.display),
        u = c.left,
        d = Math.max(l.sizerWidth, Gt(e) - l.sizer.offsetLeft) - c.right,
        f = t.from(),
        h = t.to();
      if (f.line == h.line) o(f.line, f.ch, h.ch);
      else {
        var p = T(a, f.line),
          m = T(a, h.line),
          g = de(p) == de(m),
          v = o(f.line, f.ch, g ? p.text.length + 1 : null).end,
          y = o(h.line, g ? 0 : null, h.ch).start;
        g && (v.top < y.top - 2 ? (i(v.right, v.top, null, v.bottom), i(u, y.top, y.left, y.bottom)) : i(v.right, v.top, y.left - v.right, v.bottom)), v.bottom < y.top && i(u, v.bottom, null, y.top)
      }
      n.appendChild(s)
    }

    function En(e) {
      if (e.state.focused) {
        var t = e.display;
        clearInterval(t.blinker);
        var n = !0;
        t.cursorDiv.style.visibility = "", e.options.cursorBlinkRate > 0 ? t.blinker = setInterval(function() {
          return t.cursorDiv.style.visibility = (n = !n) ? "" : "hidden"
        }, e.options.cursorBlinkRate) : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = "hidden")
      }
    }

    function Dn(e) {
      e.state.focused || (e.display.input.focus(), Wn(e))
    }

    function Hn(e) {
      e.state.delayingBlurEvent = !0, setTimeout(function() {
        e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1, Pn(e))
      }, 100)
    }

    function Wn(e, t) {
      e.state.delayingBlurEvent && (e.state.delayingBlurEvent = !1), "nocursor" != e.options.readOnly && (e.state.focused || (Ae(e, "focus", e, t), e.state.focused = !0, a(e.display.wrapper, "CodeMirror-focused"), e.curOp || e.display.selForContextMenu == e.doc.sel || (e.display.input.reset(), ml && setTimeout(function() {
        return e.display.input.reset(!0)
      }, 20)), e.display.input.receivedFocus()), En(e))
    }

    function Pn(e, t) {
      e.state.delayingBlurEvent || (e.state.focused && (Ae(e, "blur", e, t), e.state.focused = !1, Dl(e.display.wrapper, "CodeMirror-focused")), clearInterval(e.display.blinker), setTimeout(function() {
        e.state.focused || (e.display.shift = !1)
      }, 150))
    }

    function jn(e) {
      for (var t = e.display, n = t.lineDiv.offsetTop, r = 0; r < t.view.length; r++) {
        var i = t.view[r],
          o = void 0;
        if (!i.hidden) {
          if (hl && 8 > pl) {
            var l = i.node.offsetTop + i.node.offsetHeight;
            o = l - n, n = l
          } else {
            var a = i.node.getBoundingClientRect();
            o = a.bottom - a.top
          }
          var s = i.line.height - o;
          if (2 > o && (o = xn(t)), (s > .005 || -.005 > s) && (A(i.line, o), In(i.line), i.rest))
            for (var c = 0; c < i.rest.length; c++) In(i.rest[c])
        }
      }
    }

    function In(e) {
      if (e.widgets)
        for (var t = 0; t < e.widgets.length; ++t) e.widgets[t].height = e.widgets[t].node.parentNode.offsetHeight
    }

    function Fn(e, t, n) {
      var r = n && null != n.top ? Math.max(0, n.top) : e.scroller.scrollTop;
      r = Math.floor(r - qt(e));
      var i = n && null != n.bottom ? n.bottom : r + e.wrapper.clientHeight,
        o = D(t, r),
        l = D(t, i);
      if (n && n.ensure) {
        var a = n.ensure.from.line,
          s = n.ensure.to.line;
        o > a ? (o = a, l = D(t, ye(T(t, a)) + e.wrapper.clientHeight)) : Math.min(s, t.lastLine()) >= l && (o = D(t, ye(T(t, s)) - e.wrapper.clientHeight), l = s)
      }
      return {
        from: o,
        to: Math.max(l, o + 1)
      }
    }

    function Rn(e) {
      var t = e.display,
        n = t.view;
      if (t.alignWidgets || t.gutters.firstChild && e.options.fixedGutter) {
        for (var r = Cn(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = r + "px", l = 0; l < n.length; l++)
          if (!n[l].hidden) {
            e.options.fixedGutter && (n[l].gutter && (n[l].gutter.style.left = o), n[l].gutterBackground && (n[l].gutterBackground.style.left = o));
            var a = n[l].alignable;
            if (a)
              for (var s = 0; s < a.length; s++) a[s].style.left = o
          }
        e.options.fixedGutter && (t.gutters.style.left = r + i + "px")
      }
    }

    function qn(e) {
      if (!e.options.lineNumbers) return !1;
      var t = e.doc,
        n = W(e.options, t.first + t.size - 1),
        i = e.display;
      if (n.length != i.lineNumChars) {
        var o = i.measure.appendChild(r("div", [r("div", n)], "CodeMirror-linenumber CodeMirror-gutter-elt")),
          l = o.firstChild.offsetWidth,
          a = o.offsetWidth - l;
        return i.lineGutter.style.width = "", i.lineNumInnerWidth = Math.max(l, i.lineGutter.offsetWidth - a) + 1, i.lineNumWidth = i.lineNumInnerWidth + a, i.lineNumChars = i.lineNumInnerWidth ? n.length : -1, i.lineGutter.style.width = i.lineNumWidth + "px", Er(e), !0
      }
      return !1
    }

    function zn(e, t) {
      if (!Ee(e, "scrollCursorIntoView")) {
        var n = e.display,
          i = n.sizer.getBoundingClientRect(),
          o = null;
        if (t.top + i.top < 0 ? o = !0 : t.bottom + i.top > (window.innerHeight || document.documentElement.clientHeight) && (o = !1), null != o && !wl) {
          var l = r("div", "\u200b", null, "position: absolute;\n                         top: " + (t.top - n.viewOffset - qt(e.display)) + "px;\n                         height: " + (t.bottom - t.top + Ut(e) + n.barHeight) + "px;\n                         left: " + t.left + "px; width: " + Math.max(2, t.right - t.left) + "px;");
          e.display.lineSpace.appendChild(l), l.scrollIntoView(o), e.display.lineSpace.removeChild(l)
        }
      }
    }

    function Bn(e, t, n, r) {
      null == r && (r = 0);
      var i;
      e.options.lineWrapping || t != n || (t = t.ch ? P(t.line, "before" == t.sticky ? t.ch - 1 : t.ch, "after") : t, n = "before" == t.sticky ? P(t.line, t.ch + 1, "before") : t);
      for (var o = 0; 5 > o; o++) {
        var l = !1,
          a = fn(e, t),
          s = n && n != t ? fn(e, n) : a;
        i = {
          left: Math.min(a.left, s.left),
          top: Math.min(a.top, s.top) - r,
          right: Math.max(a.left, s.left),
          bottom: Math.max(a.bottom, s.bottom) + r
        };
        var c = Gn(e, i),
          u = e.doc.scrollTop,
          d = e.doc.scrollLeft;
        if (null != c.scrollTop && (Jn(e, c.scrollTop), Math.abs(e.doc.scrollTop - u) > 1 && (l = !0)), null != c.scrollLeft && (Zn(e, c.scrollLeft), Math.abs(e.doc.scrollLeft - d) > 1 && (l = !0)), !l) break
      }
      return i
    }

    function Un(e, t) {
      var n = Gn(e, t);
      null != n.scrollTop && Jn(e, n.scrollTop), null != n.scrollLeft && Zn(e, n.scrollLeft)
    }

    function Gn(e, t) {
      var n = e.display,
        r = xn(e.display);
      t.top < 0 && (t.top = 0);
      var i = e.curOp && null != e.curOp.scrollTop ? e.curOp.scrollTop : n.scroller.scrollTop,
        o = Vt(e),
        l = {};
      t.bottom - t.top > o && (t.bottom = t.top + o);
      var a = e.doc.height + zt(n),
        s = t.top < r,
        c = t.bottom > a - r;
      if (t.top < i) l.scrollTop = s ? 0 : t.top;
      else if (t.bottom > i + o) {
        var u = Math.min(t.top, (c ? a : t.bottom) - o);
        u != i && (l.scrollTop = u)
      }
      var d = e.curOp && null != e.curOp.scrollLeft ? e.curOp.scrollLeft : n.scroller.scrollLeft,
        f = Gt(e) - (e.options.fixedGutter ? n.gutters.offsetWidth : 0),
        h = t.right - t.left > f;
      return h && (t.right = t.left + f), t.left < 10 ? l.scrollLeft = 0 : t.left < d ? l.scrollLeft = Math.max(0, t.left - (h ? 0 : 10)) : t.right > f + d - 3 && (l.scrollLeft = t.right + (h ? 0 : 10) - f), l
    }

    function Vn(e, t) {
      null != t && ($n(e), e.curOp.scrollTop = (null == e.curOp.scrollTop ? e.doc.scrollTop : e.curOp.scrollTop) + t)
    }

    function Kn(e) {
      $n(e);
      var t = e.getCursor();
      e.curOp.scrollToPos = {
        from: t,
        to: t,
        margin: e.options.cursorScrollMargin
      }
    }

    function _n(e, t, n) {
      (null != t || null != n) && $n(e), null != t && (e.curOp.scrollLeft = t), null != n && (e.curOp.scrollTop = n)
    }

    function Xn(e, t) {
      $n(e), e.curOp.scrollToPos = t
    }

    function $n(e) {
      var t = e.curOp.scrollToPos;
      if (t) {
        e.curOp.scrollToPos = null;
        var n = hn(e, t.from),
          r = hn(e, t.to);
        Yn(e, n, r, t.margin)
      }
    }

    function Yn(e, t, n, r) {
      var i = Gn(e, {
        left: Math.min(t.left, n.left),
        top: Math.min(t.top, n.top) - r,
        right: Math.max(t.right, n.right),
        bottom: Math.max(t.bottom, n.bottom) + r
      });
      _n(e, i.scrollLeft, i.scrollTop)
    }

    function Jn(e, t) {
      Math.abs(e.doc.scrollTop - t) < 2 || (cl || Nr(e, {
        top: t
      }), Qn(e, t, !0), cl && Nr(e), Cr(e, 100))
    }

    function Qn(e, t, n) {
      t = Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t), (e.display.scroller.scrollTop != t || n) && (e.doc.scrollTop = t, e.display.scrollbars.setScrollTop(t), e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t))
    }

    function Zn(e, t, n, r) {
      t = Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth), (!(n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) || r) && (e.doc.scrollLeft = t, Rn(e), e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t), e.display.scrollbars.setScrollLeft(t))
    }

    function er(e) {
      var t = e.display,
        n = t.gutters.offsetWidth,
        r = Math.round(e.doc.height + zt(e.display));
      return {
        clientHeight: t.scroller.clientHeight,
        viewHeight: t.wrapper.clientHeight,
        scrollWidth: t.scroller.scrollWidth,
        clientWidth: t.scroller.clientWidth,
        viewWidth: t.wrapper.clientWidth,
        barLeft: e.options.fixedGutter ? n : 0,
        docHeight: r,
        scrollHeight: r + Ut(e) + t.barHeight,
        nativeBarWidth: t.nativeBarWidth,
        gutterWidth: n
      }
    }

    function tr(e, t) {
      t || (t = er(e));
      var n = e.display.barWidth,
        r = e.display.barHeight;
      nr(e, t);
      for (var i = 0; 4 > i && n != e.display.barWidth || r != e.display.barHeight; i++) n != e.display.barWidth && e.options.lineWrapping && jn(e), nr(e, er(e)), n = e.display.barWidth, r = e.display.barHeight
    }

    function nr(e, t) {
      var n = e.display,
        r = n.scrollbars.update(t);
      n.sizer.style.paddingRight = (n.barWidth = r.right) + "px", n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + "px", n.heightForcer.style.borderBottom = r.bottom + "px solid transparent", r.right && r.bottom ? (n.scrollbarFiller.style.display = "block", n.scrollbarFiller.style.height = r.bottom + "px", n.scrollbarFiller.style.width = r.right + "px") : n.scrollbarFiller.style.display = "", r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter ? (n.gutterFiller.style.display = "block", n.gutterFiller.style.height = r.bottom + "px", n.gutterFiller.style.width = t.gutterWidth + "px") : n.gutterFiller.style.display = ""
    }

    function rr(e) {
      e.display.scrollbars && (e.display.scrollbars.clear(), e.display.scrollbars.addClass && Dl(e.display.wrapper, e.display.scrollbars.addClass)), e.display.scrollbars = new ya[e.options.scrollbarStyle](function(t) {
        e.display.wrapper.insertBefore(t, e.display.scrollbarFiller), Yl(t, "mousedown", function() {
          e.state.focused && setTimeout(function() {
            return e.display.input.focus()
          }, 0)
        }), t.setAttribute("cm-not-content", "true")
      }, function(t, n) {
        "horizontal" == n ? Zn(e, t) : Jn(e, t)
      }, e), e.display.scrollbars.addClass && a(e.display.wrapper, e.display.scrollbars.addClass)
    }

    function ir(e) {
      e.curOp = {
        cm: e,
        viewChanged: !1,
        startHeight: e.doc.height,
        forceUpdate: !1,
        updateInput: null,
        typing: !1,
        changeObjs: null,
        cursorActivityHandlers: null,
        cursorActivityCalled: 0,
        selectionChanged: !1,
        updateMaxLine: !1,
        scrollLeft: null,
        scrollTop: null,
        scrollToPos: null,
        focus: !1,
        id: ++xa
      }, wt(e.curOp)
    }

    function or(e) {
      var t = e.curOp;
      St(t, function(e) {
        for (var t = 0; t < e.ops.length; t++) e.ops[t].cm.curOp = null;
        lr(e)
      })
    }

    function lr(e) {
      for (var t = e.ops, n = 0; n < t.length; n++) ar(t[n]);
      for (var r = 0; r < t.length; r++) sr(t[r]);
      for (var i = 0; i < t.length; i++) cr(t[i]);
      for (var o = 0; o < t.length; o++) ur(t[o]);
      for (var l = 0; l < t.length; l++) dr(t[l])
    }

    function ar(e) {
      var t = e.cm,
        n = t.display;
      Lr(t), e.updateMaxLine && be(t), e.mustUpdate = e.viewChanged || e.forceUpdate || null != e.scrollTop || e.scrollToPos && (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo) || n.maxLineChanged && t.options.lineWrapping, e.update = e.mustUpdate && new ba(t, e.mustUpdate && {
        top: e.scrollTop,
        ensure: e.scrollToPos
      }, e.forceUpdate)
    }

    function sr(e) {
      e.updatedDisplay = e.mustUpdate && Tr(e.cm, e.update)
    }

    function cr(e) {
      var t = e.cm,
        n = t.display;
      e.updatedDisplay && jn(t), e.barMeasure = er(t), n.maxLineChanged && !t.options.lineWrapping && (e.adjustWidthTo = $t(t, n.maxLine, n.maxLine.text.length).left + 3, t.display.sizerWidth = e.adjustWidthTo, e.barMeasure.scrollWidth = Math.max(n.scroller.clientWidth, n.sizer.offsetLeft + e.adjustWidthTo + Ut(t) + t.display.barWidth), e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - Gt(t))), (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = n.input.prepareSelection(e.focus))
    }

    function ur(e) {
      var t = e.cm;
      null != e.adjustWidthTo && (t.display.sizer.style.minWidth = e.adjustWidthTo + "px", e.maxScrollLeft < t.doc.scrollLeft && Zn(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0), t.display.maxLineChanged = !1);
      var n = e.focus && e.focus == l() && (!document.hasFocus || document.hasFocus());
      e.preparedSelection && t.display.input.showSelection(e.preparedSelection, n), (e.updatedDisplay || e.startHeight != t.doc.height) && tr(t, e.barMeasure), e.updatedDisplay && Dr(t, e.barMeasure), e.selectionChanged && En(t), t.state.focused && e.updateInput && t.display.input.reset(e.typing), n && Dn(e.cm)
    }

    function dr(e) {
      var t = e.cm,
        n = t.display,
        r = t.doc;
      if (e.updatedDisplay && Or(t, e.update), null == n.wheelStartX || null == e.scrollTop && null == e.scrollLeft && !e.scrollToPos || (n.wheelStartX = n.wheelStartY = null), null != e.scrollTop && Qn(t, e.scrollTop, e.forceScroll), null != e.scrollLeft && Zn(t, e.scrollLeft, !0, !0), e.scrollToPos) {
        var i = Bn(t, B(r, e.scrollToPos.from), B(r, e.scrollToPos.to), e.scrollToPos.margin);
        zn(t, i)
      }
      var o = e.maybeHiddenMarkers,
        l = e.maybeUnhiddenMarkers;
      if (o)
        for (var a = 0; a < o.length; ++a) o[a].lines.length || Ae(o[a], "hide");
      if (l)
        for (var s = 0; s < l.length; ++s) l[s].lines.length && Ae(l[s], "unhide");
      n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop), e.changeObjs && Ae(t, "changes", t, e.changeObjs), e.update && e.update.finish()
    }

    function fr(e, t) {
      if (e.curOp) return t();
      ir(e);
      try {
        return t()
      } finally {
        or(e)
      }
    }

    function hr(e, t) {
      return function() {
        if (e.curOp) return t.apply(e, arguments);
        ir(e);
        try {
          return t.apply(e, arguments)
        } finally {
          or(e)
        }
      }
    }

    function pr(e) {
      return function() {
        if (this.curOp) return e.apply(this, arguments);
        ir(this);
        try {
          return e.apply(this, arguments)
        } finally {
          or(this)
        }
      }
    }

    function mr(e) {
      return function() {
        var t = this.cm;
        if (!t || t.curOp) return e.apply(this, arguments);
        ir(t);
        try {
          return e.apply(this, arguments)
        } finally {
          or(t)
        }
      }
    }

    function gr(e, t, n, r) {
      null == t && (t = e.doc.first), null == n && (n = e.doc.first + e.doc.size), r || (r = 0);
      var i = e.display;
      if (r && n < i.viewTo && (null == i.updateLineNumbers || i.updateLineNumbers > t) && (i.updateLineNumbers = t), e.curOp.viewChanged = !0, t >= i.viewTo) Kl && pe(e.doc, t) < i.viewTo && yr(e);
      else if (n <= i.viewFrom) Kl && me(e.doc, n + r) > i.viewFrom ? yr(e) : (i.viewFrom += r, i.viewTo += r);
      else if (t <= i.viewFrom && n >= i.viewTo) yr(e);
      else if (t <= i.viewFrom) {
        var o = xr(e, n, n + r, 1);
        o ? (i.view = i.view.slice(o.index), i.viewFrom = o.lineN, i.viewTo += r) : yr(e)
      } else if (n >= i.viewTo) {
        var l = xr(e, t, t, -1);
        l ? (i.view = i.view.slice(0, l.index), i.viewTo = l.lineN) : yr(e)
      } else {
        var a = xr(e, t, t, -1),
          s = xr(e, n, n + r, 1);
        a && s ? (i.view = i.view.slice(0, a.index).concat(bt(e, a.lineN, s.lineN)).concat(i.view.slice(s.index)), i.viewTo += r) : yr(e)
      }
      var c = i.externalMeasured;
      c && (n < c.lineN ? c.lineN += r : t < c.lineN + c.size && (i.externalMeasured = null))
    }

    function vr(e, t, n) {
      e.curOp.viewChanged = !0;
      var r = e.display,
        i = e.display.externalMeasured;
      if (i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo)) {
        var o = r.view[Mn(e, t)];
        if (null != o.node) {
          var l = o.changes || (o.changes = []); - 1 == f(l, n) && l.push(n)
        }
      }
    }

    function yr(e) {
      e.display.viewFrom = e.display.viewTo = e.doc.first, e.display.view = [], e.display.viewOffset = 0
    }

    function xr(e, t, n, r) {
      var i, o = Mn(e, t),
        l = e.display.view;
      if (!Kl || n == e.doc.first + e.doc.size) return {
        index: o,
        lineN: n
      };
      for (var a = e.display.viewFrom, s = 0; o > s; s++) a += l[s].size;
      if (a != t) {
        if (r > 0) {
          if (o == l.length - 1) return null;
          i = a + l[o].size - t, o++
        } else i = a - t;
        t += i, n += i
      }
      for (; pe(e.doc, n) != n;) {
        if (o == (0 > r ? 0 : l.length - 1)) return null;
        n += r * l[o - (0 > r ? 1 : 0)].size, o += r
      }
      return {
        index: o,
        lineN: n
      }
    }

    function br(e, t, n) {
      var r = e.display,
        i = r.view;
      0 == i.length || t >= r.viewTo || n <= r.viewFrom ? (r.view = bt(e, t, n), r.viewFrom = t) : (r.viewFrom > t ? r.view = bt(e, t, r.viewFrom).concat(r.view) : r.viewFrom < t && (r.view = r.view.slice(Mn(e, t))), r.viewFrom = t, r.viewTo < n ? r.view = r.view.concat(bt(e, r.viewTo, n)) : r.viewTo > n && (r.view = r.view.slice(0, Mn(e, n)))), r.viewTo = n
    }

    function wr(e) {
      for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
        var i = t[r];
        i.hidden || i.node && !i.changes || ++n
      }
      return n
    }

    function Cr(e, t) {
      e.doc.highlightFrontier < e.display.viewTo && e.state.highlight.set(t, c(Sr, e))
    }

    function Sr(e) {
      var t = e.doc;
      if (!(t.highlightFrontier >= e.display.viewTo)) {
        var n = +new Date + e.options.workTime,
          r = et(e, t.highlightFrontier),
          i = [];
        t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function(o) {
          if (r.line >= e.display.viewFrom) {
            var l = o.styles,
              a = o.text.length > e.options.maxHighlightLength ? $e(t.mode, r.state) : null,
              s = Qe(e, o, r, !0);
            a && (r.state = a), o.styles = s.styles;
            var c = o.styleClasses,
              u = s.classes;
            u ? o.styleClasses = u : c && (o.styleClasses = null);
            for (var d = !l || l.length != o.styles.length || c != u && (!c || !u || c.bgClass != u.bgClass || c.textClass != u.textClass), f = 0; !d && f < l.length; ++f) d = l[f] != o.styles[f];
            d && i.push(r.line), o.stateAfter = r.save(), r.nextLine()
          } else o.text.length <= e.options.maxHighlightLength && tt(e, o.text, r), o.stateAfter = r.line % 5 == 0 ? r.save() : null, r.nextLine();
          return +new Date > n ? (Cr(e, e.options.workDelay), !0) : void 0
        }), t.highlightFrontier = r.line, t.modeFrontier = Math.max(t.modeFrontier, r.line), i.length && fr(e, function() {
          for (var t = 0; t < i.length; t++) vr(e, i[t], "text")
        })
      }
    }

    function Lr(e) {
      var t = e.display;
      !t.scrollbarsClipped && t.scroller.offsetWidth && (t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth, t.heightForcer.style.height = Ut(e) + "px", t.sizer.style.marginBottom = -t.nativeBarWidth + "px", t.sizer.style.borderRightWidth = Ut(e) + "px", t.scrollbarsClipped = !0)
    }

    function kr(e) {
      if (e.hasFocus()) return null;
      var t = l();
      if (!t || !o(e.display.lineDiv, t)) return null;
      var n = {
        activeElt: t
      };
      if (window.getSelection) {
        var r = window.getSelection();
        r.anchorNode && r.extend && o(e.display.lineDiv, r.anchorNode) && (n.anchorNode = r.anchorNode, n.anchorOffset = r.anchorOffset,
          n.focusNode = r.focusNode, n.focusOffset = r.focusOffset)
      }
      return n
    }

    function Mr(e) {
      if (e && e.activeElt && e.activeElt != l() && (e.activeElt.focus(), e.anchorNode && o(document.body, e.anchorNode) && o(document.body, e.focusNode))) {
        var t = window.getSelection(),
          n = document.createRange();
        n.setEnd(e.anchorNode, e.anchorOffset), n.collapse(!1), t.removeAllRanges(), t.addRange(n), t.extend(e.focusNode, e.focusOffset)
      }
    }

    function Tr(e, n) {
      var r = e.display,
        i = e.doc;
      if (n.editorIsHidden) return yr(e), !1;
      if (!n.force && n.visible.from >= r.viewFrom && n.visible.to <= r.viewTo && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo) && r.renderedView == r.view && 0 == wr(e)) return !1;
      qn(e) && (yr(e), n.dims = wn(e));
      var o = i.first + i.size,
        l = Math.max(n.visible.from - e.options.viewportMargin, i.first),
        a = Math.min(o, n.visible.to + e.options.viewportMargin);
      r.viewFrom < l && l - r.viewFrom < 20 && (l = Math.max(i.first, r.viewFrom)), r.viewTo > a && r.viewTo - a < 20 && (a = Math.min(o, r.viewTo)), Kl && (l = pe(e.doc, l), a = me(e.doc, a));
      var s = l != r.viewFrom || a != r.viewTo || r.lastWrapHeight != n.wrapperHeight || r.lastWrapWidth != n.wrapperWidth;
      br(e, l, a), r.viewOffset = ye(T(e.doc, r.viewFrom)), e.display.mover.style.top = r.viewOffset + "px";
      var c = wr(e);
      if (!s && 0 == c && !n.force && r.renderedView == r.view && (null == r.updateLineNumbers || r.updateLineNumbers >= r.viewTo)) return !1;
      var u = kr(e);
      return c > 4 && (r.lineDiv.style.display = "none"), Ar(e, r.updateLineNumbers, n.dims), c > 4 && (r.lineDiv.style.display = ""), r.renderedView = r.view, Mr(u), t(r.cursorDiv), t(r.selectionDiv), r.gutters.style.height = r.sizer.style.minHeight = 0, s && (r.lastWrapHeight = n.wrapperHeight, r.lastWrapWidth = n.wrapperWidth, Cr(e, 400)), r.updateLineNumbers = null, !0
    }

    function Or(e, t) {
      for (var n = t.viewport, r = !0;
        (r && e.options.lineWrapping && t.oldDisplayWidth != Gt(e) || (n && null != n.top && (n = {
          top: Math.min(e.doc.height + zt(e.display) - Vt(e), n.top)
        }), t.visible = Fn(e.display, e.doc, n), !(t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo))) && Tr(e, t); r = !1) {
        jn(e);
        var i = er(e);
        Tn(e), tr(e, i), Dr(e, i), t.force = !1
      }
      t.signal(e, "update", e), (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) && (t.signal(e, "viewportChange", e, e.display.viewFrom, e.display.viewTo), e.display.reportedViewFrom = e.display.viewFrom, e.display.reportedViewTo = e.display.viewTo)
    }

    function Nr(e, t) {
      var n = new ba(e, t);
      if (Tr(e, n)) {
        jn(e), Or(e, n);
        var r = er(e);
        Tn(e), tr(e, r), Dr(e, r), n.finish()
      }
    }

    function Ar(e, n, r) {
      function i(t) {
        var n = t.nextSibling;
        return ml && kl && e.display.currentWheelTarget == t ? t.style.display = "none" : t.parentNode.removeChild(t), n
      }
      for (var o = e.display, l = e.options.lineNumbers, a = o.lineDiv, s = a.firstChild, c = o.view, u = o.viewFrom, d = 0; d < c.length; d++) {
        var h = c[d];
        if (h.hidden);
        else if (h.node && h.node.parentNode == a) {
          for (; s != h.node;) s = i(s);
          var p = l && null != n && u >= n && h.lineNumber;
          h.changes && (f(h.changes, "gutter") > -1 && (p = !1), Mt(e, h, u, r)), p && (t(h.lineNumber), h.lineNumber.appendChild(document.createTextNode(W(e.options, u)))), s = h.node.nextSibling
        } else {
          var m = Wt(e, h, u, r);
          a.insertBefore(m, s)
        }
        u += h.size
      }
      for (; s;) s = i(s)
    }

    function Er(e) {
      var t = e.display.gutters.offsetWidth;
      e.display.sizer.style.marginLeft = t + "px"
    }

    function Dr(e, t) {
      e.display.sizer.style.minHeight = t.docHeight + "px", e.display.heightForcer.style.top = t.docHeight + "px", e.display.gutters.style.height = t.docHeight + e.display.barHeight + Ut(e) + "px"
    }

    function Hr(e) {
      var n = e.display.gutters,
        i = e.options.gutters;
      t(n);
      for (var o = 0; o < i.length; ++o) {
        var l = i[o],
          a = n.appendChild(r("div", null, "CodeMirror-gutter " + l));
        "CodeMirror-linenumbers" == l && (e.display.lineGutter = a, a.style.width = (e.display.lineNumWidth || 1) + "px")
      }
      n.style.display = o ? "" : "none", Er(e)
    }

    function Wr(e) {
      var t = f(e.gutters, "CodeMirror-linenumbers"); - 1 == t && e.lineNumbers ? e.gutters = e.gutters.concat(["CodeMirror-linenumbers"]) : t > -1 && !e.lineNumbers && (e.gutters = e.gutters.slice(0), e.gutters.splice(t, 1))
    }

    function Pr(e) {
      var t = e.wheelDeltaX,
        n = e.wheelDeltaY;
      return null == t && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail), null == n && e.detail && e.axis == e.VERTICAL_AXIS ? n = e.detail : null == n && (n = e.wheelDelta), {
        x: t,
        y: n
      }
    }

    function jr(e) {
      var t = Pr(e);
      return t.x *= Ca, t.y *= Ca, t
    }

    function Ir(e, t) {
      var n = Pr(t),
        r = n.x,
        i = n.y,
        o = e.display,
        l = o.scroller,
        a = l.scrollWidth > l.clientWidth,
        s = l.scrollHeight > l.clientHeight;
      if (r && a || i && s) {
        if (i && kl && ml) e: for (var c = t.target, u = o.view; c != l; c = c.parentNode)
          for (var d = 0; d < u.length; d++)
            if (u[d].node == c) {
              e.display.currentWheelTarget = c;
              break e
            }
        if (r && !cl && !yl && null != Ca) return i && s && Jn(e, Math.max(0, l.scrollTop + i * Ca)), Zn(e, Math.max(0, l.scrollLeft + r * Ca)), (!i || i && s) && Pe(t), void(o.wheelStartX = null);
        if (i && null != Ca) {
          var f = i * Ca,
            h = e.doc.scrollTop,
            p = h + o.wrapper.clientHeight;
          0 > f ? h = Math.max(0, h + f - 50) : p = Math.min(e.doc.height, p + f + 50), Nr(e, {
            top: h,
            bottom: p
          })
        }
        20 > wa && (null == o.wheelStartX ? (o.wheelStartX = l.scrollLeft, o.wheelStartY = l.scrollTop, o.wheelDX = r, o.wheelDY = i, setTimeout(function() {
          if (null != o.wheelStartX) {
            var e = l.scrollLeft - o.wheelStartX,
              t = l.scrollTop - o.wheelStartY,
              n = t && o.wheelDY && t / o.wheelDY || e && o.wheelDX && e / o.wheelDX;
            o.wheelStartX = o.wheelStartY = null, n && (Ca = (Ca * wa + n) / (wa + 1), ++wa)
          }
        }, 200)) : (o.wheelDX += r, o.wheelDY += i))
      }
    }

    function Fr(e, t) {
      var n = e[t];
      e.sort(function(e, t) {
        return j(e.from(), t.from())
      }), t = f(e, n);
      for (var r = 1; r < e.length; r++) {
        var i = e[r],
          o = e[r - 1];
        if (j(o.to(), i.from()) >= 0) {
          var l = q(o.from(), i.from()),
            a = R(o.to(), i.to()),
            s = o.empty() ? i.from() == i.head : o.from() == o.head;
          t >= r && --t, e.splice(--r, 2, new La(s ? a : l, s ? l : a))
        }
      }
      return new Sa(e, t)
    }

    function Rr(e, t) {
      return new Sa([new La(e, t || e)], 0)
    }

    function qr(e) {
      return e.text ? P(e.from.line + e.text.length - 1, m(e.text).length + (1 == e.text.length ? e.from.ch : 0)) : e.to
    }

    function zr(e, t) {
      if (j(e, t.from) < 0) return e;
      if (j(e, t.to) <= 0) return qr(t);
      var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
        r = e.ch;
      return e.line == t.to.line && (r += qr(t).ch - t.to.ch), P(n, r)
    }

    function Br(e, t) {
      for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
        var i = e.sel.ranges[r];
        n.push(new La(zr(i.anchor, t), zr(i.head, t)))
      }
      return Fr(n, e.sel.primIndex)
    }

    function Ur(e, t, n) {
      return e.line == t.line ? P(n.line, e.ch - t.ch + n.ch) : P(n.line + (e.line - t.line), e.ch)
    }

    function Gr(e, t, n) {
      for (var r = [], i = P(e.first, 0), o = i, l = 0; l < t.length; l++) {
        var a = t[l],
          s = Ur(a.from, i, o),
          c = Ur(qr(a), i, o);
        if (i = a.to, o = c, "around" == n) {
          var u = e.sel.ranges[l],
            d = j(u.head, u.anchor) < 0;
          r[l] = new La(d ? c : s, d ? s : c)
        } else r[l] = new La(s, s)
      }
      return new Sa(r, e.sel.primIndex)
    }

    function Vr(e) {
      e.doc.mode = _e(e.options, e.doc.modeOption), Kr(e)
    }

    function Kr(e) {
      e.doc.iter(function(e) {
        e.stateAfter && (e.stateAfter = null), e.styles && (e.styles = null)
      }), e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first, Cr(e, 100), e.state.modeGen++, e.curOp && gr(e)
    }

    function _r(e, t) {
      return 0 == t.from.ch && 0 == t.to.ch && "" == m(t.text) && (!e.cm || e.cm.options.wholeLineUpdateBefore)
    }

    function Xr(e, t, n, r) {
      function i(e) {
        return n ? n[e] : null
      }

      function o(e, n, i) {
        ct(e, n, i, r), Lt(e, "change", e, t)
      }

      function l(e, t) {
        for (var n = [], o = e; t > o; ++o) n.push(new ca(c[o], i(o), r));
        return n
      }
      var a = t.from,
        s = t.to,
        c = t.text,
        u = T(e, a.line),
        d = T(e, s.line),
        f = m(c),
        h = i(c.length - 1),
        p = s.line - a.line;
      if (t.full) e.insert(0, l(0, c.length)), e.remove(c.length, e.size - c.length);
      else if (_r(e, t)) {
        var g = l(0, c.length - 1);
        o(d, d.text, h), p && e.remove(a.line, p), g.length && e.insert(a.line, g)
      } else if (u == d)
        if (1 == c.length) o(u, u.text.slice(0, a.ch) + f + u.text.slice(s.ch), h);
        else {
          var v = l(1, c.length - 1);
          v.push(new ca(f + u.text.slice(s.ch), h, r)), o(u, u.text.slice(0, a.ch) + c[0], i(0)), e.insert(a.line + 1, v)
        }
      else if (1 == c.length) o(u, u.text.slice(0, a.ch) + c[0] + d.text.slice(s.ch), i(0)), e.remove(a.line + 1, p);
      else {
        o(u, u.text.slice(0, a.ch) + c[0], i(0)), o(d, f + d.text.slice(s.ch), h);
        var y = l(1, c.length - 1);
        p > 1 && e.remove(a.line + 1, p - 1), e.insert(a.line + 1, y)
      }
      Lt(e, "change", e, t)
    }

    function $r(e, t, n) {
      function r(e, i, o) {
        if (e.linked)
          for (var l = 0; l < e.linked.length; ++l) {
            var a = e.linked[l];
            if (a.doc != i) {
              var s = o && a.sharedHist;
              (!n || s) && (t(a.doc, s), r(a.doc, e, s))
            }
          }
      }
      r(e, null, !0)
    }

    function Yr(e, t) {
      if (t.cm) throw new Error("This document is already in use.");
      e.doc = t, t.cm = e, Ln(e), Vr(e), Jr(e), e.options.lineWrapping || be(e), e.options.mode = t.modeOption, gr(e)
    }

    function Jr(e) {
      ("rtl" == e.doc.direction ? a : Dl)(e.display.lineDiv, "CodeMirror-rtl")
    }

    function Qr(e) {
      fr(e, function() {
        Jr(e), gr(e)
      })
    }

    function Zr(e) {
      this.done = [], this.undone = [], this.undoDepth = 1 / 0, this.lastModTime = this.lastSelTime = 0, this.lastOp = this.lastSelOp = null, this.lastOrigin = this.lastSelOrigin = null, this.generation = this.maxGeneration = e || 1
    }

    function ei(e, t) {
      var n = {
        from: F(t.from),
        to: qr(t),
        text: O(e, t.from, t.to)
      };
      return ai(e, n, t.from.line, t.to.line + 1), $r(e, function(e) {
        return ai(e, n, t.from.line, t.to.line + 1)
      }, !0), n
    }

    function ti(e) {
      for (; e.length;) {
        var t = m(e);
        if (!t.ranges) break;
        e.pop()
      }
    }

    function ni(e, t) {
      return t ? (ti(e.done), m(e.done)) : e.done.length && !m(e.done).ranges ? m(e.done) : e.done.length > 1 && !e.done[e.done.length - 2].ranges ? (e.done.pop(), m(e.done)) : void 0
    }

    function ri(e, t, n, r) {
      var i = e.history;
      i.undone.length = 0;
      var o, l, a = +new Date;
      if ((i.lastOp == r || i.lastOrigin == t.origin && t.origin && ("+" == t.origin.charAt(0) && e.cm && i.lastModTime > a - e.cm.options.historyEventDelay || "*" == t.origin.charAt(0))) && (o = ni(i, i.lastOp == r))) l = m(o.changes), 0 == j(t.from, t.to) && 0 == j(t.from, l.to) ? l.to = qr(t) : o.changes.push(ei(e, t));
      else {
        var s = m(i.done);
        for (s && s.ranges || li(e.sel, i.done), o = {
            changes: [ei(e, t)],
            generation: i.generation
          }, i.done.push(o); i.done.length > i.undoDepth;) i.done.shift(), i.done[0].ranges || i.done.shift()
      }
      i.done.push(n), i.generation = ++i.maxGeneration, i.lastModTime = i.lastSelTime = a, i.lastOp = i.lastSelOp = r, i.lastOrigin = i.lastSelOrigin = t.origin, l || Ae(e, "historyAdded")
    }

    function ii(e, t, n, r) {
      var i = t.charAt(0);
      return "*" == i || "+" == i && n.ranges.length == r.ranges.length && n.somethingSelected() == r.somethingSelected() && new Date - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500)
    }

    function oi(e, t, n, r) {
      var i = e.history,
        o = r && r.origin;
      n == i.lastSelOp || o && i.lastSelOrigin == o && (i.lastModTime == i.lastSelTime && i.lastOrigin == o || ii(e, o, m(i.done), t)) ? i.done[i.done.length - 1] = t : li(t, i.done), i.lastSelTime = +new Date, i.lastSelOrigin = o, i.lastSelOp = n, r && r.clearRedo !== !1 && ti(i.undone)
    }

    function li(e, t) {
      var n = m(t);
      n && n.ranges && n.equals(e) || t.push(e)
    }

    function ai(e, t, n, r) {
      var i = t["spans_" + e.id],
        o = 0;
      e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function(n) {
        n.markedSpans && ((i || (i = t["spans_" + e.id] = {}))[o] = n.markedSpans), ++o
      })
    }

    function si(e) {
      if (!e) return null;
      for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n]);
      return t ? t.length ? t : null : e
    }

    function ci(e, t) {
      var n = t["spans_" + e.id];
      if (!n) return null;
      for (var r = [], i = 0; i < t.text.length; ++i) r.push(si(n[i]));
      return r
    }

    function ui(e, t) {
      var n = ci(e, t),
        r = Z(e, t);
      if (!n) return r;
      if (!r) return n;
      for (var i = 0; i < n.length; ++i) {
        var o = n[i],
          l = r[i];
        if (o && l) e: for (var a = 0; a < l.length; ++a) {
          for (var s = l[a], c = 0; c < o.length; ++c)
            if (o[c].marker == s.marker) continue e;
          o.push(s)
        } else l && (n[i] = l)
      }
      return n
    }

    function di(e, t, n) {
      for (var r = [], i = 0; i < e.length; ++i) {
        var o = e[i];
        if (o.ranges) r.push(n ? Sa.prototype.deepCopy.call(o) : o);
        else {
          var l = o.changes,
            a = [];
          r.push({
            changes: a
          });
          for (var s = 0; s < l.length; ++s) {
            var c = l[s],
              u = void 0;
            if (a.push({
                from: c.from,
                to: c.to,
                text: c.text
              }), t)
              for (var d in c)(u = d.match(/^spans_(\d+)$/)) && f(t, Number(u[1])) > -1 && (m(a)[d] = c[d], delete c[d])
          }
        }
      }
      return r
    }

    function fi(e, t, n, r) {
      if (r) {
        var i = e.anchor;
        if (n) {
          var o = j(t, i) < 0;
          o != j(n, i) < 0 ? (i = t, t = n) : o != j(t, n) < 0 && (t = n)
        }
        return new La(i, t)
      }
      return new La(n || t, t)
    }

    function hi(e, t, n, r, i) {
      null == i && (i = e.cm && (e.cm.display.shift || e.extend)), xi(e, new Sa([fi(e.sel.primary(), t, n, i)], 0), r)
    }

    function pi(e, t, n) {
      for (var r = [], i = e.cm && (e.cm.display.shift || e.extend), o = 0; o < e.sel.ranges.length; o++) r[o] = fi(e.sel.ranges[o], t[o], null, i);
      var l = Fr(r, e.sel.primIndex);
      xi(e, l, n)
    }

    function mi(e, t, n, r) {
      var i = e.sel.ranges.slice(0);
      i[t] = n, xi(e, Fr(i, e.sel.primIndex), r)
    }

    function gi(e, t, n, r) {
      xi(e, Rr(t, n), r)
    }

    function vi(e, t, n) {
      var r = {
        ranges: t.ranges,
        update: function(t) {
          var n = this;
          this.ranges = [];
          for (var r = 0; r < t.length; r++) n.ranges[r] = new La(B(e, t[r].anchor), B(e, t[r].head))
        },
        origin: n && n.origin
      };
      return Ae(e, "beforeSelectionChange", e, r), e.cm && Ae(e.cm, "beforeSelectionChange", e.cm, r), r.ranges != t.ranges ? Fr(r.ranges, r.ranges.length - 1) : t
    }

    function yi(e, t, n) {
      var r = e.history.done,
        i = m(r);
      i && i.ranges ? (r[r.length - 1] = t, bi(e, t, n)) : xi(e, t, n)
    }

    function xi(e, t, n) {
      bi(e, t, n), oi(e, e.sel, e.cm ? e.cm.curOp.id : NaN, n)
    }

    function bi(e, t, n) {
      (He(e, "beforeSelectionChange") || e.cm && He(e.cm, "beforeSelectionChange")) && (t = vi(e, t, n));
      var r = n && n.bias || (j(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1);
      wi(e, Si(e, t, r, !0)), n && n.scroll === !1 || !e.cm || Kn(e.cm)
    }

    function wi(e, t) {
      t.equals(e.sel) || (e.sel = t, e.cm && (e.cm.curOp.updateInput = e.cm.curOp.selectionChanged = !0, De(e.cm)), Lt(e, "cursorActivity", e))
    }

    function Ci(e) {
      wi(e, Si(e, e.sel, null, !1))
    }

    function Si(e, t, n, r) {
      for (var i, o = 0; o < t.ranges.length; o++) {
        var l = t.ranges[o],
          a = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o],
          s = ki(e, l.anchor, a && a.anchor, n, r),
          c = ki(e, l.head, a && a.head, n, r);
        (i || s != l.anchor || c != l.head) && (i || (i = t.ranges.slice(0, o)), i[o] = new La(s, c))
      }
      return i ? Fr(i, t.primIndex) : t
    }

    function Li(e, t, n, r, i) {
      var o = T(e, t.line);
      if (o.markedSpans)
        for (var l = 0; l < o.markedSpans.length; ++l) {
          var a = o.markedSpans[l],
            s = a.marker;
          if ((null == a.from || (s.inclusiveLeft ? a.from <= t.ch : a.from < t.ch)) && (null == a.to || (s.inclusiveRight ? a.to >= t.ch : a.to > t.ch))) {
            if (i && (Ae(s, "beforeCursorEnter"), s.explicitlyCleared)) {
              if (o.markedSpans) {
                --l;
                continue
              }
              break
            }
            if (!s.atomic) continue;
            if (n) {
              var c = s.find(0 > r ? 1 : -1),
                u = void 0;
              if ((0 > r ? s.inclusiveRight : s.inclusiveLeft) && (c = Mi(e, c, -r, c && c.line == t.line ? o : null)), c && c.line == t.line && (u = j(c, n)) && (0 > r ? 0 > u : u > 0)) return Li(e, c, t, r, i)
            }
            var d = s.find(0 > r ? -1 : 1);
            return (0 > r ? s.inclusiveLeft : s.inclusiveRight) && (d = Mi(e, d, r, d.line == t.line ? o : null)), d ? Li(e, d, t, r, i) : null
          }
        }
      return t
    }

    function ki(e, t, n, r, i) {
      var o = r || 1,
        l = Li(e, t, n, o, i) || !i && Li(e, t, n, o, !0) || Li(e, t, n, -o, i) || !i && Li(e, t, n, -o, !0);
      return l ? l : (e.cantEdit = !0, P(e.first, 0))
    }

    function Mi(e, t, n, r) {
      return 0 > n && 0 == t.ch ? t.line > e.first ? B(e, P(t.line - 1)) : null : n > 0 && t.ch == (r || T(e, t.line)).text.length ? t.line < e.first + e.size - 1 ? P(t.line + 1, 0) : null : new P(t.line, t.ch + n)
    }

    function Ti(e) {
      e.setSelection(P(e.firstLine(), 0), P(e.lastLine()), Rl)
    }

    function Oi(e, t, n) {
      var r = {
        canceled: !1,
        from: t.from,
        to: t.to,
        text: t.text,
        origin: t.origin,
        cancel: function() {
          return r.canceled = !0
        }
      };
      return n && (r.update = function(t, n, i, o) {
        t && (r.from = B(e, t)), n && (r.to = B(e, n)), i && (r.text = i), void 0 !== o && (r.origin = o)
      }), Ae(e, "beforeChange", e, r), e.cm && Ae(e.cm, "beforeChange", e.cm, r), r.canceled ? null : {
        from: r.from,
        to: r.to,
        text: r.text,
        origin: r.origin
      }
    }

    function Ni(e, t, n) {
      if (e.cm) {
        if (!e.cm.curOp) return hr(e.cm, Ni)(e, t, n);
        if (e.cm.state.suppressEdits) return
      }
      if (!(He(e, "beforeChange") || e.cm && He(e.cm, "beforeChange")) || (t = Oi(e, t, !0))) {
        var r = Vl && !n && te(e, t.from, t.to);
        if (r)
          for (var i = r.length - 1; i >= 0; --i) Ai(e, {
            from: r[i].from,
            to: r[i].to,
            text: i ? [""] : t.text
          });
        else Ai(e, t)
      }
    }

    function Ai(e, t) {
      if (1 != t.text.length || "" != t.text[0] || 0 != j(t.from, t.to)) {
        var n = Br(e, t);
        ri(e, t, n, e.cm ? e.cm.curOp.id : NaN), Hi(e, t, n, Z(e, t));
        var r = [];
        $r(e, function(e, n) {
          n || -1 != f(r, e.history) || (Fi(e.history, t), r.push(e.history)), Hi(e, t, null, Z(e, t))
        })
      }
    }

    function Ei(e, t, n) {
      if (!e.cm || !e.cm.state.suppressEdits || n) {
        for (var r, i = e.history, o = e.sel, l = "undo" == t ? i.done : i.undone, a = "undo" == t ? i.undone : i.done, s = 0; s < l.length && (r = l[s], n ? !r.ranges || r.equals(e.sel) : r.ranges); s++);
        if (s != l.length) {
          for (i.lastOrigin = i.lastSelOrigin = null; r = l.pop(), r.ranges;) {
            if (li(r, a), n && !r.equals(e.sel)) return void xi(e, r, {
              clearRedo: !1
            });
            o = r
          }
          var c = [];
          li(o, a), a.push({
            changes: c,
            generation: i.generation
          }), i.generation = r.generation || ++i.maxGeneration;
          for (var u = He(e, "beforeChange") || e.cm && He(e.cm, "beforeChange"), d = function(n) {
              var i = r.changes[n];
              if (i.origin = t, u && !Oi(e, i, !1)) return l.length = 0, {};
              c.push(ei(e, i));
              var o = n ? Br(e, i) : m(l);
              Hi(e, i, o, ui(e, i)), !n && e.cm && e.cm.scrollIntoView({
                from: i.from,
                to: qr(i)
              });
              var a = [];
              $r(e, function(e, t) {
                t || -1 != f(a, e.history) || (Fi(e.history, i), a.push(e.history)), Hi(e, i, null, ui(e, i))
              })
            }, h = r.changes.length - 1; h >= 0; --h) {
            var p = d(h);
            if (p) return p.v
          }
        }
      }
    }

    function Di(e, t) {
      if (0 != t && (e.first += t, e.sel = new Sa(g(e.sel.ranges, function(e) {
          return new La(P(e.anchor.line + t, e.anchor.ch), P(e.head.line + t, e.head.ch))
        }), e.sel.primIndex), e.cm)) {
        gr(e.cm, e.first, e.first - t, t);
        for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) vr(e.cm, r, "gutter")
      }
    }

    function Hi(e, t, n, r) {
      if (e.cm && !e.cm.curOp) return hr(e.cm, Hi)(e, t, n, r);
      if (t.to.line < e.first) return void Di(e, t.text.length - 1 - (t.to.line - t.from.line));
      if (!(t.from.line > e.lastLine())) {
        if (t.from.line < e.first) {
          var i = t.text.length - 1 - (e.first - t.from.line);
          Di(e, i), t = {
            from: P(e.first, 0),
            to: P(t.to.line + i, t.to.ch),
            text: [m(t.text)],
            origin: t.origin
          }
        }
        var o = e.lastLine();
        t.to.line > o && (t = {
          from: t.from,
          to: P(o, T(e, o).text.length),
          text: [t.text[0]],
          origin: t.origin
        }), t.removed = O(e, t.from, t.to), n || (n = Br(e, t)), e.cm ? Wi(e.cm, t, r) : Xr(e, t, r), bi(e, n, Rl)
      }
    }

    function Wi(e, t, n) {
      var r = e.doc,
        i = e.display,
        o = t.from,
        l = t.to,
        a = !1,
        s = o.line;
      e.options.lineWrapping || (s = E(de(T(r, o.line))), r.iter(s, l.line + 1, function(e) {
        return e == i.maxLine ? (a = !0, !0) : void 0
      })), r.sel.contains(t.from, t.to) > -1 && De(e), Xr(r, t, n, Sn(e)), e.options.lineWrapping || (r.iter(s, o.line + t.text.length, function(e) {
        var t = xe(e);
        t > i.maxLineLength && (i.maxLine = e, i.maxLineLength = t, i.maxLineChanged = !0, a = !1)
      }), a && (e.curOp.updateMaxLine = !0)), st(r, o.line), Cr(e, 400);
      var c = t.text.length - (l.line - o.line) - 1;
      t.full ? gr(e) : o.line != l.line || 1 != t.text.length || _r(e.doc, t) ? gr(e, o.line, l.line + 1, c) : vr(e, o.line, "text");
      var u = He(e, "changes"),
        d = He(e, "change");
      if (d || u) {
        var f = {
          from: o,
          to: l,
          text: t.text,
          removed: t.removed,
          origin: t.origin
        };
        d && Lt(e, "change", e, f), u && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(f)
      }
      e.display.selForContextMenu = null
    }

    function Pi(e, t, n, r, i) {
      if (r || (r = n), j(r, n) < 0) {
        var o = r;
        r = n, n = o
      }
      "string" == typeof t && (t = e.splitLines(t)), Ni(e, {
        from: n,
        to: r,
        text: t,
        origin: i
      })
    }

    function ji(e, t, n, r) {
      n < e.line ? e.line += r : t < e.line && (e.line = t, e.ch = 0)
    }

    function Ii(e, t, n, r) {
      for (var i = 0; i < e.length; ++i) {
        var o = e[i],
          l = !0;
        if (o.ranges) {
          o.copied || (o = e[i] = o.deepCopy(), o.copied = !0);
          for (var a = 0; a < o.ranges.length; a++) ji(o.ranges[a].anchor, t, n, r), ji(o.ranges[a].head, t, n, r)
        } else {
          for (var s = 0; s < o.changes.length; ++s) {
            var c = o.changes[s];
            if (n < c.from.line) c.from = P(c.from.line + r, c.from.ch), c.to = P(c.to.line + r, c.to.ch);
            else if (t <= c.to.line) {
              l = !1;
              break
            }
          }
          l || (e.splice(0, i + 1), i = 0)
        }
      }
    }

    function Fi(e, t) {
      var n = t.from.line,
        r = t.to.line,
        i = t.text.length - (r - n) - 1;
      Ii(e.done, n, r, i), Ii(e.undone, n, r, i)
    }

    function Ri(e, t, n, r) {
      var i = t,
        o = t;
      return "number" == typeof t ? o = T(e, z(e, t)) : i = E(t), null == i ? null : (r(o, i) && e.cm && vr(e.cm, i, n), o)
    }

    function qi(e) {
      var t = this;
      this.lines = e, this.parent = null;
      for (var n = 0, r = 0; r < e.length; ++r) e[r].parent = t, n += e[r].height;
      this.height = n
    }

    function zi(e) {
      var t = this;
      this.children = e;
      for (var n = 0, r = 0, i = 0; i < e.length; ++i) {
        var o = e[i];
        n += o.chunkSize(), r += o.height, o.parent = t
      }
      this.size = n, this.height = r, this.parent = null
    }

    function Bi(e, t, n) {
      ye(t) < (e.curOp && e.curOp.scrollTop || e.doc.scrollTop) && Vn(e, n)
    }

    function Ui(e, t, n, r) {
      var i = new ka(e, n, r),
        o = e.cm;
      return o && i.noHScroll && (o.display.alignWidgets = !0), Ri(e, t, "widget", function(t) {
        var n = t.widgets || (t.widgets = []);
        if (null == i.insertAt ? n.push(i) : n.splice(Math.min(n.length - 1, Math.max(0, i.insertAt)), 0, i), i.line = t, o && !ge(e, t)) {
          var r = ye(t) < e.scrollTop;
          A(t, t.height + Ft(i)), r && Vn(o, i.height), o.curOp.forceUpdate = !0
        }
        return !0
      }), Lt(o, "lineWidgetAdded", o, i, "number" == typeof t ? t : E(t)), i
    }

    function Gi(e, t, n, r, o) {
      if (r && r.shared) return Vi(e, t, n, r, o);
      if (e.cm && !e.cm.curOp) return hr(e.cm, Gi)(e, t, n, r, o);
      var l = new Ta(e, o),
        a = j(t, n);
      if (r && u(r, l, !1), a > 0 || 0 == a && l.clearWhenEmpty !== !1) return l;
      if (l.replacedWith && (l.collapsed = !0, l.widgetNode = i("span", [l.replacedWith], "CodeMirror-widget"), r.handleMouseEvents || l.widgetNode.setAttribute("cm-ignore-events", "true"), r.insertLeft && (l.widgetNode.insertLeft = !0)), l.collapsed) {
        if (ue(e, t.line, t, n, l) || t.line != n.line && ue(e, n.line, t, n, l)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
        K()
      }
      l.addToHistory && ri(e, {
        from: t,
        to: n,
        origin: "markText"
      }, e.sel, NaN);
      var s, c = t.line,
        d = e.cm;
      if (e.iter(c, n.line + 1, function(e) {
          d && l.collapsed && !d.options.lineWrapping && de(e) == d.display.maxLine && (s = !0), l.collapsed && c != t.line && A(e, 0), Y(e, new _(l, c == t.line ? t.ch : null, c == n.line ? n.ch : null)), ++c
        }), l.collapsed && e.iter(t.line, n.line + 1, function(t) {
          ge(e, t) && A(t, 0)
        }), l.clearOnEnter && Yl(l, "beforeCursorEnter", function() {
          return l.clear()
        }), l.readOnly && (V(), (e.history.done.length || e.history.undone.length) && e.clearHistory()), l.collapsed && (l.id = ++Ma, l.atomic = !0), d) {
        if (s && (d.curOp.updateMaxLine = !0), l.collapsed) gr(d, t.line, n.line + 1);
        else if (l.className || l.title || l.startStyle || l.endStyle || l.css)
          for (var f = t.line; f <= n.line; f++) vr(d, f, "text");
        l.atomic && Ci(d.doc), Lt(d, "markerAdded", d, l)
      }
      return l
    }

    function Vi(e, t, n, r, i) {
      r = u(r), r.shared = !1;
      var o = [Gi(e, t, n, r, i)],
        l = o[0],
        a = r.widgetNode;
      return $r(e, function(e) {
        a && (r.widgetNode = a.cloneNode(!0)), o.push(Gi(e, B(e, t), B(e, n), r, i));
        for (var s = 0; s < e.linked.length; ++s)
          if (e.linked[s].isParent) return;
        l = m(o)
      }), new Oa(o, l)
    }

    function Ki(e) {
      return e.findMarks(P(e.first, 0), e.clipPos(P(e.lastLine())), function(e) {
        return e.parent
      })
    }

    function _i(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n],
          i = r.find(),
          o = e.clipPos(i.from),
          l = e.clipPos(i.to);
        if (j(o, l)) {
          var a = Gi(e, o, l, r.primary, r.primary.type);
          r.markers.push(a), a.parent = r
        }
      }
    }

    function Xi(e) {
      for (var t = function(t) {
          var n = e[t],
            r = [n.primary.doc];
          $r(n.primary.doc, function(e) {
            return r.push(e)
          });
          for (var i = 0; i < n.markers.length; i++) {
            var o = n.markers[i]; - 1 == f(r, o.doc) && (o.parent = null, n.markers.splice(i--, 1))
          }
        }, n = 0; n < e.length; n++) t(n)
    }

    function $i(e) {
      var t = this;
      if (Qi(t), !Ee(t, e) && !Rt(t.display, e)) {
        Pe(e), hl && (Ea = +new Date);
        var n = kn(t, e, !0),
          r = e.dataTransfer.files;
        if (n && !t.isReadOnly())
          if (r && r.length && window.FileReader && window.File)
            for (var i = r.length, o = Array(i), l = 0, a = function(e, r) {
                if (!t.options.allowDropFileTypes || -1 != f(t.options.allowDropFileTypes, e.type)) {
                  var a = new FileReader;
                  a.onload = hr(t, function() {
                    var e = a.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(e) && (e = ""), o[r] = e, ++l == i) {
                      n = B(t.doc, n);
                      var s = {
                        from: n,
                        to: n,
                        text: t.doc.splitLines(o.join(t.doc.lineSeparator())),
                        origin: "paste"
                      };
                      Ni(t.doc, s), yi(t.doc, Rr(n, qr(s)))
                    }
                  }), a.readAsText(e)
                }
              }, s = 0; i > s; ++s) a(r[s], s);
          else {
            if (t.state.draggingText && t.doc.sel.contains(n) > -1) return t.state.draggingText(e), void setTimeout(function() {
              return t.display.input.focus()
            }, 20);
            try {
              var c = e.dataTransfer.getData("Text");
              if (c) {
                var u;
                if (t.state.draggingText && !t.state.draggingText.copy && (u = t.listSelections()), bi(t.doc, Rr(n, n)), u)
                  for (var d = 0; d < u.length; ++d) Pi(t.doc, "", u[d].anchor, u[d].head, "drag");
                t.replaceSelection(c, "around", "paste"), t.display.input.focus()
              }
            } catch (e) {}
          }
      }
    }

    function Yi(e, t) {
      if (hl && (!e.state.draggingText || +new Date - Ea < 100)) return void Fe(t);
      if (!Ee(e, t) && !Rt(e.display, t) && (t.dataTransfer.setData("Text", e.getSelection()), t.dataTransfer.effectAllowed = "copyMove", t.dataTransfer.setDragImage && !xl)) {
        var n = r("img", null, null, "position: fixed; left: 0; top: 0;");
        n.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", yl && (n.width = n.height = 1, e.display.wrapper.appendChild(n), n._top = n.offsetTop), t.dataTransfer.setDragImage(n, 0, 0), yl && n.parentNode.removeChild(n)
      }
    }

    function Ji(e, t) {
      var i = kn(e, t);
      if (i) {
        var o = document.createDocumentFragment();
        Nn(e, i, o), e.display.dragCursor || (e.display.dragCursor = r("div", null, "CodeMirror-cursors CodeMirror-dragcursors"), e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)), n(e.display.dragCursor, o)
      }
    }

    function Qi(e) {
      e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), e.display.dragCursor = null)
    }

    function Zi(e) {
      if (document.getElementsByClassName)
        for (var t = document.getElementsByClassName("CodeMirror"), n = 0; n < t.length; n++) {
          var r = t[n].CodeMirror;
          r && e(r)
        }
    }

    function eo() {
      Da || (to(), Da = !0)
    }

    function to() {
      var e;
      Yl(window, "resize", function() {
        null == e && (e = setTimeout(function() {
          e = null, Zi(no)
        }, 100))
      }), Yl(window, "blur", function() {
        return Zi(Pn)
      })
    }

    function no(e) {
      var t = e.display;
      (t.lastWrapHeight != t.wrapper.clientHeight || t.lastWrapWidth != t.wrapper.clientWidth) && (t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null, t.scrollbarsClipped = !1, e.setSize())
    }

    function ro(e) {
      var t = e.split(/-(?!$)/);
      e = t[t.length - 1];
      for (var n, r, i, o, l = 0; l < t.length - 1; l++) {
        var a = t[l];
        if (/^(cmd|meta|m)$/i.test(a)) o = !0;
        else if (/^a(lt)?$/i.test(a)) n = !0;
        else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
        else {
          if (!/^s(hift)?$/i.test(a)) throw new Error("Unrecognized modifier name: " + a);
          i = !0
        }
      }
      return n && (e = "Alt-" + e), r && (e = "Ctrl-" + e), o && (e = "Cmd-" + e), i && (e = "Shift-" + e), e
    }

    function io(e) {
      var t = {};
      for (var n in e)
        if (e.hasOwnProperty(n)) {
          var r = e[n];
          if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue;
          if ("..." == r) {
            delete e[n];
            continue
          }
          for (var i = g(n.split(" "), ro), o = 0; o < i.length; o++) {
            var l = void 0,
              a = void 0;
            o == i.length - 1 ? (a = i.join(" "), l = r) : (a = i.slice(0, o + 1).join(" "), l = "...");
            var s = t[a];
            if (s) {
              if (s != l) throw new Error("Inconsistent bindings for " + a)
            } else t[a] = l
          }
          delete e[n]
        }
      for (var c in t) e[c] = t[c];
      return e
    }

    function oo(e, t, n, r) {
      t = co(t);
      var i = t.call ? t.call(e, r) : t[e];
      if (i === !1) return "nothing";
      if ("..." === i) return "multi";
      if (null != i && n(i)) return "handled";
      if (t.fallthrough) {
        if ("[object Array]" != Object.prototype.toString.call(t.fallthrough)) return oo(e, t.fallthrough, n, r);
        for (var o = 0; o < t.fallthrough.length; o++) {
          var l = oo(e, t.fallthrough[o], n, r);
          if (l) return l
        }
      }
    }

    function lo(e) {
      var t = "string" == typeof e ? e : Ha[e.keyCode];
      return "Ctrl" == t || "Alt" == t || "Shift" == t || "Mod" == t
    }

    function ao(e, t, n) {
      var r = e;
      return t.altKey && "Alt" != r && (e = "Alt-" + e), (Al ? t.metaKey : t.ctrlKey) && "Ctrl" != r && (e = "Ctrl-" + e), (Al ? t.ctrlKey : t.metaKey) && "Cmd" != r && (e = "Cmd-" + e), !n && t.shiftKey && "Shift" != r && (e = "Shift-" + e), e
    }

    function so(e, t) {
      if (yl && 34 == e.keyCode && e["char"]) return !1;
      var n = Ha[e.keyCode];
      return null == n || e.altGraphKey ? !1 : ao(n, e, t)
    }

    function co(e) {
      return "string" == typeof e ? Ia[e] : e
    }

    function uo(e, t) {
      for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
        for (var o = t(n[i]); r.length && j(o.from, m(r).to) <= 0;) {
          var l = r.pop();
          if (j(l.from, o.from) < 0) {
            o.from = l.from;
            break
          }
        }
        r.push(o)
      }
      fr(e, function() {
        for (var t = r.length - 1; t >= 0; t--) Pi(e.doc, "", r[t].from, r[t].to, "+delete");
        Kn(e)
      })
    }

    function fo(e, t) {
      var n = T(e.doc, t),
        r = de(n);
      return r != n && (t = E(r)), Me(!0, e, r, t, 1)
    }

    function ho(e, t) {
      var n = T(e.doc, t),
        r = fe(n);
      return r != n && (t = E(r)), Me(!0, e, n, t, -1)
    }

    function po(e, t) {
      var n = fo(e, t.line),
        r = T(e.doc, n.line),
        i = Se(r, e.doc.direction);
      if (!i || 0 == i[0].level) {
        var o = Math.max(0, r.text.search(/\S/)),
          l = t.line == n.line && t.ch <= o && t.ch;
        return P(n.line, l ? 0 : o, n.sticky)
      }
      return n
    }

    function mo(e, t, n) {
      if ("string" == typeof t && (t = Fa[t], !t)) return !1;
      e.display.input.ensurePolled();
      var r = e.display.shift,
        i = !1;
      try {
        e.isReadOnly() && (e.state.suppressEdits = !0), n && (e.display.shift = !1), i = t(e) != Fl
      } finally {
        e.display.shift = r, e.state.suppressEdits = !1
      }
      return i
    }

    function go(e, t, n) {
      for (var r = 0; r < e.state.keyMaps.length; r++) {
        var i = oo(t, e.state.keyMaps[r], n, e);
        if (i) return i
      }
      return e.options.extraKeys && oo(t, e.options.extraKeys, n, e) || oo(t, e.options.keyMap, n, e)
    }

    function vo(e, t, n, r) {
      var i = e.state.keySeq;
      if (i) {
        if (lo(t)) return "handled";
        Ra.set(50, function() {
          e.state.keySeq == i && (e.state.keySeq = null, e.display.input.reset())
        }), t = i + " " + t
      }
      var o = go(e, t, r);
      return "multi" == o && (e.state.keySeq = t), "handled" == o && Lt(e, "keyHandled", e, t, n), ("handled" == o || "multi" == o) && (Pe(n), En(e)), i && !o && /\'$/.test(t) ? (Pe(n), !0) : !!o
    }

    function yo(e, t) {
      var n = so(t, !0);
      return n ? t.shiftKey && !e.state.keySeq ? vo(e, "Shift-" + n, t, function(t) {
        return mo(e, t, !0)
      }) || vo(e, n, t, function(t) {
        return ("string" == typeof t ? /^go[A-Z]/.test(t) : t.motion) ? mo(e, t) : void 0
      }) : vo(e, n, t, function(t) {
        return mo(e, t)
      }) : !1
    }

    function xo(e, t, n) {
      return vo(e, "'" + n + "'", t, function(t) {
        return mo(e, t, !0)
      })
    }

    function bo(e) {
      var t = this;
      if (t.curOp.focus = l(), !Ee(t, e)) {
        hl && 11 > pl && 27 == e.keyCode && (e.returnValue = !1);
        var n = e.keyCode;
        t.display.shift = 16 == n || e.shiftKey;
        var r = yo(t, e);
        yl && (qa = r ? n : null, !r && 88 == n && !ea && (kl ? e.metaKey : e.ctrlKey) && t.replaceSelection("", null, "cut")), 18 != n || /\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) || wo(t)
      }
    }

    function wo(e) {
      function t(e) {
        18 != e.keyCode && e.altKey || (Dl(n, "CodeMirror-crosshair"), Ne(document, "keyup", t), Ne(document, "mouseover", t))
      }
      var n = e.display.lineDiv;
      a(n, "CodeMirror-crosshair"), Yl(document, "keyup", t), Yl(document, "mouseover", t)
    }

    function Co(e) {
      16 == e.keyCode && (this.doc.sel.shift = !1), Ee(this, e)
    }

    function So(e) {
      var t = this;
      if (!(Rt(t.display, e) || Ee(t, e) || e.ctrlKey && !e.altKey || kl && e.metaKey)) {
        var n = e.keyCode,
          r = e.charCode;
        if (yl && n == qa) return qa = null, void Pe(e);
        if (!yl || e.which && !(e.which < 10) || !yo(t, e)) {
          var i = String.fromCharCode(null == r ? n : r);
          "\b" != i && (xo(t, e, i) || t.display.input.onKeyPress(e))
        }
      }
    }

    function Lo(e, t) {
      var n = +new Date;
      return Ga && Ga.compare(n, e, t) ? (Ua = Ga = null, "triple") : Ua && Ua.compare(n, e, t) ? (Ga = new Ba(n, e, t), Ua = null, "double") : (Ua = new Ba(n, e, t), Ga = null, "single")
    }

    function ko(e) {
      var t = this,
        n = t.display;
      if (!(Ee(t, e) || n.activeTouch && n.input.supportsTouch())) {
        if (n.input.ensurePolled(), n.shift = e.shiftKey, Rt(n, e)) return void(ml || (n.scroller.draggable = !1, setTimeout(function() {
          return n.scroller.draggable = !0
        }, 100)));
        if (!Ho(t, e)) {
          var r = kn(t, e),
            i = qe(e),
            o = r ? Lo(r, i) : "single";
          window.focus(), 1 == i && t.state.selectingText && t.state.selectingText(e), r && Mo(t, i, r, o, e) || (1 == i ? r ? Oo(t, r, o, e) : Re(e) == n.scroller && Pe(e) : 2 == i ? (r && hi(t.doc, r), setTimeout(function() {
            return n.input.focus()
          }, 20)) : 3 == i && (El ? Wo(t, e) : Hn(t)))
        }
      }
    }

    function Mo(e, t, n, r, i) {
      var o = "Click";
      return "double" == r ? o = "Double" + o : "triple" == r && (o = "Triple" + o), o = (1 == t ? "Left" : 2 == t ? "Middle" : "Right") + o, vo(e, ao(o, i), i, function(t) {
        if ("string" == typeof t && (t = Fa[t]), !t) return !1;
        var r = !1;
        try {
          e.isReadOnly() && (e.state.suppressEdits = !0), r = t(e, n) != Fl
        } finally {
          e.state.suppressEdits = !1
        }
        return r
      })
    }

    function To(e, t, n) {
      var r = e.getOption("configureMouse"),
        i = r ? r(e, t, n) : {};
      if (null == i.unit) {
        var o = Ml ? n.shiftKey && n.metaKey : n.altKey;
        i.unit = o ? "rectangle" : "single" == t ? "char" : "double" == t ? "word" : "line"
      }
      return (null == i.extend || e.doc.extend) && (i.extend = e.doc.extend || n.shiftKey), null == i.addNew && (i.addNew = kl ? n.metaKey : n.ctrlKey), null == i.moveOnDrag && (i.moveOnDrag = !(kl ? n.altKey : n.ctrlKey)), i
    }

    function Oo(e, t, n, r) {
      hl ? setTimeout(c(Dn, e), 0) : e.curOp.focus = l();
      var i, o = To(e, n, r),
        a = e.doc.sel;
      e.options.dragDrop && Jl && !e.isReadOnly() && "single" == n && (i = a.contains(t)) > -1 && (j((i = a.ranges[i]).from(), t) < 0 || t.xRel > 0) && (j(i.to(), t) > 0 || t.xRel < 0) ? No(e, r, t, o) : Eo(e, r, t, o)
    }

    function No(e, t, n, r) {
      var i = e.display,
        o = !1,
        l = hr(e, function(t) {
          ml && (i.scroller.draggable = !1), e.state.draggingText = !1, Ne(document, "mouseup", l), Ne(document, "mousemove", a), Ne(i.scroller, "dragstart", s), Ne(i.scroller, "drop", l), o || (Pe(t), r.addNew || hi(e.doc, n, null, null, r.extend), ml || hl && 9 == pl ? setTimeout(function() {
            document.body.focus(), i.input.focus()
          }, 20) : i.input.focus())
        }),
        a = function(e) {
          o = o || Math.abs(t.clientX - e.clientX) + Math.abs(t.clientY - e.clientY) >= 10
        },
        s = function() {
          return o = !0
        };
      ml && (i.scroller.draggable = !0), e.state.draggingText = l, l.copy = !r.moveOnDrag, i.scroller.dragDrop && i.scroller.dragDrop(), Yl(document, "mouseup", l), Yl(document, "mousemove", a), Yl(i.scroller, "dragstart", s), Yl(i.scroller, "drop", l), Hn(e), setTimeout(function() {
        return i.input.focus()
      }, 20)
    }

    function Ao(e, t, n) {
      if ("char" == n) return new La(t, t);
      if ("word" == n) return e.findWordAt(t);
      if ("line" == n) return new La(P(t.line, 0), B(e.doc, P(t.line + 1, 0)));
      var r = n(e, t);
      return new La(r.from, r.to)
    }

    function Eo(e, t, n, r) {
      function i(t) {
        if (0 != j(v, t))
          if (v = t, "rectangle" == r.unit) {
            for (var i = [], o = e.options.tabSize, l = d(T(c, n.line).text, n.ch, o), a = d(T(c, t.line).text, t.ch, o), s = Math.min(l, a), m = Math.max(l, a), g = Math.min(n.line, t.line), y = Math.min(e.lastLine(), Math.max(n.line, t.line)); y >= g; g++) {
              var x = T(c, g).text,
                b = h(x, s, o);
              s == m ? i.push(new La(P(g, b), P(g, b))) : x.length > b && i.push(new La(P(g, b), P(g, h(x, m, o))))
            }
            i.length || i.push(new La(n, n)), xi(c, Fr(p.ranges.slice(0, f).concat(i), f), {
              origin: "*mouse",
              scroll: !1
            }), e.scrollIntoView(t)
          } else {
            var w, C = u,
              S = Ao(e, t, r.unit),
              L = C.anchor;
            j(S.anchor, L) > 0 ? (w = S.head, L = q(C.from(), S.anchor)) : (w = S.anchor, L = R(C.to(), S.head));
            var k = p.ranges.slice(0);
            k[f] = new La(B(c, L), w), xi(c, Fr(k, f), ql)
          }
      }

      function o(t) {
        var n = ++x,
          a = kn(e, t, !0, "rectangle" == r.unit);
        if (a)
          if (0 != j(a, v)) {
            e.curOp.focus = l(), i(a);
            var u = Fn(s, c);
            (a.line >= u.to || a.line < u.from) && setTimeout(hr(e, function() {
              x == n && o(t)
            }), 150)
          } else {
            var d = t.clientY < y.top ? -20 : t.clientY > y.bottom ? 20 : 0;
            d && setTimeout(hr(e, function() {
              x == n && (s.scroller.scrollTop += d, o(t))
            }), 50)
          }
      }

      function a(t) {
        e.state.selectingText = !1, x = 1 / 0, Pe(t), s.input.focus(), Ne(document, "mousemove", b), Ne(document, "mouseup", w), c.history.lastSelOrigin = null
      }
      var s = e.display,
        c = e.doc;
      Pe(t);
      var u, f, p = c.sel,
        m = p.ranges;
      if (r.addNew && !r.extend ? (f = c.sel.contains(n), u = f > -1 ? m[f] : new La(n, n)) : (u = c.sel.primary(), f = c.sel.primIndex), "rectangle" == r.unit) r.addNew || (u = new La(n, n)), n = kn(e, t, !0, !0), f = -1;
      else {
        var g = Ao(e, n, r.unit);
        u = r.extend ? fi(u, g.anchor, g.head, r.extend) : g
      }
      r.addNew ? -1 == f ? (f = m.length,
        xi(c, Fr(m.concat([u]), f), {
          scroll: !1,
          origin: "*mouse"
        })) : m.length > 1 && m[f].empty() && "char" == r.unit && !r.extend ? (xi(c, Fr(m.slice(0, f).concat(m.slice(f + 1)), 0), {
        scroll: !1,
        origin: "*mouse"
      }), p = c.sel) : mi(c, f, u, ql) : (f = 0, xi(c, new Sa([u], 0), ql), p = c.sel);
      var v = n,
        y = s.wrapper.getBoundingClientRect(),
        x = 0,
        b = hr(e, function(e) {
          qe(e) ? o(e) : a(e)
        }),
        w = hr(e, a);
      e.state.selectingText = w, Yl(document, "mousemove", b), Yl(document, "mouseup", w)
    }

    function Do(e, t, n, r) {
      var i, o;
      try {
        i = t.clientX, o = t.clientY
      } catch (t) {
        return !1
      }
      if (i >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1;
      r && Pe(t);
      var l = e.display,
        a = l.lineDiv.getBoundingClientRect();
      if (o > a.bottom || !He(e, n)) return Ie(t);
      o -= a.top - l.viewOffset;
      for (var s = 0; s < e.options.gutters.length; ++s) {
        var c = l.gutters.childNodes[s];
        if (c && c.getBoundingClientRect().right >= i) {
          var u = D(e.doc, o),
            d = e.options.gutters[s];
          return Ae(e, n, e, u, d, t), Ie(t)
        }
      }
    }

    function Ho(e, t) {
      return Do(e, t, "gutterClick", !0)
    }

    function Wo(e, t) {
      Rt(e.display, t) || Po(e, t) || Ee(e, t, "contextmenu") || e.display.input.onContextMenu(t)
    }

    function Po(e, t) {
      return He(e, "gutterContextMenu") ? Do(e, t, "gutterContextMenu", !1) : !1
    }

    function jo(e) {
      e.display.wrapper.className = e.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + e.options.theme.replace(/(^|\s)\s*/g, " cm-s-"), ln(e)
    }

    function Io(e) {
      function t(t, r, i, o) {
        e.defaults[t] = r, i && (n[t] = o ? function(e, t, n) {
          n != Va && i(e, t, n)
        } : i)
      }
      var n = e.optionHandlers;
      e.defineOption = t, e.Init = Va, t("value", "", function(e, t) {
        return e.setValue(t)
      }, !0), t("mode", null, function(e, t) {
        e.doc.modeOption = t, Vr(e)
      }, !0), t("indentUnit", 2, Vr, !0), t("indentWithTabs", !1), t("smartIndent", !0), t("tabSize", 4, function(e) {
        Kr(e), ln(e), gr(e)
      }, !0), t("lineSeparator", null, function(e, t) {
        if (e.doc.lineSep = t, t) {
          var n = [],
            r = e.doc.first;
          e.doc.iter(function(e) {
            for (var i = 0;;) {
              var o = e.text.indexOf(t, i);
              if (-1 == o) break;
              i = o + t.length, n.push(P(r, o))
            }
            r++
          });
          for (var i = n.length - 1; i >= 0; i--) Pi(e.doc, t, n[i], P(n[i].line, n[i].ch + t.length))
        }
      }), t("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g, function(e, t, n) {
        e.state.specialChars = new RegExp(t.source + (t.test("	") ? "" : "|	"), "g"), n != Va && e.refresh()
      }), t("specialCharPlaceholder", ht, function(e) {
        return e.refresh()
      }, !0), t("electricChars", !0), t("inputStyle", Ll ? "contenteditable" : "textarea", function() {
        throw new Error("inputStyle can not (yet) be changed in a running editor")
      }, !0), t("spellcheck", !1, function(e, t) {
        return e.getInputField().spellcheck = t
      }, !0), t("rtlMoveVisually", !Tl), t("wholeLineUpdateBefore", !0), t("theme", "default", function(e) {
        jo(e), Fo(e)
      }, !0), t("keyMap", "default", function(e, t, n) {
        var r = co(t),
          i = n != Va && co(n);
        i && i.detach && i.detach(e, r), r.attach && r.attach(e, i || null)
      }), t("extraKeys", null), t("configureMouse", null), t("lineWrapping", !1, qo, !0), t("gutters", [], function(e) {
        Wr(e.options), Fo(e)
      }, !0), t("fixedGutter", !0, function(e, t) {
        e.display.gutters.style.left = t ? Cn(e.display) + "px" : "0", e.refresh()
      }, !0), t("coverGutterNextToScrollbar", !1, function(e) {
        return tr(e)
      }, !0), t("scrollbarStyle", "native", function(e) {
        rr(e), tr(e), e.display.scrollbars.setScrollTop(e.doc.scrollTop), e.display.scrollbars.setScrollLeft(e.doc.scrollLeft)
      }, !0), t("lineNumbers", !1, function(e) {
        Wr(e.options), Fo(e)
      }, !0), t("firstLineNumber", 1, Fo, !0), t("lineNumberFormatter", function(e) {
        return e
      }, Fo, !0), t("showCursorWhenSelecting", !1, Tn, !0), t("resetSelectionOnContextMenu", !0), t("lineWiseCopyCut", !0), t("pasteLinesPerSelection", !0), t("readOnly", !1, function(e, t) {
        "nocursor" == t && (Pn(e), e.display.input.blur()), e.display.input.readOnlyChanged(t)
      }), t("disableInput", !1, function(e, t) {
        t || e.display.input.reset()
      }, !0), t("dragDrop", !0, Ro), t("allowDropFileTypes", null), t("cursorBlinkRate", 530), t("cursorScrollMargin", 0), t("cursorHeight", 1, Tn, !0), t("singleCursorHeightPerLine", !0, Tn, !0), t("workTime", 100), t("workDelay", 100), t("flattenSpans", !0, Kr, !0), t("addModeClass", !1, Kr, !0), t("pollInterval", 100), t("undoDepth", 200, function(e, t) {
        return e.doc.history.undoDepth = t
      }), t("historyEventDelay", 1250), t("viewportMargin", 10, function(e) {
        return e.refresh()
      }, !0), t("maxHighlightLength", 1e4, Kr, !0), t("moveInputWithCursor", !0, function(e, t) {
        t || e.display.input.resetPosition()
      }), t("tabindex", null, function(e, t) {
        return e.display.input.getField().tabIndex = t || ""
      }), t("autofocus", null), t("direction", "ltr", function(e, t) {
        return e.doc.setDirection(t)
      }, !0)
    }

    function Fo(e) {
      Hr(e), gr(e), Rn(e)
    }

    function Ro(e, t, n) {
      var r = n && n != Va;
      if (!t != !r) {
        var i = e.display.dragFunctions,
          o = t ? Yl : Ne;
        o(e.display.scroller, "dragstart", i.start), o(e.display.scroller, "dragenter", i.enter), o(e.display.scroller, "dragover", i.over), o(e.display.scroller, "dragleave", i.leave), o(e.display.scroller, "drop", i.drop)
      }
    }

    function qo(e) {
      e.options.lineWrapping ? (a(e.display.wrapper, "CodeMirror-wrap"), e.display.sizer.style.minWidth = "", e.display.sizerWidth = null) : (Dl(e.display.wrapper, "CodeMirror-wrap"), be(e)), Ln(e), gr(e), ln(e), setTimeout(function() {
        return tr(e)
      }, 100)
    }

    function zo(e, t) {
      var n = this;
      if (!(this instanceof zo)) return new zo(e, t);
      this.options = t = t ? u(t) : {}, u(Ka, t, !1), Wr(t);
      var r = t.value;
      "string" == typeof r && (r = new Aa(r, t.mode, null, t.lineSeparator, t.direction)), this.doc = r;
      var i = new zo.inputStyles[t.inputStyle](this),
        o = this.display = new M(e, r, i);
      o.wrapper.CodeMirror = this, Hr(this), jo(this), t.lineWrapping && (this.display.wrapper.className += " CodeMirror-wrap"), rr(this), this.state = {
        keyMaps: [],
        overlays: [],
        modeGen: 0,
        overwrite: !1,
        delayingBlurEvent: !1,
        focused: !1,
        suppressEdits: !1,
        pasteIncoming: !1,
        cutIncoming: !1,
        selectingText: !1,
        draggingText: !1,
        highlight: new Wl,
        keySeq: null,
        specialChars: null
      }, t.autofocus && !Ll && o.input.focus(), hl && 11 > pl && setTimeout(function() {
        return n.display.input.reset(!0)
      }, 20), Bo(this), eo(), ir(this), this.curOp.forceUpdate = !0, Yr(this, r), t.autofocus && !Ll || this.hasFocus() ? setTimeout(c(Wn, this), 20) : Pn(this);
      for (var l in _a) _a.hasOwnProperty(l) && _a[l](n, t[l], Va);
      qn(this), t.finishInit && t.finishInit(this);
      for (var a = 0; a < Xa.length; ++a) Xa[a](n);
      or(this), ml && t.lineWrapping && "optimizelegibility" == getComputedStyle(o.lineDiv).textRendering && (o.lineDiv.style.textRendering = "auto")
    }

    function Bo(e) {
      function t() {
        i.activeTouch && (o = setTimeout(function() {
          return i.activeTouch = null
        }, 1e3), l = i.activeTouch, l.end = +new Date)
      }

      function n(e) {
        if (1 != e.touches.length) return !1;
        var t = e.touches[0];
        return t.radiusX <= 1 && t.radiusY <= 1
      }

      function r(e, t) {
        if (null == t.left) return !0;
        var n = t.left - e.left,
          r = t.top - e.top;
        return n * n + r * r > 400
      }
      var i = e.display;
      Yl(i.scroller, "mousedown", hr(e, ko)), hl && 11 > pl ? Yl(i.scroller, "dblclick", hr(e, function(t) {
        if (!Ee(e, t)) {
          var n = kn(e, t);
          if (n && !Ho(e, t) && !Rt(e.display, t)) {
            Pe(t);
            var r = e.findWordAt(n);
            hi(e.doc, r.anchor, r.head)
          }
        }
      })) : Yl(i.scroller, "dblclick", function(t) {
        return Ee(e, t) || Pe(t)
      }), El || Yl(i.scroller, "contextmenu", function(t) {
        return Wo(e, t)
      });
      var o, l = {
        end: 0
      };
      Yl(i.scroller, "touchstart", function(t) {
        if (!Ee(e, t) && !n(t)) {
          i.input.ensurePolled(), clearTimeout(o);
          var r = +new Date;
          i.activeTouch = {
            start: r,
            moved: !1,
            prev: r - l.end <= 300 ? l : null
          }, 1 == t.touches.length && (i.activeTouch.left = t.touches[0].pageX, i.activeTouch.top = t.touches[0].pageY)
        }
      }), Yl(i.scroller, "touchmove", function() {
        i.activeTouch && (i.activeTouch.moved = !0)
      }), Yl(i.scroller, "touchend", function(n) {
        var o = i.activeTouch;
        if (o && !Rt(i, n) && null != o.left && !o.moved && new Date - o.start < 300) {
          var l, a = e.coordsChar(i.activeTouch, "page");
          l = !o.prev || r(o, o.prev) ? new La(a, a) : !o.prev.prev || r(o, o.prev.prev) ? e.findWordAt(a) : new La(P(a.line, 0), B(e.doc, P(a.line + 1, 0))), e.setSelection(l.anchor, l.head), e.focus(), Pe(n)
        }
        t()
      }), Yl(i.scroller, "touchcancel", t), Yl(i.scroller, "scroll", function() {
        i.scroller.clientHeight && (Jn(e, i.scroller.scrollTop), Zn(e, i.scroller.scrollLeft, !0), Ae(e, "scroll", e))
      }), Yl(i.scroller, "mousewheel", function(t) {
        return Ir(e, t)
      }), Yl(i.scroller, "DOMMouseScroll", function(t) {
        return Ir(e, t)
      }), Yl(i.wrapper, "scroll", function() {
        return i.wrapper.scrollTop = i.wrapper.scrollLeft = 0
      }), i.dragFunctions = {
        enter: function(t) {
          Ee(e, t) || Fe(t)
        },
        over: function(t) {
          Ee(e, t) || (Ji(e, t), Fe(t))
        },
        start: function(t) {
          return Yi(e, t)
        },
        drop: hr(e, $i),
        leave: function(t) {
          Ee(e, t) || Qi(e)
        }
      };
      var a = i.input.getField();
      Yl(a, "keyup", function(t) {
        return Co.call(e, t)
      }), Yl(a, "keydown", hr(e, bo)), Yl(a, "keypress", hr(e, So)), Yl(a, "focus", function(t) {
        return Wn(e, t)
      }), Yl(a, "blur", function(t) {
        return Pn(e, t)
      })
    }

    function Uo(e, t, n, r) {
      var i, o = e.doc;
      null == n && (n = "add"), "smart" == n && (o.mode.indent ? i = et(e, t).state : n = "prev");
      var l = e.options.tabSize,
        a = T(o, t),
        s = d(a.text, null, l);
      a.stateAfter && (a.stateAfter = null);
      var c, u = a.text.match(/^\s*/)[0];
      if (r || /\S/.test(a.text)) {
        if ("smart" == n && (c = o.mode.indent(i, a.text.slice(u.length), a.text), c == Fl || c > 150)) {
          if (!r) return;
          n = "prev"
        }
      } else c = 0, n = "not";
      "prev" == n ? c = t > o.first ? d(T(o, t - 1).text, null, l) : 0 : "add" == n ? c = s + e.options.indentUnit : "subtract" == n ? c = s - e.options.indentUnit : "number" == typeof n && (c = s + n), c = Math.max(0, c);
      var f = "",
        h = 0;
      if (e.options.indentWithTabs)
        for (var m = Math.floor(c / l); m; --m) h += l, f += "	";
      if (c > h && (f += p(c - h)), f != u) return Pi(o, f, P(t, 0), P(t, u.length), "+input"), a.stateAfter = null, !0;
      for (var g = 0; g < o.sel.ranges.length; g++) {
        var v = o.sel.ranges[g];
        if (v.head.line == t && v.head.ch < u.length) {
          var y = P(t, u.length);
          mi(o, g, new La(y, y));
          break
        }
      }
    }

    function Go(e) {
      $a = e
    }

    function Vo(e, t, n, r, i) {
      var o = e.doc;
      e.display.shift = !1, r || (r = o.sel);
      var l = e.state.pasteIncoming || "paste" == i,
        a = Ql(t),
        s = null;
      if (l && r.ranges.length > 1)
        if ($a && $a.text.join("\n") == t) {
          if (r.ranges.length % $a.text.length == 0) {
            s = [];
            for (var c = 0; c < $a.text.length; c++) s.push(o.splitLines($a.text[c]))
          }
        } else a.length == r.ranges.length && e.options.pasteLinesPerSelection && (s = g(a, function(e) {
          return [e]
        }));
      for (var u, d = r.ranges.length - 1; d >= 0; d--) {
        var f = r.ranges[d],
          h = f.from(),
          p = f.to();
        f.empty() && (n && n > 0 ? h = P(h.line, h.ch - n) : e.state.overwrite && !l ? p = P(p.line, Math.min(T(o, p.line).text.length, p.ch + m(a).length)) : $a && $a.lineWise && $a.text.join("\n") == t && (h = p = P(h.line, 0))), u = e.curOp.updateInput;
        var v = {
          from: h,
          to: p,
          text: s ? s[d % s.length] : a,
          origin: i || (l ? "paste" : e.state.cutIncoming ? "cut" : "+input")
        };
        Ni(e.doc, v), Lt(e, "inputRead", e, v)
      }
      t && !l && _o(e, t), Kn(e), e.curOp.updateInput = u, e.curOp.typing = !0, e.state.pasteIncoming = e.state.cutIncoming = !1
    }

    function Ko(e, t) {
      var n = e.clipboardData && e.clipboardData.getData("Text");
      return n ? (e.preventDefault(), t.isReadOnly() || t.options.disableInput || fr(t, function() {
        return Vo(t, n, 0, null, "paste")
      }), !0) : void 0
    }

    function _o(e, t) {
      if (e.options.electricChars && e.options.smartIndent)
        for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
          var i = n.ranges[r];
          if (!(i.head.ch > 100 || r && n.ranges[r - 1].head.line == i.head.line)) {
            var o = e.getModeAt(i.head),
              l = !1;
            if (o.electricChars) {
              for (var a = 0; a < o.electricChars.length; a++)
                if (t.indexOf(o.electricChars.charAt(a)) > -1) {
                  l = Uo(e, i.head.line, "smart");
                  break
                }
            } else o.electricInput && o.electricInput.test(T(e.doc, i.head.line).text.slice(0, i.head.ch)) && (l = Uo(e, i.head.line, "smart"));
            l && Lt(e, "electricInput", e, i.head.line)
          }
        }
    }

    function Xo(e) {
      for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
        var i = e.doc.sel.ranges[r].head.line,
          o = {
            anchor: P(i, 0),
            head: P(i + 1, 0)
          };
        n.push(o), t.push(e.getRange(o.anchor, o.head))
      }
      return {
        text: t,
        ranges: n
      }
    }

    function $o(e, t) {
      e.setAttribute("autocorrect", "off"), e.setAttribute("autocapitalize", "off"), e.setAttribute("spellcheck", !!t)
    }

    function Yo() {
      var e = r("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),
        t = r("div", [e], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
      return ml ? e.style.width = "1000px" : e.setAttribute("wrap", "off"), Cl && (e.style.border = "1px solid black"), $o(e), t
    }

    function Jo(e, t, n, r, i) {
      function o() {
        var r = t.line + n;
        return r < e.first || r >= e.first + e.size ? !1 : (t = new P(r, t.ch, t.sticky), c = T(e, r))
      }

      function l(r) {
        var l;
        if (l = i ? Te(e.cm, c, t, n) : ke(c, t, n), null == l) {
          if (r || !o()) return !1;
          t = Me(i, e.cm, c, t.line, n)
        } else t = l;
        return !0
      }
      var a = t,
        s = n,
        c = T(e, t.line);
      if ("char" == r) l();
      else if ("column" == r) l(!0);
      else if ("word" == r || "group" == r)
        for (var u = null, d = "group" == r, f = e.cm && e.cm.getHelper(t, "wordChars"), h = !0; !(0 > n) || l(!h); h = !1) {
          var p = c.text.charAt(t.ch) || "\n",
            m = w(p, f) ? "w" : d && "\n" == p ? "n" : !d || /\s/.test(p) ? null : "p";
          if (!d || h || m || (m = "s"), u && u != m) {
            0 > n && (n = 1, l(), t.sticky = "after");
            break
          }
          if (m && (u = m), n > 0 && !l(!h)) break
        }
      var g = ki(e, t, a, s, !0);
      return I(a, g) && (g.hitSide = !0), g
    }

    function Qo(e, t, n, r) {
      var i, o = e.doc,
        l = t.left;
      if ("page" == r) {
        var a = Math.min(e.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight),
          s = Math.max(a - .5 * xn(e.display), 3);
        i = (n > 0 ? t.bottom : t.top) + n * s
      } else "line" == r && (i = n > 0 ? t.bottom + 3 : t.top - 3);
      for (var c; c = mn(e, l, i), c.outside;) {
        if (0 > n ? 0 >= i : i >= o.height) {
          c.hitSide = !0;
          break
        }
        i += 5 * n
      }
      return c
    }

    function Zo(e, t) {
      var n = Yt(e, t.line);
      if (!n || n.hidden) return null;
      var r = T(e.doc, t.line),
        i = _t(n, r, t.line),
        o = Se(r, e.doc.direction),
        l = "left";
      if (o) {
        var a = Ce(o, t.ch);
        l = a % 2 ? "right" : "left"
      }
      var s = Zt(i.map, t.ch, l);
      return s.offset = "right" == s.collapse ? s.end : s.start, s
    }

    function el(e) {
      for (var t = e; t; t = t.parentNode)
        if (/CodeMirror-gutter-wrapper/.test(t.className)) return !0;
      return !1
    }

    function tl(e, t) {
      return t && (e.bad = !0), e
    }

    function nl(e, t, n, r, i) {
      function o(e) {
        return function(t) {
          return t.id == e
        }
      }

      function l() {
        u && (c += d, u = !1)
      }

      function a(e) {
        e && (l(), c += e)
      }

      function s(t) {
        if (1 == t.nodeType) {
          var n = t.getAttribute("cm-text");
          if (null != n) return void a(n || t.textContent.replace(/\u200b/g, ""));
          var c, f = t.getAttribute("cm-marker");
          if (f) {
            var h = e.findMarks(P(r, 0), P(i + 1, 0), o(+f));
            return void(h.length && (c = h[0].find()) && a(O(e.doc, c.from, c.to).join(d)))
          }
          if ("false" == t.getAttribute("contenteditable")) return;
          var p = /^(pre|div|p)$/i.test(t.nodeName);
          p && l();
          for (var m = 0; m < t.childNodes.length; m++) s(t.childNodes[m]);
          p && (u = !0)
        } else 3 == t.nodeType && a(t.nodeValue)
      }
      for (var c = "", u = !1, d = e.doc.lineSeparator(); s(t), t != n;) t = t.nextSibling;
      return c
    }

    function rl(e, t, n) {
      var r;
      if (t == e.display.lineDiv) {
        if (r = e.display.lineDiv.childNodes[n], !r) return tl(e.clipPos(P(e.display.viewTo - 1)), !0);
        t = null, n = 0
      } else
        for (r = t;; r = r.parentNode) {
          if (!r || r == e.display.lineDiv) return null;
          if (r.parentNode && r.parentNode == e.display.lineDiv) break
        }
      for (var i = 0; i < e.display.view.length; i++) {
        var o = e.display.view[i];
        if (o.node == r) return il(o, t, n)
      }
    }

    function il(e, t, n) {
      function r(t, n, r) {
        for (var i = -1; i < (d ? d.length : 0); i++)
          for (var o = 0 > i ? u.map : d[i], l = 0; l < o.length; l += 3) {
            var a = o[l + 2];
            if (a == t || a == n) {
              var s = E(0 > i ? e.line : e.rest[i]),
                c = o[l] + r;
              return (0 > r || a != t) && (c = o[l + (r ? 1 : 0)]), P(s, c)
            }
          }
      }
      var i = e.text.firstChild,
        l = !1;
      if (!t || !o(i, t)) return tl(P(E(e.line), 0), !0);
      if (t == i && (l = !0, t = i.childNodes[n], n = 0, !t)) {
        var a = e.rest ? m(e.rest) : e.line;
        return tl(P(E(a), a.text.length), l)
      }
      var s = 3 == t.nodeType ? t : null,
        c = t;
      for (s || 1 != t.childNodes.length || 3 != t.firstChild.nodeType || (s = t.firstChild, n && (n = s.nodeValue.length)); c.parentNode != i;) c = c.parentNode;
      var u = e.measure,
        d = u.maps,
        f = r(s, c, n);
      if (f) return tl(f, l);
      for (var h = c.nextSibling, p = s ? s.nodeValue.length - n : 0; h; h = h.nextSibling) {
        if (f = r(h, h.firstChild, 0)) return tl(P(f.line, f.ch - p), l);
        p += h.textContent.length
      }
      for (var g = c.previousSibling, v = n; g; g = g.previousSibling) {
        if (f = r(g, g.firstChild, -1)) return tl(P(f.line, f.ch + v), l);
        v += g.textContent.length
      }
    }

    function ol(e, t) {
      function n() {
        e.value = c.getValue()
      }
      if (t = t ? u(t) : {}, t.value = e.value, !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex), !t.placeholder && e.placeholder && (t.placeholder = e.placeholder), null == t.autofocus) {
        var r = l();
        t.autofocus = r == e || null != e.getAttribute("autofocus") && r == document.body
      }
      var i;
      if (e.form && (Yl(e.form, "submit", n), !t.leaveSubmitMethodAlone)) {
        var o = e.form;
        i = o.submit;
        try {
          var a = o.submit = function() {
            n(), o.submit = i, o.submit(), o.submit = a
          }
        } catch (s) {}
      }
      t.finishInit = function(t) {
        t.save = n, t.getTextArea = function() {
          return e
        }, t.toTextArea = function() {
          t.toTextArea = isNaN, n(), e.parentNode.removeChild(t.getWrapperElement()), e.style.display = "", e.form && (Ne(e.form, "submit", n), "function" == typeof e.form.submit && (e.form.submit = i))
        }
      }, e.style.display = "none";
      var c = zo(function(t) {
        return e.parentNode.insertBefore(t, e.nextSibling)
      }, t);
      return c
    }

    function ll(e) {
      e.off = Ne, e.on = Yl, e.wheelEventPixels = jr, e.Doc = Aa, e.splitLines = Ql, e.countColumn = d, e.findColumn = h, e.isWordChar = b, e.Pass = Fl, e.signal = Ae, e.Line = ca, e.changeEnd = qr, e.scrollbarModel = ya, e.Pos = P, e.cmpPos = j, e.modes = na, e.mimeModes = ra, e.resolveMode = Ke, e.getMode = _e, e.modeExtensions = ia, e.extendMode = Xe, e.copyState = $e, e.startState = Je, e.innerMode = Ye, e.commands = Fa, e.keyMap = Ia, e.keyName = so, e.isModifierKey = lo, e.lookupKey = oo, e.normalizeKeyMap = io, e.StringStream = oa, e.SharedTextMarker = Oa, e.TextMarker = Ta, e.LineWidget = ka, e.e_preventDefault = Pe, e.e_stopPropagation = je, e.e_stop = Fe, e.addClass = a, e.contains = o, e.rmClass = Dl, e.keyNames = Ha
    }
    var al = navigator.userAgent,
      sl = navigator.platform,
      cl = /gecko\/\d/i.test(al),
      ul = /MSIE \d/.test(al),
      dl = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(al),
      fl = /Edge\/(\d+)/.exec(al),
      hl = ul || dl || fl,
      pl = hl && (ul ? document.documentMode || 6 : +(fl || dl)[1]),
      ml = !fl && /WebKit\//.test(al),
      gl = ml && /Qt\/\d+\.\d+/.test(al),
      vl = !fl && /Chrome\//.test(al),
      yl = /Opera\//.test(al),
      xl = /Apple Computer/.test(navigator.vendor),
      bl = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(al),
      wl = /PhantomJS/.test(al),
      Cl = !fl && /AppleWebKit/.test(al) && /Mobile\/\w+/.test(al),
      Sl = /Android/.test(al),
      Ll = Cl || Sl || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(al),
      kl = Cl || /Mac/.test(sl),
      Ml = /\bCrOS\b/.test(al),
      Tl = /win/i.test(sl),
      Ol = yl && al.match(/Version\/(\d*\.\d*)/);
    Ol && (Ol = Number(Ol[1])), Ol && Ol >= 15 && (yl = !1, ml = !0);
    var Nl, Al = kl && (gl || yl && (null == Ol || 12.11 > Ol)),
      El = cl || hl && pl >= 9,
      Dl = function(t, n) {
        var r = t.className,
          i = e(n).exec(r);
        if (i) {
          var o = r.slice(i.index + i[0].length);
          t.className = r.slice(0, i.index) + (o ? i[1] + o : "")
        }
      };
    Nl = document.createRange ? function(e, t, n, r) {
      var i = document.createRange();
      return i.setEnd(r || e, n), i.setStart(e, t), i
    } : function(e, t, n) {
      var r = document.body.createTextRange();
      try {
        r.moveToElementText(e.parentNode)
      } catch (i) {
        return r
      }
      return r.collapse(!0), r.moveEnd("character", n), r.moveStart("character", t), r
    };
    var Hl = function(e) {
      e.select()
    };
    Cl ? Hl = function(e) {
      e.selectionStart = 0, e.selectionEnd = e.value.length
    } : hl && (Hl = function(e) {
      try {
        e.select()
      } catch (t) {}
    });
    var Wl = function() {
      this.id = null
    };
    Wl.prototype.set = function(e, t) {
      clearTimeout(this.id), this.id = setTimeout(t, e)
    };
    var Pl, jl, Il = 30,
      Fl = {
        toString: function() {
          return "CodeMirror.Pass"
        }
      },
      Rl = {
        scroll: !1
      },
      ql = {
        origin: "*mouse"
      },
      zl = {
        origin: "+move"
      },
      Bl = [""],
      Ul = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
      Gl = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
      Vl = !1,
      Kl = !1,
      _l = null,
      Xl = function() {
        function e(e) {
          return 247 >= e ? n.charAt(e) : e >= 1424 && 1524 >= e ? "R" : e >= 1536 && 1785 >= e ? r.charAt(e - 1536) : e >= 1774 && 2220 >= e ? "r" : e >= 8192 && 8203 >= e ? "w" : 8204 == e ? "b" : "L"
        }

        function t(e, t, n) {
          this.level = e, this.from = t, this.to = n
        }
        var n = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",
          r = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111",
          i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
          o = /[stwN]/,
          l = /[LRr]/,
          a = /[Lb1n]/,
          s = /[1n]/;
        return function(n, r) {
          var c = "ltr" == r ? "L" : "R";
          if (0 == n.length || "ltr" == r && !i.test(n)) return !1;
          for (var u = n.length, d = [], f = 0; u > f; ++f) d.push(e(n.charCodeAt(f)));
          for (var h = 0, p = c; u > h; ++h) {
            var g = d[h];
            "m" == g ? d[h] = p : p = g
          }
          for (var v = 0, y = c; u > v; ++v) {
            var x = d[v];
            "1" == x && "r" == y ? d[v] = "n" : l.test(x) && (y = x, "r" == x && (d[v] = "R"))
          }
          for (var b = 1, w = d[0]; u - 1 > b; ++b) {
            var C = d[b];
            "+" == C && "1" == w && "1" == d[b + 1] ? d[b] = "1" : "," != C || w != d[b + 1] || "1" != w && "n" != w || (d[b] = w), w = C
          }
          for (var S = 0; u > S; ++S) {
            var L = d[S];
            if ("," == L) d[S] = "N";
            else if ("%" == L) {
              var k = void 0;
              for (k = S + 1; u > k && "%" == d[k]; ++k);
              for (var M = S && "!" == d[S - 1] || u > k && "1" == d[k] ? "1" : "N", T = S; k > T; ++T) d[T] = M;
              S = k - 1
            }
          }
          for (var O = 0, N = c; u > O; ++O) {
            var A = d[O];
            "L" == N && "1" == A ? d[O] = "L" : l.test(A) && (N = A)
          }
          for (var E = 0; u > E; ++E)
            if (o.test(d[E])) {
              var D = void 0;
              for (D = E + 1; u > D && o.test(d[D]); ++D);
              for (var H = "L" == (E ? d[E - 1] : c), W = "L" == (u > D ? d[D] : c), P = H == W ? H ? "L" : "R" : c, j = E; D > j; ++j) d[j] = P;
              E = D - 1
            }
          for (var I, F = [], R = 0; u > R;)
            if (a.test(d[R])) {
              var q = R;
              for (++R; u > R && a.test(d[R]); ++R);
              F.push(new t(0, q, R))
            } else {
              var z = R,
                B = F.length;
              for (++R; u > R && "L" != d[R]; ++R);
              for (var U = z; R > U;)
                if (s.test(d[U])) {
                  U > z && F.splice(B, 0, new t(1, z, U));
                  var G = U;
                  for (++U; R > U && s.test(d[U]); ++U);
                  F.splice(B, 0, new t(2, G, U)), z = U
                } else ++U;
              R > z && F.splice(B, 0, new t(1, z, R))
            }
          return 1 == F[0].level && (I = n.match(/^\s+/)) && (F[0].from = I[0].length, F.unshift(new t(0, 0, I[0].length))), 1 == m(F).level && (I = n.match(/\s+$/)) && (m(F).to -= I[0].length, F.push(new t(0, u - I[0].length, u))), "rtl" == r ? F.reverse() : F
        }
      }(),
      $l = [],
      Yl = function(e, t, n) {
        if (e.addEventListener) e.addEventListener(t, n, !1);
        else if (e.attachEvent) e.attachEvent("on" + t, n);
        else {
          var r = e._handlers || (e._handlers = {});
          r[t] = (r[t] || $l).concat(n)
        }
      },
      Jl = function() {
        if (hl && 9 > pl) return !1;
        var e = r("div");
        return "draggable" in e || "dragDrop" in e
      }(),
      Ql = 3 != "\n\nb".split(/\n/).length ? function(e) {
        for (var t = 0, n = [], r = e.length; r >= t;) {
          var i = e.indexOf("\n", t); - 1 == i && (i = e.length);
          var o = e.slice(t, "\r" == e.charAt(i - 1) ? i - 1 : i),
            l = o.indexOf("\r"); - 1 != l ? (n.push(o.slice(0, l)), t += l + 1) : (n.push(o), t = i + 1)
        }
        return n
      } : function(e) {
        return e.split(/\r\n?|\n/)
      },
      Zl = window.getSelection ? function(e) {
        try {
          return e.selectionStart != e.selectionEnd
        } catch (t) {
          return !1
        }
      } : function(e) {
        var t;
        try {
          t = e.ownerDocument.selection.createRange()
        } catch (n) {}
        return t && t.parentElement() == e ? 0 != t.compareEndPoints("StartToEnd", t) : !1
      },
      ea = function() {
        var e = r("div");
        return "oncopy" in e ? !0 : (e.setAttribute("oncopy", "return;"), "function" == typeof e.oncopy)
      }(),
      ta = null,
      na = {},
      ra = {},
      ia = {},
      oa = function(e, t, n) {
        this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = n
      };
    oa.prototype.eol = function() {
      return this.pos >= this.string.length
    }, oa.prototype.sol = function() {
      return this.pos == this.lineStart
    }, oa.prototype.peek = function() {
      return this.string.charAt(this.pos) || void 0
    }, oa.prototype.next = function() {
      return this.pos < this.string.length ? this.string.charAt(this.pos++) : void 0
    }, oa.prototype.eat = function(e) {
      var t, n = this.string.charAt(this.pos);
      return t = "string" == typeof e ? n == e : n && (e.test ? e.test(n) : e(n)), t ? (++this.pos, n) : void 0
    }, oa.prototype.eatWhile = function(e) {
      for (var t = this.pos; this.eat(e););
      return this.pos > t
    }, oa.prototype.eatSpace = function() {
      for (var e = this, t = this.pos;
        /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++e.pos;
      return this.pos > t
    }, oa.prototype.skipToEnd = function() {
      this.pos = this.string.length
    }, oa.prototype.skipTo = function(e) {
      var t = this.string.indexOf(e, this.pos);
      return t > -1 ? (this.pos = t, !0) : void 0
    }, oa.prototype.backUp = function(e) {
      this.pos -= e
    }, oa.prototype.column = function() {
      return this.lastColumnPos < this.start && (this.lastColumnValue = d(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? d(this.string, this.lineStart, this.tabSize) : 0)
    }, oa.prototype.indentation = function() {
      return d(this.string, null, this.tabSize) - (this.lineStart ? d(this.string, this.lineStart, this.tabSize) : 0)
    }, oa.prototype.match = function(e, t, n) {
      if ("string" != typeof e) {
        var r = this.string.slice(this.pos).match(e);
        return r && r.index > 0 ? null : (r && t !== !1 && (this.pos += r[0].length), r)
      }
      var i = function(e) {
          return n ? e.toLowerCase() : e
        },
        o = this.string.substr(this.pos, e.length);
      return i(o) == i(e) ? (t !== !1 && (this.pos += e.length), !0) : void 0
    }, oa.prototype.current = function() {
      return this.string.slice(this.start, this.pos)
    }, oa.prototype.hideFirstChars = function(e, t) {
      this.lineStart += e;
      try {
        return t()
      } finally {
        this.lineStart -= e
      }
    }, oa.prototype.lookAhead = function(e) {
      var t = this.lineOracle;
      return t && t.lookAhead(e)
    };
    var la = function(e, t) {
        this.state = e, this.lookAhead = t
      },
      aa = function(e, t, n, r) {
        this.state = t, this.doc = e, this.line = n, this.maxLookAhead = r || 0
      };
    aa.prototype.lookAhead = function(e) {
      var t = this.doc.getLine(this.line + e);
      return null != t && e > this.maxLookAhead && (this.maxLookAhead = e), t
    }, aa.prototype.nextLine = function() {
      this.line++, this.maxLookAhead > 0 && this.maxLookAhead--
    }, aa.fromSaved = function(e, t, n) {
      return t instanceof la ? new aa(e, $e(e.mode, t.state), n, t.lookAhead) : new aa(e, $e(e.mode, t), n)
    }, aa.prototype.save = function(e) {
      var t = e !== !1 ? $e(this.doc.mode, this.state) : this.state;
      return this.maxLookAhead > 0 ? new la(t, this.maxLookAhead) : t
    };
    var sa = function(e, t, n) {
        this.start = e.start, this.end = e.pos, this.string = e.current(), this.type = t || null, this.state = n
      },
      ca = function(e, t, n) {
        this.text = e, re(this, t), this.height = n ? n(this) : 1
      };
    ca.prototype.lineNo = function() {
      return E(this)
    }, We(ca);
    var ua, da = {},
      fa = {},
      ha = null,
      pa = null,
      ma = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      ga = function(e, t, n) {
        this.cm = n;
        var i = this.vert = r("div", [r("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar"),
          o = this.horiz = r("div", [r("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        e(i), e(o), Yl(i, "scroll", function() {
          i.clientHeight && t(i.scrollTop, "vertical")
        }), Yl(o, "scroll", function() {
          o.clientWidth && t(o.scrollLeft, "horizontal")
        }), this.checkedZeroWidth = !1, hl && 8 > pl && (this.horiz.style.minHeight = this.vert.style.minWidth = "18px")
      };
    ga.prototype.update = function(e) {
      var t = e.scrollWidth > e.clientWidth + 1,
        n = e.scrollHeight > e.clientHeight + 1,
        r = e.nativeBarWidth;
      if (n) {
        this.vert.style.display = "block", this.vert.style.bottom = t ? r + "px" : "0";
        var i = e.viewHeight - (t ? r : 0);
        this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + "px"
      } else this.vert.style.display = "", this.vert.firstChild.style.height = "0";
      if (t) {
        this.horiz.style.display = "block", this.horiz.style.right = n ? r + "px" : "0", this.horiz.style.left = e.barLeft + "px";
        var o = e.viewWidth - e.barLeft - (n ? r : 0);
        this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + o) + "px"
      } else this.horiz.style.display = "", this.horiz.firstChild.style.width = "0";
      return !this.checkedZeroWidth && e.clientHeight > 0 && (0 == r && this.zeroWidthHack(), this.checkedZeroWidth = !0), {
        right: n ? r : 0,
        bottom: t ? r : 0
      }
    }, ga.prototype.setScrollLeft = function(e) {
      this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e), this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz")
    }, ga.prototype.setScrollTop = function(e) {
      this.vert.scrollTop != e && (this.vert.scrollTop = e), this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, "vert")
    }, ga.prototype.zeroWidthHack = function() {
      var e = kl && !bl ? "12px" : "18px";
      this.horiz.style.height = this.vert.style.width = e, this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none", this.disableHoriz = new Wl, this.disableVert = new Wl
    }, ga.prototype.enableZeroWidthBar = function(e, t, n) {
      function r() {
        var i = e.getBoundingClientRect(),
          o = "vert" == n ? document.elementFromPoint(i.right - 1, (i.top + i.bottom) / 2) : document.elementFromPoint((i.right + i.left) / 2, i.bottom - 1);
        o != e ? e.style.pointerEvents = "none" : t.set(1e3, r)
      }
      e.style.pointerEvents = "auto", t.set(1e3, r)
    }, ga.prototype.clear = function() {
      var e = this.horiz.parentNode;
      e.removeChild(this.horiz), e.removeChild(this.vert)
    };
    var va = function() {};
    va.prototype.update = function() {
      return {
        bottom: 0,
        right: 0
      }
    }, va.prototype.setScrollLeft = function() {}, va.prototype.setScrollTop = function() {}, va.prototype.clear = function() {};
    var ya = {
        "native": ga,
        "null": va
      },
      xa = 0,
      ba = function(e, t, n) {
        var r = e.display;
        this.viewport = t, this.visible = Fn(r, e.doc, t), this.editorIsHidden = !r.wrapper.offsetWidth, this.wrapperHeight = r.wrapper.clientHeight, this.wrapperWidth = r.wrapper.clientWidth, this.oldDisplayWidth = Gt(e), this.force = n, this.dims = wn(e), this.events = []
      };
    ba.prototype.signal = function(e, t) {
      He(e, t) && this.events.push(arguments)
    }, ba.prototype.finish = function() {
      for (var e = this, t = 0; t < this.events.length; t++) Ae.apply(null, e.events[t])
    };
    var wa = 0,
      Ca = null;
    hl ? Ca = -.53 : cl ? Ca = 15 : vl ? Ca = -.7 : xl && (Ca = -1 / 3);
    var Sa = function(e, t) {
      this.ranges = e, this.primIndex = t
    };
    Sa.prototype.primary = function() {
      return this.ranges[this.primIndex]
    }, Sa.prototype.equals = function(e) {
      var t = this;
      if (e == this) return !0;
      if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1;
      for (var n = 0; n < this.ranges.length; n++) {
        var r = t.ranges[n],
          i = e.ranges[n];
        if (!I(r.anchor, i.anchor) || !I(r.head, i.head)) return !1
      }
      return !0
    }, Sa.prototype.deepCopy = function() {
      for (var e = this, t = [], n = 0; n < this.ranges.length; n++) t[n] = new La(F(e.ranges[n].anchor), F(e.ranges[n].head));
      return new Sa(t, this.primIndex)
    }, Sa.prototype.somethingSelected = function() {
      for (var e = this, t = 0; t < this.ranges.length; t++)
        if (!e.ranges[t].empty()) return !0;
      return !1
    }, Sa.prototype.contains = function(e, t) {
      var n = this;
      t || (t = e);
      for (var r = 0; r < this.ranges.length; r++) {
        var i = n.ranges[r];
        if (j(t, i.from()) >= 0 && j(e, i.to()) <= 0) return r
      }
      return -1
    };
    var La = function(e, t) {
      this.anchor = e, this.head = t
    };
    La.prototype.from = function() {
      return q(this.anchor, this.head)
    }, La.prototype.to = function() {
      return R(this.anchor, this.head)
    }, La.prototype.empty = function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
    }, qi.prototype = {
      chunkSize: function() {
        return this.lines.length
      },
      removeInner: function(e, t) {
        for (var n = this, r = e, i = e + t; i > r; ++r) {
          var o = n.lines[r];
          n.height -= o.height, ut(o), Lt(o, "delete")
        }
        this.lines.splice(e, t)
      },
      collapse: function(e) {
        e.push.apply(e, this.lines)
      },
      insertInner: function(e, t, n) {
        var r = this;
        this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
        for (var i = 0; i < t.length; ++i) t[i].parent = r
      },
      iterN: function(e, t, n) {
        for (var r = this, i = e + t; i > e; ++e)
          if (n(r.lines[e])) return !0
      }
    }, zi.prototype = {
      chunkSize: function() {
        return this.size
      },
      removeInner: function(e, t) {
        var n = this;
        this.size -= t;
        for (var r = 0; r < this.children.length; ++r) {
          var i = n.children[r],
            o = i.chunkSize();
          if (o > e) {
            var l = Math.min(t, o - e),
              a = i.height;
            if (i.removeInner(e, l), n.height -= a - i.height, o == l && (n.children.splice(r--, 1), i.parent = null), 0 == (t -= l)) break;
            e = 0
          } else e -= o
        }
        if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof qi))) {
          var s = [];
          this.collapse(s), this.children = [new qi(s)], this.children[0].parent = this
        }
      },
      collapse: function(e) {
        for (var t = this, n = 0; n < this.children.length; ++n) t.children[n].collapse(e)
      },
      insertInner: function(e, t, n) {
        var r = this;
        this.size += t.length, this.height += n;
        for (var i = 0; i < this.children.length; ++i) {
          var o = r.children[i],
            l = o.chunkSize();
          if (l >= e) {
            if (o.insertInner(e, t, n), o.lines && o.lines.length > 50) {
              for (var a = o.lines.length % 25 + 25, s = a; s < o.lines.length;) {
                var c = new qi(o.lines.slice(s, s += 25));
                o.height -= c.height, r.children.splice(++i, 0, c), c.parent = r
              }
              o.lines = o.lines.slice(0, a), r.maybeSpill()
            }
            break
          }
          e -= l
        }
      },
      maybeSpill: function() {
        if (!(this.children.length <= 10)) {
          var e = this;
          do {
            var t = e.children.splice(e.children.length - 5, 5),
              n = new zi(t);
            if (e.parent) {
              e.size -= n.size, e.height -= n.height;
              var r = f(e.parent.children, e);
              e.parent.children.splice(r + 1, 0, n)
            } else {
              var i = new zi(e.children);
              i.parent = e, e.children = [i, n], e = i
            }
            n.parent = e.parent
          } while (e.children.length > 10);
          e.parent.maybeSpill()
        }
      },
      iterN: function(e, t, n) {
        for (var r = this, i = 0; i < this.children.length; ++i) {
          var o = r.children[i],
            l = o.chunkSize();
          if (l > e) {
            var a = Math.min(t, l - e);
            if (o.iterN(e, a, n)) return !0;
            if (0 == (t -= a)) break;
            e = 0
          } else e -= l
        }
      }
    };
    var ka = function(e, t, n) {
      var r = this;
      if (n)
        for (var i in n) n.hasOwnProperty(i) && (r[i] = n[i]);
      this.doc = e, this.node = t
    };
    ka.prototype.clear = function() {
      var e = this,
        t = this.doc.cm,
        n = this.line.widgets,
        r = this.line,
        i = E(r);
      if (null != i && n) {
        for (var o = 0; o < n.length; ++o) n[o] == e && n.splice(o--, 1);
        n.length || (r.widgets = null);
        var l = Ft(this);
        A(r, Math.max(0, r.height - l)), t && (fr(t, function() {
          Bi(t, r, -l), vr(t, i, "widget")
        }), Lt(t, "lineWidgetCleared", t, this, i))
      }
    }, ka.prototype.changed = function() {
      var e = this,
        t = this.height,
        n = this.doc.cm,
        r = this.line;
      this.height = null;
      var i = Ft(this) - t;
      i && (A(r, r.height + i), n && fr(n, function() {
        n.curOp.forceUpdate = !0, Bi(n, r, i), Lt(n, "lineWidgetChanged", n, e, E(r))
      }))
    }, We(ka);
    var Ma = 0,
      Ta = function(e, t) {
        this.lines = [], this.type = t, this.doc = e, this.id = ++Ma
      };
    Ta.prototype.clear = function() {
      var e = this;
      if (!this.explicitlyCleared) {
        var t = this.doc.cm,
          n = t && !t.curOp;
        if (n && ir(t), He(this, "clear")) {
          var r = this.find();
          r && Lt(this, "clear", r.from, r.to)
        }
        for (var i = null, o = null, l = 0; l < this.lines.length; ++l) {
          var a = e.lines[l],
            s = X(a.markedSpans, e);
          t && !e.collapsed ? vr(t, E(a), "text") : t && (null != s.to && (o = E(a)), null != s.from && (i = E(a))), a.markedSpans = $(a.markedSpans, s), null == s.from && e.collapsed && !ge(e.doc, a) && t && A(a, xn(t.display))
        }
        if (t && this.collapsed && !t.options.lineWrapping)
          for (var c = 0; c < this.lines.length; ++c) {
            var u = de(e.lines[c]),
              d = xe(u);
            d > t.display.maxLineLength && (t.display.maxLine = u, t.display.maxLineLength = d, t.display.maxLineChanged = !0)
          }
        null != i && t && this.collapsed && gr(t, i, o + 1), this.lines.length = 0, this.explicitlyCleared = !0, this.atomic && this.doc.cantEdit && (this.doc.cantEdit = !1, t && Ci(t.doc)), t && Lt(t, "markerCleared", t, this, i, o), n && or(t), this.parent && this.parent.clear()
      }
    }, Ta.prototype.find = function(e, t) {
      var n = this;
      null == e && "bookmark" == this.type && (e = 1);
      for (var r, i, o = 0; o < this.lines.length; ++o) {
        var l = n.lines[o],
          a = X(l.markedSpans, n);
        if (null != a.from && (r = P(t ? l : E(l), a.from), -1 == e)) return r;
        if (null != a.to && (i = P(t ? l : E(l), a.to), 1 == e)) return i
      }
      return r && {
        from: r,
        to: i
      }
    }, Ta.prototype.changed = function() {
      var e = this,
        t = this.find(-1, !0),
        n = this,
        r = this.doc.cm;
      t && r && fr(r, function() {
        var i = t.line,
          o = E(t.line),
          l = Yt(r, o);
        if (l && (rn(l), r.curOp.selectionChanged = r.curOp.forceUpdate = !0), r.curOp.updateMaxLine = !0, !ge(n.doc, i) && null != n.height) {
          var a = n.height;
          n.height = null;
          var s = Ft(n) - a;
          s && A(i, i.height + s)
        }
        Lt(r, "markerChanged", r, e)
      })
    }, Ta.prototype.attachLine = function(e) {
      if (!this.lines.length && this.doc.cm) {
        var t = this.doc.cm.curOp;
        t.maybeHiddenMarkers && -1 != f(t.maybeHiddenMarkers, this) || (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
      }
      this.lines.push(e)
    }, Ta.prototype.detachLine = function(e) {
      if (this.lines.splice(f(this.lines, e), 1), !this.lines.length && this.doc.cm) {
        var t = this.doc.cm.curOp;
        (t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
      }
    }, We(Ta);
    var Oa = function(e, t) {
      var n = this;
      this.markers = e, this.primary = t;
      for (var r = 0; r < e.length; ++r) e[r].parent = n
    };
    Oa.prototype.clear = function() {
      var e = this;
      if (!this.explicitlyCleared) {
        this.explicitlyCleared = !0;
        for (var t = 0; t < this.markers.length; ++t) e.markers[t].clear();
        Lt(this, "clear")
      }
    }, Oa.prototype.find = function(e, t) {
      return this.primary.find(e, t)
    }, We(Oa);
    var Na = 0,
      Aa = function(e, t, n, r, i) {
        if (!(this instanceof Aa)) return new Aa(e, t, n, r, i);
        null == n && (n = 0), zi.call(this, [new qi([new ca("", null)])]), this.first = n, this.scrollTop = this.scrollLeft = 0, this.cantEdit = !1, this.cleanGeneration = 1, this.modeFrontier = this.highlightFrontier = n;
        var o = P(n, 0);
        this.sel = Rr(o), this.history = new Zr(null), this.id = ++Na, this.modeOption = t, this.lineSep = r, this.direction = "rtl" == i ? "rtl" : "ltr", this.extend = !1, "string" == typeof e && (e = this.splitLines(e)), Xr(this, {
          from: o,
          to: o,
          text: e
        }), xi(this, Rr(o), Rl)
      };
    Aa.prototype = x(zi.prototype, {
      constructor: Aa,
      iter: function(e, t, n) {
        n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
      },
      insert: function(e, t) {
        for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height;
        this.insertInner(e - this.first, t, n)
      },
      remove: function(e, t) {
        this.removeInner(e - this.first, t)
      },
      getValue: function(e) {
        var t = N(this, this.first, this.first + this.size);
        return e === !1 ? t : t.join(e || this.lineSeparator())
      },
      setValue: mr(function(e) {
        var t = P(this.first, 0),
          n = this.first + this.size - 1;
        Ni(this, {
          from: t,
          to: P(n, T(this, n).text.length),
          text: this.splitLines(e),
          origin: "setValue",
          full: !0
        }, !0), this.cm && _n(this.cm, 0, 0), xi(this, Rr(t), Rl)
      }),
      replaceRange: function(e, t, n, r) {
        t = B(this, t), n = n ? B(this, n) : t, Pi(this, e, t, n, r)
      },
      getRange: function(e, t, n) {
        var r = O(this, B(this, e), B(this, t));
        return n === !1 ? r : r.join(n || this.lineSeparator())
      },
      getLine: function(e) {
        var t = this.getLineHandle(e);
        return t && t.text
      },
      getLineHandle: function(e) {
        return H(this, e) ? T(this, e) : void 0
      },
      getLineNumber: function(e) {
        return E(e)
      },
      getLineHandleVisualStart: function(e) {
        return "number" == typeof e && (e = T(this, e)), de(e)
      },
      lineCount: function() {
        return this.size
      },
      firstLine: function() {
        return this.first
      },
      lastLine: function() {
        return this.first + this.size - 1
      },
      clipPos: function(e) {
        return B(this, e)
      },
      getCursor: function(e) {
        var t, n = this.sel.primary();
        return t = null == e || "head" == e ? n.head : "anchor" == e ? n.anchor : "end" == e || "to" == e || e === !1 ? n.to() : n.from()
      },
      listSelections: function() {
        return this.sel.ranges
      },
      somethingSelected: function() {
        return this.sel.somethingSelected()
      },
      setCursor: mr(function(e, t, n) {
        gi(this, B(this, "number" == typeof e ? P(e, t || 0) : e), null, n)
      }),
      setSelection: mr(function(e, t, n) {
        gi(this, B(this, e), B(this, t || e), n)
      }),
      extendSelection: mr(function(e, t, n) {
        hi(this, B(this, e), t && B(this, t), n)
      }),
      extendSelections: mr(function(e, t) {
        pi(this, G(this, e), t)
      }),
      extendSelectionsBy: mr(function(e, t) {
        var n = g(this.sel.ranges, e);
        pi(this, G(this, n), t)
      }),
      setSelections: mr(function(e, t, n) {
        var r = this;
        if (e.length) {
          for (var i = [], o = 0; o < e.length; o++) i[o] = new La(B(r, e[o].anchor), B(r, e[o].head));
          null == t && (t = Math.min(e.length - 1, this.sel.primIndex)), xi(this, Fr(i, t), n)
        }
      }),
      addSelection: mr(function(e, t, n) {
        var r = this.sel.ranges.slice(0);
        r.push(new La(B(this, e), B(this, t || e))), xi(this, Fr(r, r.length - 1), n)
      }),
      getSelection: function(e) {
        for (var t, n = this, r = this.sel.ranges, i = 0; i < r.length; i++) {
          var o = O(n, r[i].from(), r[i].to());
          t = t ? t.concat(o) : o
        }
        return e === !1 ? t : t.join(e || this.lineSeparator())
      },
      getSelections: function(e) {
        for (var t = this, n = [], r = this.sel.ranges, i = 0; i < r.length; i++) {
          var o = O(t, r[i].from(), r[i].to());
          e !== !1 && (o = o.join(e || t.lineSeparator())), n[i] = o
        }
        return n
      },
      replaceSelection: function(e, t, n) {
        for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e;
        this.replaceSelections(r, t, n || "+input")
      },
      replaceSelections: mr(function(e, t, n) {
        for (var r = this, i = [], o = this.sel, l = 0; l < o.ranges.length; l++) {
          var a = o.ranges[l];
          i[l] = {
            from: a.from(),
            to: a.to(),
            text: r.splitLines(e[l]),
            origin: n
          }
        }
        for (var s = t && "end" != t && Gr(this, i, t), c = i.length - 1; c >= 0; c--) Ni(r, i[c]);
        s ? yi(this, s) : this.cm && Kn(this.cm)
      }),
      undo: mr(function() {
        Ei(this, "undo")
      }),
      redo: mr(function() {
        Ei(this, "redo")
      }),
      undoSelection: mr(function() {
        Ei(this, "undo", !0)
      }),
      redoSelection: mr(function() {
        Ei(this, "redo", !0)
      }),
      setExtending: function(e) {
        this.extend = e
      },
      getExtending: function() {
        return this.extend
      },
      historySize: function() {
        for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++) e.done[r].ranges || ++t;
        for (var i = 0; i < e.undone.length; i++) e.undone[i].ranges || ++n;
        return {
          undo: t,
          redo: n
        }
      },
      clearHistory: function() {
        this.history = new Zr(this.history.maxGeneration)
      },
      markClean: function() {
        this.cleanGeneration = this.changeGeneration(!0)
      },
      changeGeneration: function(e) {
        return e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation
      },
      isClean: function(e) {
        return this.history.generation == (e || this.cleanGeneration)
      },
      getHistory: function() {
        return {
          done: di(this.history.done),
          undone: di(this.history.undone)
        }
      },
      setHistory: function(e) {
        var t = this.history = new Zr(this.history.maxGeneration);
        t.done = di(e.done.slice(0), null, !0), t.undone = di(e.undone.slice(0), null, !0)
      },
      setGutterMarker: mr(function(e, t, n) {
        return Ri(this, e, "gutter", function(e) {
          var r = e.gutterMarkers || (e.gutterMarkers = {});
          return r[t] = n, !n && C(r) && (e.gutterMarkers = null), !0
        })
      }),
      clearGutter: mr(function(e) {
        var t = this;
        this.iter(function(n) {
          n.gutterMarkers && n.gutterMarkers[e] && Ri(t, n, "gutter", function() {
            return n.gutterMarkers[e] = null, C(n.gutterMarkers) && (n.gutterMarkers = null), !0
          })
        })
      }),
      lineInfo: function(e) {
        var t;
        if ("number" == typeof e) {
          if (!H(this, e)) return null;
          if (t = e, e = T(this, e), !e) return null
        } else if (t = E(e), null == t) return null;
        return {
          line: t,
          handle: e,
          text: e.text,
          gutterMarkers: e.gutterMarkers,
          textClass: e.textClass,
          bgClass: e.bgClass,
          wrapClass: e.wrapClass,
          widgets: e.widgets
        }
      },
      addLineClass: mr(function(t, n, r) {
        return Ri(this, t, "gutter" == n ? "gutter" : "class", function(t) {
          var i = "text" == n ? "textClass" : "background" == n ? "bgClass" : "gutter" == n ? "gutterClass" : "wrapClass";
          if (t[i]) {
            if (e(r).test(t[i])) return !1;
            t[i] += " " + r
          } else t[i] = r;
          return !0
        })
      }),
      removeLineClass: mr(function(t, n, r) {
        return Ri(this, t, "gutter" == n ? "gutter" : "class", function(t) {
          var i = "text" == n ? "textClass" : "background" == n ? "bgClass" : "gutter" == n ? "gutterClass" : "wrapClass",
            o = t[i];
          if (!o) return !1;
          if (null == r) t[i] = null;
          else {
            var l = o.match(e(r));
            if (!l) return !1;
            var a = l.index + l[0].length;
            t[i] = o.slice(0, l.index) + (l.index && a != o.length ? " " : "") + o.slice(a) || null
          }
          return !0
        })
      }),
      addLineWidget: mr(function(e, t, n) {
        return Ui(this, e, t, n)
      }),
      removeLineWidget: function(e) {
        e.clear()
      },
      markText: function(e, t, n) {
        return Gi(this, B(this, e), B(this, t), n, n && n.type || "range")
      },
      setBookmark: function(e, t) {
        var n = {
          replacedWith: t && (null == t.nodeType ? t.widget : t),
          insertLeft: t && t.insertLeft,
          clearWhenEmpty: !1,
          shared: t && t.shared,
          handleMouseEvents: t && t.handleMouseEvents
        };
        return e = B(this, e), Gi(this, e, e, n, "bookmark")
      },
      findMarksAt: function(e) {
        e = B(this, e);
        var t = [],
          n = T(this, e.line).markedSpans;
        if (n)
          for (var r = 0; r < n.length; ++r) {
            var i = n[r];
            (null == i.from || i.from <= e.ch) && (null == i.to || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
          }
        return t
      },
      findMarks: function(e, t, n) {
        e = B(this, e), t = B(this, t);
        var r = [],
          i = e.line;
        return this.iter(e.line, t.line + 1, function(o) {
          var l = o.markedSpans;
          if (l)
            for (var a = 0; a < l.length; a++) {
              var s = l[a];
              null != s.to && i == e.line && e.ch >= s.to || null == s.from && i != e.line || null != s.from && i == t.line && s.from >= t.ch || n && !n(s.marker) || r.push(s.marker.parent || s.marker)
            }++i
        }), r
      },
      getAllMarks: function() {
        var e = [];
        return this.iter(function(t) {
          var n = t.markedSpans;
          if (n)
            for (var r = 0; r < n.length; ++r) null != n[r].from && e.push(n[r].marker)
        }), e
      },
      posFromIndex: function(e) {
        var t, n = this.first,
          r = this.lineSeparator().length;
        return this.iter(function(i) {
          var o = i.text.length + r;
          return o > e ? (t = e, !0) : (e -= o, void++n)
        }), B(this, P(n, t))
      },
      indexFromPos: function(e) {
        e = B(this, e);
        var t = e.ch;
        if (e.line < this.first || e.ch < 0) return 0;
        var n = this.lineSeparator().length;
        return this.iter(this.first, e.line, function(e) {
          t += e.text.length + n
        }), t
      },
      copy: function(e) {
        var t = new Aa(N(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
        return t.scrollTop = this.scrollTop, t.scrollLeft = this.scrollLeft, t.sel = this.sel, t.extend = !1, e && (t.history.undoDepth = this.history.undoDepth, t.setHistory(this.getHistory())), t
      },
      linkedDoc: function(e) {
        e || (e = {});
        var t = this.first,
          n = this.first + this.size;
        null != e.from && e.from > t && (t = e.from), null != e.to && e.to < n && (n = e.to);
        var r = new Aa(N(this, t, n), e.mode || this.modeOption, t, this.lineSep, this.direction);
        return e.sharedHist && (r.history = this.history), (this.linked || (this.linked = [])).push({
          doc: r,
          sharedHist: e.sharedHist
        }), r.linked = [{
          doc: this,
          isParent: !0,
          sharedHist: e.sharedHist
        }], _i(r, Ki(this)), r
      },
      unlinkDoc: function(e) {
        var t = this;
        if (e instanceof zo && (e = e.doc), this.linked)
          for (var n = 0; n < this.linked.length; ++n) {
            var r = t.linked[n];
            if (r.doc == e) {
              t.linked.splice(n, 1), e.unlinkDoc(t), Xi(Ki(t));
              break
            }
          }
        if (e.history == this.history) {
          var i = [e.id];
          $r(e, function(e) {
            return i.push(e.id)
          }, !0), e.history = new Zr(null), e.history.done = di(this.history.done, i), e.history.undone = di(this.history.undone, i)
        }
      },
      iterLinkedDocs: function(e) {
        $r(this, e)
      },
      getMode: function() {
        return this.mode
      },
      getEditor: function() {
        return this.cm
      },
      splitLines: function(e) {
        return this.lineSep ? e.split(this.lineSep) : Ql(e)
      },
      lineSeparator: function() {
        return this.lineSep || "\n"
      },
      setDirection: mr(function(e) {
        "rtl" != e && (e = "ltr"), e != this.direction && (this.direction = e, this.iter(function(e) {
          return e.order = null
        }), this.cm && Qr(this.cm))
      })
    }), Aa.prototype.eachLine = Aa.prototype.iter;
    for (var Ea = 0, Da = !1, Ha = {
        3: "Enter",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        127: "Delete",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
      }, Wa = 0; 10 > Wa; Wa++) Ha[Wa + 48] = Ha[Wa + 96] = String(Wa);
    for (var Pa = 65; 90 >= Pa; Pa++) Ha[Pa] = String.fromCharCode(Pa);
    for (var ja = 1; 12 >= ja; ja++) Ha[ja + 111] = Ha[ja + 63235] = "F" + ja;
    var Ia = {};
    Ia.basic = {
      Left: "goCharLeft",
      Right: "goCharRight",
      Up: "goLineUp",
      Down: "goLineDown",
      End: "goLineEnd",
      Home: "goLineStartSmart",
      PageUp: "goPageUp",
      PageDown: "goPageDown",
      Delete: "delCharAfter",
      Backspace: "delCharBefore",
      "Shift-Backspace": "delCharBefore",
      Tab: "defaultTab",
      "Shift-Tab": "indentAuto",
      Enter: "newlineAndIndent",
      Insert: "toggleOverwrite",
      Esc: "singleSelection"
    }, Ia.pcDefault = {
      "Ctrl-A": "selectAll",
      "Ctrl-D": "deleteLine",
      "Ctrl-Z": "undo",
      "Shift-Ctrl-Z": "redo",
      "Ctrl-Y": "redo",
      "Ctrl-Home": "goDocStart",
      "Ctrl-End": "goDocEnd",
      "Ctrl-Up": "goLineUp",
      "Ctrl-Down": "goLineDown",
      "Ctrl-Left": "goGroupLeft",
      "Ctrl-Right": "goGroupRight",
      "Alt-Left": "goLineStart",
      "Alt-Right": "goLineEnd",
      "Ctrl-Backspace": "delGroupBefore",
      "Ctrl-Delete": "delGroupAfter",
      "Ctrl-S": "save",
      "Ctrl-F": "find",
      "Ctrl-G": "findNext",
      "Shift-Ctrl-G": "findPrev",
      "Shift-Ctrl-F": "replace",
      "Shift-Ctrl-R": "replaceAll",
      "Ctrl-[": "indentLess",
      "Ctrl-]": "indentMore",
      "Ctrl-U": "undoSelection",
      "Shift-Ctrl-U": "redoSelection",
      "Alt-U": "redoSelection",
      fallthrough: "basic"
    }, Ia.emacsy = {
      "Ctrl-F": "goCharRight",
      "Ctrl-B": "goCharLeft",
      "Ctrl-P": "goLineUp",
      "Ctrl-N": "goLineDown",
      "Alt-F": "goWordRight",
      "Alt-B": "goWordLeft",
      "Ctrl-A": "goLineStart",
      "Ctrl-E": "goLineEnd",
      "Ctrl-V": "goPageDown",
      "Shift-Ctrl-V": "goPageUp",
      "Ctrl-D": "delCharAfter",
      "Ctrl-H": "delCharBefore",
      "Alt-D": "delWordAfter",
      "Alt-Backspace": "delWordBefore",
      "Ctrl-K": "killLine",
      "Ctrl-T": "transposeChars",
      "Ctrl-O": "openLine"
    }, Ia.macDefault = {
      "Cmd-A": "selectAll",
      "Cmd-D": "deleteLine",
      "Cmd-Z": "undo",
      "Shift-Cmd-Z": "redo",
      "Cmd-Y": "redo",
      "Cmd-Home": "goDocStart",
      "Cmd-Up": "goDocStart",
      "Cmd-End": "goDocEnd",
      "Cmd-Down": "goDocEnd",
      "Alt-Left": "goGroupLeft",
      "Alt-Right": "goGroupRight",
      "Cmd-Left": "goLineLeft",
      "Cmd-Right": "goLineRight",
      "Alt-Backspace": "delGroupBefore",
      "Ctrl-Alt-Backspace": "delGroupAfter",
      "Alt-Delete": "delGroupAfter",
      "Cmd-S": "save",
      "Cmd-F": "find",
      "Cmd-G": "findNext",
      "Shift-Cmd-G": "findPrev",
      "Cmd-Alt-F": "replace",
      "Shift-Cmd-Alt-F": "replaceAll",
      "Cmd-[": "indentLess",
      "Cmd-]": "indentMore",
      "Cmd-Backspace": "delWrappedLineLeft",
      "Cmd-Delete": "delWrappedLineRight",
      "Cmd-U": "undoSelection",
      "Shift-Cmd-U": "redoSelection",
      "Ctrl-Up": "goDocStart",
      "Ctrl-Down": "goDocEnd",
      fallthrough: ["basic", "emacsy"]
    }, Ia["default"] = kl ? Ia.macDefault : Ia.pcDefault;
    var Fa = {
        selectAll: Ti,
        singleSelection: function(e) {
          return e.setSelection(e.getCursor("anchor"), e.getCursor("head"), Rl)
        },
        killLine: function(e) {
          return uo(e, function(t) {
            if (t.empty()) {
              var n = T(e.doc, t.head.line).text.length;
              return t.head.ch == n && t.head.line < e.lastLine() ? {
                from: t.head,
                to: P(t.head.line + 1, 0)
              } : {
                from: t.head,
                to: P(t.head.line, n)
              }
            }
            return {
              from: t.from(),
              to: t.to()
            }
          })
        },
        deleteLine: function(e) {
          return uo(e, function(t) {
            return {
              from: P(t.from().line, 0),
              to: B(e.doc, P(t.to().line + 1, 0))
            }
          })
        },
        delLineLeft: function(e) {
          return uo(e, function(e) {
            return {
              from: P(e.from().line, 0),
              to: e.from()
            }
          })
        },
        delWrappedLineLeft: function(e) {
          return uo(e, function(t) {
            var n = e.charCoords(t.head, "div").top + 5,
              r = e.coordsChar({
                left: 0,
                top: n
              }, "div");
            return {
              from: r,
              to: t.from()
            }
          })
        },
        delWrappedLineRight: function(e) {
          return uo(e, function(t) {
            var n = e.charCoords(t.head, "div").top + 5,
              r = e.coordsChar({
                left: e.display.lineDiv.offsetWidth + 100,
                top: n
              }, "div");
            return {
              from: t.from(),
              to: r
            }
          })
        },
        undo: function(e) {
          return e.undo()
        },
        redo: function(e) {
          return e.redo()
        },
        undoSelection: function(e) {
          return e.undoSelection()
        },
        redoSelection: function(e) {
          return e.redoSelection()
        },
        goDocStart: function(e) {
          return e.extendSelection(P(e.firstLine(), 0))
        },
        goDocEnd: function(e) {
          return e.extendSelection(P(e.lastLine()))
        },
        goLineStart: function(e) {
          return e.extendSelectionsBy(function(t) {
            return fo(e, t.head.line)
          }, {
            origin: "+move",
            bias: 1
          })
        },
        goLineStartSmart: function(e) {
          return e.extendSelectionsBy(function(t) {
            return po(e, t.head)
          }, {
            origin: "+move",
            bias: 1
          })
        },
        goLineEnd: function(e) {
          return e.extendSelectionsBy(function(t) {
            return ho(e, t.head.line)
          }, {
            origin: "+move",
            bias: -1
          })
        },
        goLineRight: function(e) {
          return e.extendSelectionsBy(function(t) {
            var n = e.charCoords(t.head, "div").top + 5;
            return e.coordsChar({
              left: e.display.lineDiv.offsetWidth + 100,
              top: n
            }, "div")
          }, zl)
        },
        goLineLeft: function(e) {
          return e.extendSelectionsBy(function(t) {
            var n = e.charCoords(t.head, "div").top + 5;
            return e.coordsChar({
              left: 0,
              top: n
            }, "div")
          }, zl)
        },
        goLineLeftSmart: function(e) {
          return e.extendSelectionsBy(function(t) {
            var n = e.charCoords(t.head, "div").top + 5,
              r = e.coordsChar({
                left: 0,
                top: n
              }, "div");
            return r.ch < e.getLine(r.line).search(/\S/) ? po(e, t.head) : r
          }, zl)
        },
        goLineUp: function(e) {
          return e.moveV(-1, "line")
        },
        goLineDown: function(e) {
          return e.moveV(1, "line")
        },
        goPageUp: function(e) {
          return e.moveV(-1, "page")
        },
        goPageDown: function(e) {
          return e.moveV(1, "page")
        },
        goCharLeft: function(e) {
          return e.moveH(-1, "char")
        },
        goCharRight: function(e) {
          return e.moveH(1, "char")
        },
        goColumnLeft: function(e) {
          return e.moveH(-1, "column")
        },
        goColumnRight: function(e) {
          return e.moveH(1, "column")
        },
        goWordLeft: function(e) {
          return e.moveH(-1, "word")
        },
        goGroupRight: function(e) {
          return e.moveH(1, "group")
        },
        goGroupLeft: function(e) {
          return e.moveH(-1, "group")
        },
        goWordRight: function(e) {
          return e.moveH(1, "word")
        },
        delCharBefore: function(e) {
          return e.deleteH(-1, "char")
        },
        delCharAfter: function(e) {
          return e.deleteH(1, "char")
        },
        delWordBefore: function(e) {
          return e.deleteH(-1, "word")
        },
        delWordAfter: function(e) {
          return e.deleteH(1, "word")
        },
        delGroupBefore: function(e) {
          return e.deleteH(-1, "group")
        },
        delGroupAfter: function(e) {
          return e.deleteH(1, "group")
        },
        indentAuto: function(e) {
          return e.indentSelection("smart")
        },
        indentMore: function(e) {
          return e.indentSelection("add")
        },
        indentLess: function(e) {
          return e.indentSelection("subtract")
        },
        insertTab: function(e) {
          return e.replaceSelection("	")
        },
        insertSoftTab: function(e) {
          for (var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0; i < n.length; i++) {
            var o = n[i].from(),
              l = d(e.getLine(o.line), o.ch, r);
            t.push(p(r - l % r))
          }
          e.replaceSelections(t)
        },
        defaultTab: function(e) {
          e.somethingSelected() ? e.indentSelection("add") : e.execCommand("insertTab")
        },
        transposeChars: function(e) {
          return fr(e, function() {
            for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++)
              if (t[r].empty()) {
                var i = t[r].head,
                  o = T(e.doc, i.line).text;
                if (o)
                  if (i.ch == o.length && (i = new P(i.line, i.ch - 1)), i.ch > 0) i = new P(i.line, i.ch + 1), e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), P(i.line, i.ch - 2), i, "+transpose");
                  else if (i.line > e.doc.first) {
                  var l = T(e.doc, i.line - 1).text;
                  l && (i = new P(i.line, 1), e.replaceRange(o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1), P(i.line - 1, l.length - 1), i, "+transpose"))
                }
                n.push(new La(i, i))
              }
            e.setSelections(n)
          })
        },
        newlineAndIndent: function(e) {
          return fr(e, function() {
            for (var t = e.listSelections(), n = t.length - 1; n >= 0; n--) e.replaceRange(e.doc.lineSeparator(), t[n].anchor, t[n].head, "+input");
            t = e.listSelections();
            for (var r = 0; r < t.length; r++) e.indentLine(t[r].from().line, null, !0);
            Kn(e)
          })
        },
        openLine: function(e) {
          return e.replaceSelection("\n", "start")
        },
        toggleOverwrite: function(e) {
          return e.toggleOverwrite()
        }
      },
      Ra = new Wl,
      qa = null,
      za = 400,
      Ba = function(e, t, n) {
        this.time = e, this.pos = t, this.button = n
      };
    Ba.prototype.compare = function(e, t, n) {
      return this.time + za > e && 0 == j(t, this.pos) && n == this.button
    };
    var Ua, Ga, Va = {
        toString: function() {
          return "CodeMirror.Init"
        }
      },
      Ka = {},
      _a = {};
    zo.defaults = Ka, zo.optionHandlers = _a;
    var Xa = [];
    zo.defineInitHook = function(e) {
      return Xa.push(e)
    };
    var $a = null,
      Ya = function(e) {
        var t = e.optionHandlers,
          n = e.helpers = {};
        e.prototype = {
          constructor: e,
          focus: function() {
            window.focus(), this.display.input.focus()
          },
          setOption: function(e, n) {
            var r = this.options,
              i = r[e];
            (r[e] != n || "mode" == e) && (r[e] = n, t.hasOwnProperty(e) && hr(this, t[e])(this, n, i), Ae(this, "optionChange", this, e))
          },
          getOption: function(e) {
            return this.options[e]
          },
          getDoc: function() {
            return this.doc
          },
          addKeyMap: function(e, t) {
            this.state.keyMaps[t ? "push" : "unshift"](co(e))
          },
          removeKeyMap: function(e) {
            for (var t = this.state.keyMaps, n = 0; n < t.length; ++n)
              if (t[n] == e || t[n].name == e) return t.splice(n, 1), !0
          },
          addOverlay: pr(function(t, n) {
            var r = t.token ? t : e.getMode(this.options, t);
            if (r.startState) throw new Error("Overlays may not be stateful.");
            v(this.state.overlays, {
              mode: r,
              modeSpec: t,
              opaque: n && n.opaque,
              priority: n && n.priority || 0
            }, function(e) {
              return e.priority
            }), this.state.modeGen++, gr(this)
          }),
          removeOverlay: pr(function(e) {
            for (var t = this, n = this.state.overlays, r = 0; r < n.length; ++r) {
              var i = n[r].modeSpec;
              if (i == e || "string" == typeof e && i.name == e) return n.splice(r, 1), t.state.modeGen++, void gr(t)
            }
          }),
          indentLine: pr(function(e, t, n) {
            "string" != typeof t && "number" != typeof t && (t = null == t ? this.options.smartIndent ? "smart" : "prev" : t ? "add" : "subtract"), H(this.doc, e) && Uo(this, e, t, n)
          }),
          indentSelection: pr(function(e) {
            for (var t = this, n = this.doc.sel.ranges, r = -1, i = 0; i < n.length; i++) {
              var o = n[i];
              if (o.empty()) o.head.line > r && (Uo(t, o.head.line, e, !0), r = o.head.line, i == t.doc.sel.primIndex && Kn(t));
              else {
                var l = o.from(),
                  a = o.to(),
                  s = Math.max(r, l.line);
                r = Math.min(t.lastLine(), a.line - (a.ch ? 0 : 1)) + 1;
                for (var c = s; r > c; ++c) Uo(t, c, e);
                var u = t.doc.sel.ranges;
                0 == l.ch && n.length == u.length && u[i].from().ch > 0 && mi(t.doc, i, new La(l, u[i].to()), Rl)
              }
            }
          }),
          getTokenAt: function(e, t) {
            return it(this, e, t)
          },
          getLineTokens: function(e, t) {
            return it(this, P(e), t, !0)
          },
          getTokenTypeAt: function(e) {
            e = B(this.doc, e);
            var t, n = Ze(this, T(this.doc, e.line)),
              r = 0,
              i = (n.length - 1) / 2,
              o = e.ch;
            if (0 == o) t = n[2];
            else
              for (;;) {
                var l = r + i >> 1;
                if ((l ? n[2 * l - 1] : 0) >= o) i = l;
                else {
                  if (!(n[2 * l + 1] < o)) {
                    t = n[2 * l + 2];
                    break
                  }
                  r = l + 1
                }
              }
            var a = t ? t.indexOf("overlay ") : -1;
            return 0 > a ? t : 0 == a ? null : t.slice(0, a - 1)
          },
          getModeAt: function(t) {
            var n = this.doc.mode;
            return n.innerMode ? e.innerMode(n, this.getTokenAt(t).state).mode : n
          },
          getHelper: function(e, t) {
            return this.getHelpers(e, t)[0]
          },
          getHelpers: function(e, t) {
            var r = this,
              i = [];
            if (!n.hasOwnProperty(t)) return i;
            var o = n[t],
              l = this.getModeAt(e);
            if ("string" == typeof l[t]) o[l[t]] && i.push(o[l[t]]);
            else if (l[t])
              for (var a = 0; a < l[t].length; a++) {
                var s = o[l[t][a]];
                s && i.push(s)
              } else l.helperType && o[l.helperType] ? i.push(o[l.helperType]) : o[l.name] && i.push(o[l.name]);
            for (var c = 0; c < o._global.length; c++) {
              var u = o._global[c];
              u.pred(l, r) && -1 == f(i, u.val) && i.push(u.val)
            }
            return i
          },
          getStateAfter: function(e, t) {
            var n = this.doc;
            return e = z(n, null == e ? n.first + n.size - 1 : e), et(this, e + 1, t).state
          },
          cursorCoords: function(e, t) {
            var n, r = this.doc.sel.primary();
            return n = null == e ? r.head : "object" == typeof e ? B(this.doc, e) : e ? r.from() : r.to(), fn(this, n, t || "page")
          },
          charCoords: function(e, t) {
            return dn(this, B(this.doc, e), t || "page")
          },
          coordsChar: function(e, t) {
            return e = un(this, e, t || "page"), mn(this, e.left, e.top)
          },
          lineAtHeight: function(e, t) {
            return e = un(this, {
              top: e,
              left: 0
            }, t || "page").top, D(this.doc, e + this.display.viewOffset)
          },
          heightAtLine: function(e, t, n) {
            var r, i = !1;
            if ("number" == typeof e) {
              var o = this.doc.first + this.doc.size - 1;
              e < this.doc.first ? e = this.doc.first : e > o && (e = o, i = !0), r = T(this.doc, e)
            } else r = e;
            return cn(this, r, {
              top: 0,
              left: 0
            }, t || "page", n || i).top + (i ? this.doc.height - ye(r) : 0)
          },
          defaultTextHeight: function() {
            return xn(this.display)
          },
          defaultCharWidth: function() {
            return bn(this.display)
          },
          getViewport: function() {
            return {
              from: this.display.viewFrom,
              to: this.display.viewTo
            }
          },
          addWidget: function(e, t, n, r, i) {
            var o = this.display;
            e = fn(this, B(this.doc, e));
            var l = e.bottom,
              a = e.left;
            if (t.style.position = "absolute", t.setAttribute("cm-ignore-events", "true"), this.display.input.setUneditable(t), o.sizer.appendChild(t), "over" == r) l = e.top;
            else if ("above" == r || "near" == r) {
              var s = Math.max(o.wrapper.clientHeight, this.doc.height),
                c = Math.max(o.sizer.clientWidth, o.lineSpace.clientWidth);
              ("above" == r || e.bottom + t.offsetHeight > s) && e.top > t.offsetHeight ? l = e.top - t.offsetHeight : e.bottom + t.offsetHeight <= s && (l = e.bottom), a + t.offsetWidth > c && (a = c - t.offsetWidth)
            }
            t.style.top = l + "px", t.style.left = t.style.right = "", "right" == i ? (a = o.sizer.clientWidth - t.offsetWidth, t.style.right = "0px") : ("left" == i ? a = 0 : "middle" == i && (a = (o.sizer.clientWidth - t.offsetWidth) / 2), t.style.left = a + "px"), n && Un(this, {
              left: a,
              top: l,
              right: a + t.offsetWidth,
              bottom: l + t.offsetHeight
            })
          },
          triggerOnKeyDown: pr(bo),
          triggerOnKeyPress: pr(So),
          triggerOnKeyUp: Co,
          triggerOnMouseDown: pr(ko),
          execCommand: function(e) {
            return Fa.hasOwnProperty(e) ? Fa[e].call(null, this) : void 0
          },
          triggerElectric: pr(function(e) {
            _o(this, e)
          }),
          findPosH: function(e, t, n, r) {
            var i = this,
              o = 1;
            0 > t && (o = -1, t = -t);
            for (var l = B(this.doc, e), a = 0; t > a && (l = Jo(i.doc, l, o, n, r), !l.hitSide); ++a);
            return l
          },
          moveH: pr(function(e, t) {
            var n = this;
            this.extendSelectionsBy(function(r) {
              return n.display.shift || n.doc.extend || r.empty() ? Jo(n.doc, r.head, e, t, n.options.rtlMoveVisually) : 0 > e ? r.from() : r.to()
            }, zl)
          }),
          deleteH: pr(function(e, t) {
            var n = this.doc.sel,
              r = this.doc;
            n.somethingSelected() ? r.replaceSelection("", null, "+delete") : uo(this, function(n) {
              var i = Jo(r, n.head, e, t, !1);
              return 0 > e ? {
                from: i,
                to: n.head
              } : {
                from: n.head,
                to: i
              }
            })
          }),
          findPosV: function(e, t, n, r) {
            var i = this,
              o = 1,
              l = r;
            0 > t && (o = -1, t = -t);
            for (var a = B(this.doc, e), s = 0; t > s; ++s) {
              var c = fn(i, a, "div");
              if (null == l ? l = c.left : c.left = l, a = Qo(i, c, o, n), a.hitSide) break
            }
            return a
          },
          moveV: pr(function(e, t) {
            var n = this,
              r = this.doc,
              i = [],
              o = !this.display.shift && !r.extend && r.sel.somethingSelected();
            if (r.extendSelectionsBy(function(l) {
                if (o) return 0 > e ? l.from() : l.to();
                var a = fn(n, l.head, "div");
                null != l.goalColumn && (a.left = l.goalColumn), i.push(a.left);
                var s = Qo(n, a, e, t);
                return "page" == t && l == r.sel.primary() && Vn(n, dn(n, s, "div").top - a.top), s
              }, zl), i.length)
              for (var l = 0; l < r.sel.ranges.length; l++) r.sel.ranges[l].goalColumn = i[l]
          }),
          findWordAt: function(e) {
            var t = this.doc,
              n = T(t, e.line).text,
              r = e.ch,
              i = e.ch;
            if (n) {
              var o = this.getHelper(e, "wordChars");
              "before" != e.sticky && i != n.length || !r ? ++i : --r;
              for (var l = n.charAt(r), a = w(l, o) ? function(e) {
                  return w(e, o)
                } : /\s/.test(l) ? function(e) {
                  return /\s/.test(e)
                } : function(e) {
                  return !/\s/.test(e) && !w(e)
                }; r > 0 && a(n.charAt(r - 1));) --r;
              for (; i < n.length && a(n.charAt(i));) ++i
            }
            return new La(P(e.line, r), P(e.line, i))
          },
          toggleOverwrite: function(e) {
            (null == e || e != this.state.overwrite) && ((this.state.overwrite = !this.state.overwrite) ? a(this.display.cursorDiv, "CodeMirror-overwrite") : Dl(this.display.cursorDiv, "CodeMirror-overwrite"), Ae(this, "overwriteToggle", this, this.state.overwrite))
          },
          hasFocus: function() {
            return this.display.input.getField() == l()
          },
          isReadOnly: function() {
            return !(!this.options.readOnly && !this.doc.cantEdit)
          },
          scrollTo: pr(function(e, t) {
            _n(this, e, t)
          }),
          getScrollInfo: function() {
            var e = this.display.scroller;
            return {
              left: e.scrollLeft,
              top: e.scrollTop,
              height: e.scrollHeight - Ut(this) - this.display.barHeight,
              width: e.scrollWidth - Ut(this) - this.display.barWidth,
              clientHeight: Vt(this),
              clientWidth: Gt(this)
            }
          },
          scrollIntoView: pr(function(e, t) {
            null == e ? (e = {
              from: this.doc.sel.primary().head,
              to: null
            }, null == t && (t = this.options.cursorScrollMargin)) : "number" == typeof e ? e = {
              from: P(e, 0),
              to: null
            } : null == e.from && (e = {
              from: e,
              to: null
            }), e.to || (e.to = e.from), e.margin = t || 0, null != e.from.line ? Xn(this, e) : Yn(this, e.from, e.to, e.margin)
          }),
          setSize: pr(function(e, t) {
            var n = this,
              r = function(e) {
                return "number" == typeof e || /^\d+$/.test(String(e)) ? e + "px" : e
              };
            null != e && (this.display.wrapper.style.width = r(e)), null != t && (this.display.wrapper.style.height = r(t)), this.options.lineWrapping && on(this);
            var i = this.display.viewFrom;
            this.doc.iter(i, this.display.viewTo, function(e) {
              if (e.widgets)
                for (var t = 0; t < e.widgets.length; t++)
                  if (e.widgets[t].noHScroll) {
                    vr(n, i, "widget");
                    break
                  }++i
            }), this.curOp.forceUpdate = !0, Ae(this, "refresh", this)
          }),
          operation: function(e) {
            return fr(this, e)
          },
          refresh: pr(function() {
            var e = this.display.cachedTextHeight;
            gr(this), this.curOp.forceUpdate = !0, ln(this), _n(this, this.doc.scrollLeft, this.doc.scrollTop), Er(this), (null == e || Math.abs(e - xn(this.display)) > .5) && Ln(this), Ae(this, "refresh", this)
          }),
          swapDoc: pr(function(e) {
            var t = this.doc;
            return t.cm = null, Yr(this, e), ln(this), this.display.input.reset(), _n(this, e.scrollLeft, e.scrollTop), this.curOp.forceScroll = !0, Lt(this, "swapDoc", this, t), t
          }),
          getInputField: function() {
            return this.display.input.getField()
          },
          getWrapperElement: function() {
            return this.display.wrapper
          },
          getScrollerElement: function() {
            return this.display.scroller
          },
          getGutterElement: function() {
            return this.display.gutters
          }
        }, We(e), e.registerHelper = function(t, r, i) {
          n.hasOwnProperty(t) || (n[t] = e[t] = {
            _global: []
          }), n[t][r] = i
        }, e.registerGlobalHelper = function(t, r, i, o) {
          e.registerHelper(t, r, o), n[t]._global.push({
            pred: i,
            val: o
          })
        }
      },
      Ja = function(e) {
        this.cm = e, this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null, this.polling = new Wl, this.composing = null, this.gracePeriod = !1, this.readDOMTimeout = null
      };
    Ja.prototype.init = function(e) {
      function t(e) {
        if (!Ee(i, e)) {
          if (i.somethingSelected()) Go({
            lineWise: !1,
            text: i.getSelections()
          }), "cut" == e.type && i.replaceSelection("", null, "cut");
          else {
            if (!i.options.lineWiseCopyCut) return;
            var t = Xo(i);
            Go({
              lineWise: !0,
              text: t.text
            }), "cut" == e.type && i.operation(function() {
              i.setSelections(t.ranges, 0, Rl), i.replaceSelection("", null, "cut")
            })
          }
          if (e.clipboardData) {
            e.clipboardData.clearData();
            var n = $a.text.join("\n");
            if (e.clipboardData.setData("Text", n), e.clipboardData.getData("Text") == n) return void e.preventDefault()
          }
          var l = Yo(),
            a = l.firstChild;
          i.display.lineSpace.insertBefore(l, i.display.lineSpace.firstChild), a.value = $a.text.join("\n");
          var s = document.activeElement;
          Hl(a), setTimeout(function() {
            i.display.lineSpace.removeChild(l), s.focus(), s == o && r.showPrimarySelection()
          }, 50)
        }
      }
      var n = this,
        r = this,
        i = r.cm,
        o = r.div = e.lineDiv;
      $o(o, i.options.spellcheck), Yl(o, "paste", function(e) {
        Ee(i, e) || Ko(e, i) || 11 >= pl && setTimeout(hr(i, function() {
          return n.updateFromDOM()
        }), 20)
      }), Yl(o, "compositionstart", function(e) {
        n.composing = {
          data: e.data,
          done: !1
        }
      }), Yl(o, "compositionupdate", function(e) {
        n.composing || (n.composing = {
          data: e.data,
          done: !1
        })
      }), Yl(o, "compositionend", function(e) {
        n.composing && (e.data != n.composing.data && n.readFromDOMSoon(), n.composing.done = !0)
      }), Yl(o, "touchstart", function() {
        return r.forceCompositionEnd()
      }), Yl(o, "input", function() {
        n.composing || n.readFromDOMSoon()
      }), Yl(o, "copy", t), Yl(o, "cut", t)
    }, Ja.prototype.prepareSelection = function() {
      var e = On(this.cm, !1);
      return e.focus = this.cm.state.focused, e
    }, Ja.prototype.showSelection = function(e, t) {
      e && this.cm.display.view.length && ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e))
    }, Ja.prototype.showPrimarySelection = function() {
      var e = window.getSelection(),
        t = this.cm,
        n = t.doc.sel.primary(),
        r = n.from(),
        i = n.to();
      if (t.display.viewTo == t.display.viewFrom || r.line >= t.display.viewTo || i.line < t.display.viewFrom) return void e.removeAllRanges();
      var o = rl(t, e.anchorNode, e.anchorOffset),
        l = rl(t, e.focusNode, e.focusOffset);
      if (!o || o.bad || !l || l.bad || 0 != j(q(o, l), r) || 0 != j(R(o, l), i)) {
        var a = t.display.view,
          s = r.line >= t.display.viewFrom && Zo(t, r) || {
            node: a[0].measure.map[2],
            offset: 0
          },
          c = i.line < t.display.viewTo && Zo(t, i);
        if (!c) {
          var u = a[a.length - 1].measure,
            d = u.maps ? u.maps[u.maps.length - 1] : u.map;
          c = {
            node: d[d.length - 1],
            offset: d[d.length - 2] - d[d.length - 3]
          }
        }
        if (!s || !c) return void e.removeAllRanges();
        var f, h = e.rangeCount && e.getRangeAt(0);
        try {
          f = Nl(s.node, s.offset, c.offset, c.node)
        } catch (p) {}
        f && (!cl && t.state.focused ? (e.collapse(s.node, s.offset), f.collapsed || (e.removeAllRanges(), e.addRange(f))) : (e.removeAllRanges(), e.addRange(f)), h && null == e.anchorNode ? e.addRange(h) : cl && this.startGracePeriod()), this.rememberSelection()
      }
    }, Ja.prototype.startGracePeriod = function() {
      var e = this;
      clearTimeout(this.gracePeriod), this.gracePeriod = setTimeout(function() {
        e.gracePeriod = !1, e.selectionChanged() && e.cm.operation(function() {
          return e.cm.curOp.selectionChanged = !0
        })
      }, 20)
    }, Ja.prototype.showMultipleSelections = function(e) {
      n(this.cm.display.cursorDiv, e.cursors), n(this.cm.display.selectionDiv, e.selection)
    }, Ja.prototype.rememberSelection = function() {
      var e = window.getSelection();
      this.lastAnchorNode = e.anchorNode, this.lastAnchorOffset = e.anchorOffset, this.lastFocusNode = e.focusNode, this.lastFocusOffset = e.focusOffset
    }, Ja.prototype.selectionInEditor = function() {
      var e = window.getSelection();
      if (!e.rangeCount) return !1;
      var t = e.getRangeAt(0).commonAncestorContainer;
      return o(this.div, t)
    }, Ja.prototype.focus = function() {
      "nocursor" != this.cm.options.readOnly && (this.selectionInEditor() || this.showSelection(this.prepareSelection(), !0), this.div.focus())
    }, Ja.prototype.blur = function() {
      this.div.blur()
    }, Ja.prototype.getField = function() {
      return this.div
    }, Ja.prototype.supportsTouch = function() {
      return !0
    }, Ja.prototype.receivedFocus = function() {
      function e() {
        t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, e))
      }
      var t = this;
      this.selectionInEditor() ? this.pollSelection() : fr(this.cm, function() {
        return t.cm.curOp.selectionChanged = !0
      }), this.polling.set(this.cm.options.pollInterval, e)
    }, Ja.prototype.selectionChanged = function() {
      var e = window.getSelection();
      return e.anchorNode != this.lastAnchorNode || e.anchorOffset != this.lastAnchorOffset || e.focusNode != this.lastFocusNode || e.focusOffset != this.lastFocusOffset
    }, Ja.prototype.pollSelection = function() {
      if (null == this.readDOMTimeout && !this.gracePeriod && this.selectionChanged()) {
        var e = window.getSelection(),
          t = this.cm;
        if (Sl && vl && this.cm.options.gutters.length && el(e.anchorNode)) return this.cm.triggerOnKeyDown({
          type: "keydown",
          keyCode: 8,
          preventDefault: Math.abs
        }), this.blur(), void this.focus();
        if (!this.composing) {
          this.rememberSelection();
          var n = rl(t, e.anchorNode, e.anchorOffset),
            r = rl(t, e.focusNode, e.focusOffset);
          n && r && fr(t, function() {
            xi(t.doc, Rr(n, r), Rl), (n.bad || r.bad) && (t.curOp.selectionChanged = !0)
          })
        }
      }
    }, Ja.prototype.pollContent = function() {
      null != this.readDOMTimeout && (clearTimeout(this.readDOMTimeout), this.readDOMTimeout = null);
      var e = this.cm,
        t = e.display,
        n = e.doc.sel.primary(),
        r = n.from(),
        i = n.to();
      if (0 == r.ch && r.line > e.firstLine() && (r = P(r.line - 1, T(e.doc, r.line - 1).length)), i.ch == T(e.doc, i.line).text.length && i.line < e.lastLine() && (i = P(i.line + 1, 0)), r.line < t.viewFrom || i.line > t.viewTo - 1) return !1;
      var o, l, a;
      r.line == t.viewFrom || 0 == (o = Mn(e, r.line)) ? (l = E(t.view[0].line), a = t.view[0].node) : (l = E(t.view[o].line), a = t.view[o - 1].node.nextSibling);
      var s, c, u = Mn(e, i.line);
      if (u == t.view.length - 1 ? (s = t.viewTo - 1, c = t.lineDiv.lastChild) : (s = E(t.view[u + 1].line) - 1, c = t.view[u + 1].node.previousSibling), !a) return !1;
      for (var d = e.doc.splitLines(nl(e, a, c, l, s)), f = O(e.doc, P(l, 0), P(s, T(e.doc, s).text.length)); d.length > 1 && f.length > 1;)
        if (m(d) == m(f)) d.pop(), f.pop(), s--;
        else {
          if (d[0] != f[0]) break;
          d.shift(), f.shift(), l++
        }
      for (var h = 0, p = 0, g = d[0], v = f[0], y = Math.min(g.length, v.length); y > h && g.charCodeAt(h) == v.charCodeAt(h);) ++h;
      for (var x = m(d), b = m(f), w = Math.min(x.length - (1 == d.length ? h : 0), b.length - (1 == f.length ? h : 0)); w > p && x.charCodeAt(x.length - p - 1) == b.charCodeAt(b.length - p - 1);) ++p;
      if (1 == d.length && 1 == f.length && l == r.line)
        for (; h && h > r.ch && x.charCodeAt(x.length - p - 1) == b.charCodeAt(b.length - p - 1);) h--, p++;
      d[d.length - 1] = x.slice(0, x.length - p).replace(/^\u200b+/, ""), d[0] = d[0].slice(h).replace(/\u200b+$/, "");
      var C = P(l, h),
        S = P(s, f.length ? m(f).length - p : 0);
      return d.length > 1 || d[0] || j(C, S) ? (Pi(e.doc, d, C, S, "+input"), !0) : void 0
    }, Ja.prototype.ensurePolled = function() {
      this.forceCompositionEnd()
    }, Ja.prototype.reset = function() {
      this.forceCompositionEnd()
    }, Ja.prototype.forceCompositionEnd = function() {
      this.composing && (clearTimeout(this.readDOMTimeout), this.composing = null, this.updateFromDOM(), this.div.blur(), this.div.focus())
    }, Ja.prototype.readFromDOMSoon = function() {
      var e = this;
      null == this.readDOMTimeout && (this.readDOMTimeout = setTimeout(function() {
        if (e.readDOMTimeout = null, e.composing) {
          if (!e.composing.done) return;
          e.composing = null
        }
        e.updateFromDOM()
      }, 80))
    }, Ja.prototype.updateFromDOM = function() {
      var e = this;
      (this.cm.isReadOnly() || !this.pollContent()) && fr(this.cm, function() {
        return gr(e.cm)
      })
    }, Ja.prototype.setUneditable = function(e) {
      e.contentEditable = "false"
    }, Ja.prototype.onKeyPress = function(e) {
      0 != e.charCode && (e.preventDefault(), this.cm.isReadOnly() || hr(this.cm, Vo)(this.cm, String.fromCharCode(null == e.charCode ? e.keyCode : e.charCode), 0))
    }, Ja.prototype.readOnlyChanged = function(e) {
      this.div.contentEditable = String("nocursor" != e)
    }, Ja.prototype.onContextMenu = function() {}, Ja.prototype.resetPosition = function() {}, Ja.prototype.needsContentAttribute = !0;
    var Qa = function(e) {
      this.cm = e, this.prevInput = "", this.pollingFast = !1, this.polling = new Wl, this.inaccurateSelection = !1, this.hasSelection = !1, this.composing = null
    };
    Qa.prototype.init = function(e) {
      function t(e) {
        if (!Ee(i, e)) {
          if (i.somethingSelected()) Go({
            lineWise: !1,
            text: i.getSelections()
          }), r.inaccurateSelection && (r.prevInput = "", r.inaccurateSelection = !1, l.value = $a.text.join("\n"), Hl(l));
          else {
            if (!i.options.lineWiseCopyCut) return;
            var t = Xo(i);
            Go({
              lineWise: !0,
              text: t.text
            }), "cut" == e.type ? i.setSelections(t.ranges, null, Rl) : (r.prevInput = "", l.value = t.text.join("\n"), Hl(l))
          }
          "cut" == e.type && (i.state.cutIncoming = !0)
        }
      }
      var n = this,
        r = this,
        i = this.cm,
        o = this.wrapper = Yo(),
        l = this.textarea = o.firstChild;
      e.wrapper.insertBefore(o, e.wrapper.firstChild), Cl && (l.style.width = "0px"), Yl(l, "input", function() {
        hl && pl >= 9 && n.hasSelection && (n.hasSelection = null), r.poll()
      }), Yl(l, "paste", function(e) {
        Ee(i, e) || Ko(e, i) || (i.state.pasteIncoming = !0, r.fastPoll())
      }), Yl(l, "cut", t), Yl(l, "copy", t), Yl(e.scroller, "paste", function(t) {
        Rt(e, t) || Ee(i, t) || (i.state.pasteIncoming = !0, r.focus())
      }), Yl(e.lineSpace, "selectstart", function(t) {
        Rt(e, t) || Pe(t)
      }), Yl(l, "compositionstart", function() {
        var e = i.getCursor("from");
        r.composing && r.composing.range.clear(), r.composing = {
          start: e,
          range: i.markText(e, i.getCursor("to"), {
            className: "CodeMirror-composing"
          })
        }
      }), Yl(l, "compositionend", function() {
        r.composing && (r.poll(), r.composing.range.clear(), r.composing = null)
      })
    }, Qa.prototype.prepareSelection = function() {
      var e = this.cm,
        t = e.display,
        n = e.doc,
        r = On(e);
      if (e.options.moveInputWithCursor) {
        var i = fn(e, n.sel.primary().head, "div"),
          o = t.wrapper.getBoundingClientRect(),
          l = t.lineDiv.getBoundingClientRect();
        r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + l.top - o.top)), r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + l.left - o.left))
      }
      return r
    }, Qa.prototype.showSelection = function(e) {
      var t = this.cm,
        r = t.display;
      n(r.cursorDiv, e.cursors), n(r.selectionDiv, e.selection), null != e.teTop && (this.wrapper.style.top = e.teTop + "px", this.wrapper.style.left = e.teLeft + "px")
    }, Qa.prototype.reset = function(e) {
      if (!this.contextMenuPending && !this.composing) {
        var t, n, r = this.cm,
          i = r.doc;
        if (r.somethingSelected()) {
          this.prevInput = "";
          var o = i.sel.primary();
          t = ea && (o.to().line - o.from().line > 100 || (n = r.getSelection()).length > 1e3);
          var l = t ? "-" : n || r.getSelection();
          this.textarea.value = l, r.state.focused && Hl(this.textarea), hl && pl >= 9 && (this.hasSelection = l)
        } else e || (this.prevInput = this.textarea.value = "", hl && pl >= 9 && (this.hasSelection = null));
        this.inaccurateSelection = t
      }
    }, Qa.prototype.getField = function() {
      return this.textarea
    }, Qa.prototype.supportsTouch = function() {
      return !1
    }, Qa.prototype.focus = function() {
      if ("nocursor" != this.cm.options.readOnly && (!Ll || l() != this.textarea)) try {
        this.textarea.focus()
      } catch (e) {}
    }, Qa.prototype.blur = function() {
      this.textarea.blur()
    }, Qa.prototype.resetPosition = function() {
      this.wrapper.style.top = this.wrapper.style.left = 0
    }, Qa.prototype.receivedFocus = function() {
      this.slowPoll()
    }, Qa.prototype.slowPoll = function() {
      var e = this;
      this.pollingFast || this.polling.set(this.cm.options.pollInterval, function() {
        e.poll(), e.cm.state.focused && e.slowPoll()
      })
    }, Qa.prototype.fastPoll = function() {
      function e() {
        var r = n.poll();
        r || t ? (n.pollingFast = !1, n.slowPoll()) : (t = !0, n.polling.set(60, e))
      }
      var t = !1,
        n = this;
      n.pollingFast = !0, n.polling.set(20, e)
    }, Qa.prototype.poll = function() {
      var e = this,
        t = this.cm,
        n = this.textarea,
        r = this.prevInput;
      if (this.contextMenuPending || !t.state.focused || Zl(n) && !r && !this.composing || t.isReadOnly() || t.options.disableInput || t.state.keySeq) return !1;
      var i = n.value;
      if (i == r && !t.somethingSelected()) return !1;
      if (hl && pl >= 9 && this.hasSelection === i || kl && /[\uf700-\uf7ff]/.test(i)) return t.display.input.reset(), !1;
      if (t.doc.sel == t.display.selForContextMenu) {
        var o = i.charCodeAt(0);
        if (8203 != o || r || (r = "\u200b"), 8666 == o) return this.reset(), this.cm.execCommand("undo")
      }
      for (var l = 0, a = Math.min(r.length, i.length); a > l && r.charCodeAt(l) == i.charCodeAt(l);) ++l;
      return fr(t, function() {
        Vo(t, i.slice(l), r.length - l, null, e.composing ? "*compose" : null), i.length > 1e3 || i.indexOf("\n") > -1 ? n.value = e.prevInput = "" : e.prevInput = i, e.composing && (e.composing.range.clear(), e.composing.range = t.markText(e.composing.start, t.getCursor("to"), {
          className: "CodeMirror-composing"
        }))
      }), !0
    }, Qa.prototype.ensurePolled = function() {
      this.pollingFast && this.poll() && (this.pollingFast = !1)
    }, Qa.prototype.onKeyPress = function() {
      hl && pl >= 9 && (this.hasSelection = null), this.fastPoll()
    }, Qa.prototype.onContextMenu = function(e) {
      function t() {
        if (null != l.selectionStart) {
          var e = i.somethingSelected(),
            t = "\u200b" + (e ? l.value : "");
          l.value = "\u21da", l.value = t, r.prevInput = e ? "" : "\u200b", l.selectionStart = 1, l.selectionEnd = t.length, o.selForContextMenu = i.doc.sel
        }
      }

      function n() {
        if (r.contextMenuPending = !1, r.wrapper.style.cssText = d, l.style.cssText = u, hl && 9 > pl && o.scrollbars.setScrollTop(o.scroller.scrollTop = s), null != l.selectionStart) {
          (!hl || hl && 9 > pl) && t();
          var e = 0,
            n = function() {
              o.selForContextMenu == i.doc.sel && 0 == l.selectionStart && l.selectionEnd > 0 && "\u200b" == r.prevInput ? hr(i, Ti)(i) : e++ < 10 ? o.detectingSelectAll = setTimeout(n, 500) : (o.selForContextMenu = null, o.input.reset())
            };
          o.detectingSelectAll = setTimeout(n, 200)
        }
      }
      var r = this,
        i = r.cm,
        o = i.display,
        l = r.textarea,
        a = kn(i, e),
        s = o.scroller.scrollTop;
      if (a && !yl) {
        var c = i.options.resetSelectionOnContextMenu;
        c && -1 == i.doc.sel.contains(a) && hr(i, xi)(i.doc, Rr(a), Rl);
        var u = l.style.cssText,
          d = r.wrapper.style.cssText;
        r.wrapper.style.cssText = "position: absolute";
        var f = r.wrapper.getBoundingClientRect();
        l.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - f.top - 5) + "px; left: " + (e.clientX - f.left - 5) + "px;\n      z-index: 1000; background: " + (hl ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var h;
        if (ml && (h = window.scrollY), o.input.focus(), ml && window.scrollTo(null, h), o.input.reset(), i.somethingSelected() || (l.value = r.prevInput = " "), r.contextMenuPending = !0, o.selForContextMenu = i.doc.sel, clearTimeout(o.detectingSelectAll), hl && pl >= 9 && t(), El) {
          Fe(e);
          var p = function() {
            Ne(window, "mouseup", p), setTimeout(n, 20)
          };
          Yl(window, "mouseup", p)
        } else setTimeout(n, 50)
      }
    }, Qa.prototype.readOnlyChanged = function(e) {
      e || this.reset(), this.textarea.disabled = "nocursor" == e
    }, Qa.prototype.setUneditable = function() {}, Qa.prototype.needsContentAttribute = !1, Io(zo), Ya(zo);
    var Za = "iter insert remove copy getEditor constructor".split(" ");
    for (var es in Aa.prototype) Aa.prototype.hasOwnProperty(es) && f(Za, es) < 0 && (zo.prototype[es] = function(e) {
      return function() {
        return e.apply(this.doc, arguments)
      }
    }(Aa.prototype[es]));
    return We(Aa), zo.inputStyles = {
      textarea: Qa,
      contenteditable: Ja
    }, zo.defineMode = function(e) {
      zo.defaults.mode || "null" == e || (zo.defaults.mode = e), Ge.apply(this, arguments)
    }, zo.defineMIME = Ve, zo.defineMode("null", function() {
      return {
        token: function(e) {
          return e.skipToEnd()
        }
      }
    }), zo.defineMIME("text/plain", "null"), zo.defineExtension = function(e, t) {
      zo.prototype[e] = t
    }, zo.defineDocExtension = function(e, t) {
      Aa.prototype[e] = t
    }, zo.fromTextArea = ol, ll(zo), zo.version = "5.27.4", zo
  }), define.registerEnd(), define.register("codemirror/addon/comment/comment"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";

    function t(e) {
      var t = e.search(o);
      return -1 == t ? 0 : t
    }

    function n(e, t, n) {
      return /\bstring\b/.test(e.getTokenTypeAt(l(t.line, 0))) && !/^[\'\"\`]/.test(n)
    }

    function r(e, t) {
      var n = e.getMode();
      return n.useInnerComments !== !1 && n.innerMode ? e.getModeAt(t) : n
    }
    var i = {},
      o = /[^\s\u00a0]/,
      l = e.Pos;
    e.commands.toggleComment = function(e) {
      e.toggleComment()
    }, e.defineExtension("toggleComment", function(e) {
      e || (e = i);
      for (var t = this, n = 1 / 0, r = this.listSelections(), o = null, a = r.length - 1; a >= 0; a--) {
        var s = r[a].from(),
          c = r[a].to();
        s.line >= n || (c.line >= n && (c = l(n, 0)), n = s.line, null == o ? t.uncomment(s, c, e) ? o = "un" : (t.lineComment(s, c, e), o = "line") : "un" == o ? t.uncomment(s, c, e) : t.lineComment(s, c, e))
      }
    }), e.defineExtension("lineComment", function(e, a, s) {
      s || (s = i);
      var c = this,
        u = r(c, e),
        d = c.getLine(e.line);
      if (null != d && !n(c, e, d)) {
        var f = s.lineComment || u.lineComment;
        if (!f) return void((s.blockCommentStart || u.blockCommentStart) && (s.fullLines = !0, c.blockComment(e, a, s)));
        var h = Math.min(0 != a.ch || a.line == e.line ? a.line + 1 : a.line, c.lastLine() + 1),
          p = null == s.padding ? " " : s.padding,
          m = s.commentBlankLines || e.line == a.line;
        c.operation(function() {
          if (s.indent) {
            for (var n = null, r = e.line; h > r; ++r) {
              var i = c.getLine(r),
                a = i.slice(0, t(i));
              (null == n || n.length > a.length) && (n = a)
            }
            for (var r = e.line; h > r; ++r) {
              var i = c.getLine(r),
                u = n.length;
              (m || o.test(i)) && (i.slice(0, u) != n && (u = t(i)), c.replaceRange(n + f + p, l(r, 0), l(r, u)))
            }
          } else
            for (var r = e.line; h > r; ++r)(m || o.test(c.getLine(r))) && c.replaceRange(f + p, l(r, 0))
        })
      }
    }), e.defineExtension("blockComment", function(e, t, n) {
      n || (n = i);
      var a = this,
        s = r(a, e),
        c = n.blockCommentStart || s.blockCommentStart,
        u = n.blockCommentEnd || s.blockCommentEnd;
      if (!c || !u) return void((n.lineComment || s.lineComment) && 0 != n.fullLines && a.lineComment(e, t, n));
      if (!/\bcomment\b/.test(a.getTokenTypeAt(l(e.line, 0)))) {
        var d = Math.min(t.line, a.lastLine());
        d != e.line && 0 == t.ch && o.test(a.getLine(d)) && --d;
        var f = null == n.padding ? " " : n.padding;
        e.line > d || a.operation(function() {
          if (0 != n.fullLines) {
            var r = o.test(a.getLine(d));
            a.replaceRange(f + u, l(d)), a.replaceRange(c + f, l(e.line, 0));
            var i = n.blockCommentLead || s.blockCommentLead;
            if (null != i)
              for (var h = e.line + 1; d >= h; ++h)(h != d || r) && a.replaceRange(i + f, l(h, 0))
          } else a.replaceRange(u, t), a.replaceRange(c, e)
        })
      }
    }), e.defineExtension("uncomment", function(e, t, n) {
      n || (n = i);
      var a, s = this,
        c = r(s, e),
        u = Math.min(0 != t.ch || t.line == e.line ? t.line : t.line - 1, s.lastLine()),
        d = Math.min(e.line, u),
        f = n.lineComment || c.lineComment,
        h = [],
        p = null == n.padding ? " " : n.padding;
      e: if (f) {
        for (var m = d; u >= m; ++m) {
          var g = s.getLine(m),
            v = g.indexOf(f);
          if (v > -1 && !/comment/.test(s.getTokenTypeAt(l(m, v + 1))) && (v = -1), -1 == v && o.test(g)) break e;
          if (v > -1 && o.test(g.slice(0, v))) break e;
          h.push(g)
        }
        if (s.operation(function() {
            for (var e = d; u >= e; ++e) {
              var t = h[e - d],
                n = t.indexOf(f),
                r = n + f.length;
              0 > n || (t.slice(r, r + p.length) == p && (r += p.length), a = !0, s.replaceRange("", l(e, n), l(e, r)))
            }
          }), a) return !0
      }
      var y = n.blockCommentStart || c.blockCommentStart,
        x = n.blockCommentEnd || c.blockCommentEnd;
      if (!y || !x) return !1;
      var b = n.blockCommentLead || c.blockCommentLead,
        w = s.getLine(d),
        C = w.indexOf(y);
      if (-1 == C) return !1;
      var S = u == d ? w : s.getLine(u),
        L = S.indexOf(x, u == d ? C + y.length : 0); - 1 == L && d != u && (S = s.getLine(--u), L = S.indexOf(x));
      var k = l(d, C + 1),
        M = l(u, L + 1);
      if (-1 == L || !/comment/.test(s.getTokenTypeAt(k)) || !/comment/.test(s.getTokenTypeAt(M)) || s.getRange(k, M, "\n").indexOf(x) > -1) return !1;
      var T = w.lastIndexOf(y, e.ch),
        O = -1 == T ? -1 : w.slice(0, e.ch).indexOf(x, T + y.length);
      if (-1 != T && -1 != O && O + x.length != e.ch) return !1;
      O = S.indexOf(x, t.ch);
      var N = S.slice(t.ch).lastIndexOf(y, O - t.ch);
      return T = -1 == O || -1 == N ? -1 : t.ch + N, -1 != O && -1 != T && T != t.ch ? !1 : (s.operation(function() {
        s.replaceRange("", l(u, L - (p && S.slice(L - p.length, L) == p ? p.length : 0)), l(u, L + x.length));
        var e = C + y.length;
        if (p && w.slice(e, e + p.length) == p && (e += p.length), s.replaceRange("", l(d, C), l(d, e)), b)
          for (var t = d + 1; u >= t; ++t) {
            var n = s.getLine(t),
              r = n.indexOf(b);
            if (-1 != r && !o.test(n.slice(0, r))) {
              var i = r + b.length;
              p && n.slice(i, i + p.length) == p && (i += p.length), s.replaceRange("", l(t, r), l(t, i))
            }
          }
      }), !0)
    })
  }), define.registerEnd(), define.register("codemirror/mode/meta"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";
    e.modeInfo = [{
      name: "APL",
      mime: "text/apl",
      mode: "apl",
      ext: ["dyalog", "apl"]
    }, {
      name: "PGP",
      mimes: ["application/pgp", "application/pgp-keys", "application/pgp-signature"],
      mode: "asciiarmor",
      ext: ["pgp"]
    }, {
      name: "ASN.1",
      mime: "text/x-ttcn-asn",
      mode: "asn.1",
      ext: ["asn", "asn1"]
    }, {
      name: "Asterisk",
      mime: "text/x-asterisk",
      mode: "asterisk",
      file: /^extensions\.conf$/i
    }, {
      name: "Brainfuck",
      mime: "text/x-brainfuck",
      mode: "brainfuck",
      ext: ["b", "bf"]
    }, {
      name: "C",
      mime: "text/x-csrc",
      mode: "clike",
      ext: ["c", "h"]
    }, {
      name: "C++",
      mime: "text/x-c++src",
      mode: "clike",
      ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"],
      alias: ["cpp"]
    }, {
      name: "Cobol",
      mime: "text/x-cobol",
      mode: "cobol",
      ext: ["cob", "cpy"]
    }, {
      name: "C#",
      mime: "text/x-csharp",
      mode: "clike",
      ext: ["cs"],
      alias: ["csharp"]
    }, {
      name: "Clojure",
      mime: "text/x-clojure",
      mode: "clojure",
      ext: ["clj", "cljc", "cljx"]
    }, {
      name: "ClojureScript",
      mime: "text/x-clojurescript",
      mode: "clojure",
      ext: ["cljs"]
    }, {
      name: "Closure Stylesheets (GSS)",
      mime: "text/x-gss",
      mode: "css",
      ext: ["gss"]
    }, {
      name: "CMake",
      mime: "text/x-cmake",
      mode: "cmake",
      ext: ["cmake", "cmake.in"],
      file: /^CMakeLists.txt$/
    }, {
      name: "CoffeeScript",
      mime: "text/x-coffeescript",
      mode: "coffeescript",
      ext: ["coffee"],
      alias: ["coffee", "coffee-script"]
    }, {
      name: "Common Lisp",
      mime: "text/x-common-lisp",
      mode: "commonlisp",
      ext: ["cl", "lisp", "el"],
      alias: ["lisp"]
    }, {
      name: "Cypher",
      mime: "application/x-cypher-query",
      mode: "cypher",
      ext: ["cyp", "cypher"]
    }, {
      name: "Cython",
      mime: "text/x-cython",
      mode: "python",
      ext: ["pyx", "pxd", "pxi"]
    }, {
      name: "Crystal",
      mime: "text/x-crystal",
      mode: "crystal",
      ext: ["cr"]
    }, {
      name: "CSS",
      mime: "text/css",
      mode: "css",
      ext: ["css"]
    }, {
      name: "CQL",
      mime: "text/x-cassandra",
      mode: "sql",
      ext: ["cql"]
    }, {
      name: "D",
      mime: "text/x-d",
      mode: "d",
      ext: ["d"]
    }, {
      name: "Dart",
      mimes: ["application/dart", "text/x-dart"],
      mode: "dart",
      ext: ["dart"]
    }, {
      name: "diff",
      mime: "text/x-diff",
      mode: "diff",
      ext: ["diff", "patch"]
    }, {
      name: "Django",
      mime: "text/x-django",
      mode: "django"
    }, {
      name: "Dockerfile",
      mime: "text/x-dockerfile",
      mode: "dockerfile",
      file: /^Dockerfile$/
    }, {
      name: "DTD",
      mime: "application/xml-dtd",
      mode: "dtd",
      ext: ["dtd"]
    }, {
      name: "Dylan",
      mime: "text/x-dylan",
      mode: "dylan",
      ext: ["dylan", "dyl", "intr"]
    }, {
      name: "EBNF",
      mime: "text/x-ebnf",
      mode: "ebnf"
    }, {
      name: "ECL",
      mime: "text/x-ecl",
      mode: "ecl",
      ext: ["ecl"]
    }, {
      name: "edn",
      mime: "application/edn",
      mode: "clojure",
      ext: ["edn"]
    }, {
      name: "Eiffel",
      mime: "text/x-eiffel",
      mode: "eiffel",
      ext: ["e"]
    }, {
      name: "Elm",
      mime: "text/x-elm",
      mode: "elm",
      ext: ["elm"]
    }, {
      name: "Embedded Javascript",
      mime: "application/x-ejs",
      mode: "htmlembedded",
      ext: ["ejs"]
    }, {
      name: "Embedded Ruby",
      mime: "application/x-erb",
      mode: "htmlembedded",
      ext: ["erb"]
    }, {
      name: "Erlang",
      mime: "text/x-erlang",
      mode: "erlang",
      ext: ["erl"]
    }, {
      name: "Factor",
      mime: "text/x-factor",
      mode: "factor",
      ext: ["factor"]
    }, {
      name: "FCL",
      mime: "text/x-fcl",
      mode: "fcl"
    }, {
      name: "Forth",
      mime: "text/x-forth",
      mode: "forth",
      ext: ["forth", "fth", "4th"]
    }, {
      name: "Fortran",
      mime: "text/x-fortran",
      mode: "fortran",
      ext: ["f", "for", "f77", "f90"]
    }, {
      name: "F#",
      mime: "text/x-fsharp",
      mode: "mllike",
      ext: ["fs"],
      alias: ["fsharp"]
    }, {
      name: "Gas",
      mime: "text/x-gas",
      mode: "gas",
      ext: ["s"]
    }, {
      name: "Gherkin",
      mime: "text/x-feature",
      mode: "gherkin",
      ext: ["feature"]
    }, {
      name: "GitHub Flavored Markdown",
      mime: "text/x-gfm",
      mode: "gfm",
      file: /^(readme|contributing|history).md$/i
    }, {
      name: "Go",
      mime: "text/x-go",
      mode: "go",
      ext: ["go"]
    }, {
      name: "Groovy",
      mime: "text/x-groovy",
      mode: "groovy",
      ext: ["groovy", "gradle"],
      file: /^Jenkinsfile$/
    }, {
      name: "HAML",
      mime: "text/x-haml",
      mode: "haml",
      ext: ["haml"]
    }, {
      name: "Haskell",
      mime: "text/x-haskell",
      mode: "haskell",
      ext: ["hs"]
    }, {
      name: "Haskell (Literate)",
      mime: "text/x-literate-haskell",
      mode: "haskell-literate",
      ext: ["lhs"]
    }, {
      name: "Haxe",
      mime: "text/x-haxe",
      mode: "haxe",
      ext: ["hx"]
    }, {
      name: "HXML",
      mime: "text/x-hxml",
      mode: "haxe",
      ext: ["hxml"]
    }, {
      name: "ASP.NET",
      mime: "application/x-aspx",
      mode: "htmlembedded",
      ext: ["aspx"],
      alias: ["asp", "aspx"]
    }, {
      name: "HTML",
      mime: "text/html",
      mode: "htmlmixed",
      ext: ["html", "htm"],
      alias: ["xhtml"]
    }, {
      name: "HTTP",
      mime: "message/http",
      mode: "http"
    }, {
      name: "IDL",
      mime: "text/x-idl",
      mode: "idl",
      ext: ["pro"]
    }, {
      name: "Pug",
      mime: "text/x-pug",
      mode: "pug",
      ext: ["jade", "pug"],
      alias: ["jade"]
    }, {
      name: "Java",
      mime: "text/x-java",
      mode: "clike",
      ext: ["java"]
    }, {
      name: "Java Server Pages",
      mime: "application/x-jsp",
      mode: "htmlembedded",
      ext: ["jsp"],
      alias: ["jsp"]
    }, {
      name: "JavaScript",
      mimes: ["text/javascript", "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"],
      mode: "javascript",
      ext: ["js"],
      alias: ["ecmascript", "js", "node"]
    }, {
      name: "JSON",
      mimes: ["application/json", "application/x-json"],
      mode: "javascript",
      ext: ["json", "map"],
      alias: ["json5"]
    }, {
      name: "JSON-LD",
      mime: "application/ld+json",
      mode: "javascript",
      ext: ["jsonld"],
      alias: ["jsonld"]
    }, {
      name: "JSX",
      mime: "text/jsx",
      mode: "jsx",
      ext: ["jsx"]
    }, {
      name: "Jinja2",
      mime: "null",
      mode: "jinja2"
    }, {
      name: "Julia",
      mime: "text/x-julia",
      mode: "julia",
      ext: ["jl"]
    }, {
      name: "Kotlin",
      mime: "text/x-kotlin",
      mode: "clike",
      ext: ["kt"]
    }, {
      name: "LESS",
      mime: "text/x-less",
      mode: "css",
      ext: ["less"]
    }, {
      name: "LiveScript",
      mime: "text/x-livescript",
      mode: "livescript",
      ext: ["ls"],
      alias: ["ls"]
    }, {
      name: "Lua",
      mime: "text/x-lua",
      mode: "lua",
      ext: ["lua"]
    }, {
      name: "Markdown",
      mime: "text/x-markdown",
      mode: "markdown",
      ext: ["markdown", "md", "mkd"]
    }, {
      name: "mIRC",
      mime: "text/mirc",
      mode: "mirc"
    }, {
      name: "MariaDB SQL",
      mime: "text/x-mariadb",
      mode: "sql"
    }, {
      name: "Mathematica",
      mime: "text/x-mathematica",
      mode: "mathematica",
      ext: ["m", "nb"]
    }, {
      name: "Modelica",
      mime: "text/x-modelica",
      mode: "modelica",
      ext: ["mo"]
    }, {
      name: "MUMPS",
      mime: "text/x-mumps",
      mode: "mumps",
      ext: ["mps"]
    }, {
      name: "MS SQL",
      mime: "text/x-mssql",
      mode: "sql"
    }, {
      name: "mbox",
      mime: "application/mbox",
      mode: "mbox",
      ext: ["mbox"]
    }, {
      name: "MySQL",
      mime: "text/x-mysql",
      mode: "sql"
    }, {
      name: "Nginx",
      mime: "text/x-nginx-conf",
      mode: "nginx",
      file: /nginx.*\.conf$/i
    }, {
      name: "NSIS",
      mime: "text/x-nsis",
      mode: "nsis",
      ext: ["nsh", "nsi"]
    }, {
      name: "NTriples",
      mime: "text/n-triples",
      mode: "ntriples",
      ext: ["nt"]
    }, {
      name: "Objective C",
      mime: "text/x-objectivec",
      mode: "clike",
      ext: ["m", "mm"],
      alias: ["objective-c", "objc"]
    }, {
      name: "OCaml",
      mime: "text/x-ocaml",
      mode: "mllike",
      ext: ["ml", "mli", "mll", "mly"]
    }, {
      name: "Octave",
      mime: "text/x-octave",
      mode: "octave",
      ext: ["m"]
    }, {
      name: "Oz",
      mime: "text/x-oz",
      mode: "oz",
      ext: ["oz"]
    }, {
      name: "Pascal",
      mime: "text/x-pascal",
      mode: "pascal",
      ext: ["p", "pas"]
    }, {
      name: "PEG.js",
      mime: "null",
      mode: "pegjs",
      ext: ["jsonld"]
    }, {
      name: "Perl",
      mime: "text/x-perl",
      mode: "perl",
      ext: ["pl", "pm"]
    }, {
      name: "PHP",
      mime: "application/x-httpd-php",
      mode: "php",
      ext: ["php", "php3", "php4", "php5", "phtml"]
    }, {
      name: "Pig",
      mime: "text/x-pig",
      mode: "pig",
      ext: ["pig"]
    }, {
      name: "Plain Text",
      mime: "text/plain",
      mode: "null",
      ext: ["txt", "text", "conf", "def", "list", "log"]
    }, {
      name: "PLSQL",
      mime: "text/x-plsql",
      mode: "sql",
      ext: ["pls"]
    }, {
      name: "PowerShell",
      mime: "application/x-powershell",
      mode: "powershell",
      ext: ["ps1", "psd1", "psm1"]
    }, {
      name: "Properties files",
      mime: "text/x-properties",
      mode: "properties",
      ext: ["properties", "ini", "in"],
      alias: ["ini", "properties"]
    }, {
      name: "ProtoBuf",
      mime: "text/x-protobuf",
      mode: "protobuf",
      ext: ["proto"]
    }, {
      name: "Python",
      mime: "text/x-python",
      mode: "python",
      ext: ["BUILD", "bzl", "py", "pyw"],
      file: /^(BUCK|BUILD)$/
    }, {
      name: "Puppet",
      mime: "text/x-puppet",
      mode: "puppet",
      ext: ["pp"]
    }, {
      name: "Q",
      mime: "text/x-q",
      mode: "q",
      ext: ["q"]
    }, {
      name: "R",
      mime: "text/x-rsrc",
      mode: "r",
      ext: ["r", "R"],
      alias: ["rscript"]
    }, {
      name: "reStructuredText",
      mime: "text/x-rst",
      mode: "rst",
      ext: ["rst"],
      alias: ["rst"]
    }, {
      name: "RPM Changes",
      mime: "text/x-rpm-changes",
      mode: "rpm"
    }, {
      name: "RPM Spec",
      mime: "text/x-rpm-spec",
      mode: "rpm",
      ext: ["spec"]
    }, {
      name: "Ruby",
      mime: "text/x-ruby",
      mode: "ruby",
      ext: ["rb"],
      alias: ["jruby", "macruby", "rake", "rb", "rbx"]
    }, {
      name: "Rust",
      mime: "text/x-rustsrc",
      mode: "rust",
      ext: ["rs"]
    }, {
      name: "SAS",
      mime: "text/x-sas",
      mode: "sas",
      ext: ["sas"]
    }, {
      name: "Sass",
      mime: "text/x-sass",
      mode: "sass",
      ext: ["sass"]
    }, {
      name: "Scala",
      mime: "text/x-scala",
      mode: "clike",
      ext: ["scala"]
    }, {
      name: "Scheme",
      mime: "text/x-scheme",
      mode: "scheme",
      ext: ["scm", "ss"]
    }, {
      name: "SCSS",
      mime: "text/x-scss",
      mode: "css",
      ext: ["scss"]
    }, {
      name: "Shell",
      mime: "text/x-sh",
      mode: "shell",
      ext: ["sh", "ksh", "bash"],
      alias: ["bash", "sh", "zsh"],
      file: /^PKGBUILD$/
    }, {
      name: "Sieve",
      mime: "application/sieve",
      mode: "sieve",
      ext: ["siv", "sieve"]
    }, {
      name: "Slim",
      mimes: ["text/x-slim", "application/x-slim"],
      mode: "slim",
      ext: ["slim"]
    }, {
      name: "Smalltalk",
      mime: "text/x-stsrc",
      mode: "smalltalk",
      ext: ["st"]
    }, {
      name: "Smarty",
      mime: "text/x-smarty",
      mode: "smarty",
      ext: ["tpl"]
    }, {
      name: "Solr",
      mime: "text/x-solr",
      mode: "solr"
    }, {
      name: "Soy",
      mime: "text/x-soy",
      mode: "soy",
      ext: ["soy"],
      alias: ["closure template"]
    }, {
      name: "SPARQL",
      mime: "application/sparql-query",
      mode: "sparql",
      ext: ["rq", "sparql"],
      alias: ["sparul"]
    }, {
      name: "Spreadsheet",
      mime: "text/x-spreadsheet",
      mode: "spreadsheet",
      alias: ["excel", "formula"]
    }, {
      name: "SQL",
      mime: "text/x-sql",
      mode: "sql",
      ext: ["sql"]
    }, {
      name: "SQLite",
      mime: "text/x-sqlite",
      mode: "sql"
    }, {
      name: "Squirrel",
      mime: "text/x-squirrel",
      mode: "clike",
      ext: ["nut"]
    }, {
      name: "Stylus",
      mime: "text/x-styl",
      mode: "stylus",
      ext: ["styl"]
    }, {
      name: "Swift",
      mime: "text/x-swift",
      mode: "swift",
      ext: ["swift"]
    }, {
      name: "sTeX",
      mime: "text/x-stex",
      mode: "stex"
    }, {
      name: "LaTeX",
      mime: "text/x-latex",
      mode: "stex",
      ext: ["text", "ltx"],
      alias: ["tex"]
    }, {
      name: "SystemVerilog",
      mime: "text/x-systemverilog",
      mode: "verilog",
      ext: ["v"]
    }, {
      name: "Tcl",
      mime: "text/x-tcl",
      mode: "tcl",
      ext: ["tcl"]
    }, {
      name: "Textile",
      mime: "text/x-textile",
      mode: "textile",
      ext: ["textile"]
    }, {
      name: "TiddlyWiki ",
      mime: "text/x-tiddlywiki",
      mode: "tiddlywiki"
    }, {
      name: "Tiki wiki",
      mime: "text/tiki",
      mode: "tiki"
    }, {
      name: "TOML",
      mime: "text/x-toml",
      mode: "toml",
      ext: ["toml"]
    }, {
      name: "Tornado",
      mime: "text/x-tornado",
      mode: "tornado"
    }, {
      name: "troff",
      mime: "text/troff",
      mode: "troff",
      ext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    }, {
      name: "TTCN",
      mime: "text/x-ttcn",
      mode: "ttcn",
      ext: ["ttcn", "ttcn3", "ttcnpp"]
    }, {
      name: "TTCN_CFG",
      mime: "text/x-ttcn-cfg",
      mode: "ttcn-cfg",
      ext: ["cfg"]
    }, {
      name: "Turtle",
      mime: "text/turtle",
      mode: "turtle",
      ext: ["ttl"]
    }, {
      name: "TypeScript",
      mime: "application/typescript",
      mode: "javascript",
      ext: ["ts"],
      alias: ["ts"]
    }, {
      name: "TypeScript-JSX",
      mime: "text/typescript-jsx",
      mode: "jsx",
      ext: ["tsx"],
      alias: ["tsx"]
    }, {
      name: "Twig",
      mime: "text/x-twig",
      mode: "twig"
    }, {
      name: "Web IDL",
      mime: "text/x-webidl",
      mode: "webidl",
      ext: ["webidl"]
    }, {
      name: "VB.NET",
      mime: "text/x-vb",
      mode: "vb",
      ext: ["vb"]
    }, {
      name: "VBScript",
      mime: "text/vbscript",
      mode: "vbscript",
      ext: ["vbs"]
    }, {
      name: "Velocity",
      mime: "text/velocity",
      mode: "velocity",
      ext: ["vtl"]
    }, {
      name: "Verilog",
      mime: "text/x-verilog",
      mode: "verilog",
      ext: ["v"]
    }, {
      name: "VHDL",
      mime: "text/x-vhdl",
      mode: "vhdl",
      ext: ["vhd", "vhdl"]
    }, {
      name: "Vue.js Component",
      mimes: ["script/x-vue", "text/x-vue"],
      mode: "vue",
      ext: ["vue"]
    }, {
      name: "XML",
      mimes: ["application/xml", "text/xml"],
      mode: "xml",
      ext: ["xml", "xsl", "xsd", "svg"],
      alias: ["rss", "wsdl", "xsd"]
    }, {
      name: "XQuery",
      mime: "application/xquery",
      mode: "xquery",
      ext: ["xy", "xquery"]
    }, {
      name: "Yacas",
      mime: "text/x-yacas",
      mode: "yacas",
      ext: ["ys"]
    }, {
      name: "YAML",
      mimes: ["text/x-yaml", "text/yaml"],
      mode: "yaml",
      ext: ["yaml", "yml"],
      alias: ["yml"]
    }, {
      name: "Z80",
      mime: "text/x-z80",
      mode: "z80",
      ext: ["z80"]
    }, {
      name: "mscgen",
      mime: "text/x-mscgen",
      mode: "mscgen",
      ext: ["mscgen", "mscin", "msc"]
    }, {
      name: "xu",
      mime: "text/x-xu",
      mode: "mscgen",
      ext: ["xu"]
    }, {
      name: "msgenny",
      mime: "text/x-msgenny",
      mode: "mscgen",
      ext: ["msgenny"]
    }];
    for (var t = 0; t < e.modeInfo.length; t++) {
      var n = e.modeInfo[t];
      n.mimes && (n.mime = n.mimes[0])
    }
    e.findModeByMIME = function(t) {
      t = t.toLowerCase();
      for (var n = 0; n < e.modeInfo.length; n++) {
        var r = e.modeInfo[n];
        if (r.mime == t) return r;
        if (r.mimes)
          for (var i = 0; i < r.mimes.length; i++)
            if (r.mimes[i] == t) return r
      }
      return /\+xml$/.test(t) ? e.findModeByMIME("application/xml") : /\+json$/.test(t) ? e.findModeByMIME("application/json") : void 0
    }, e.findModeByExtension = function(t) {
      for (var n = 0; n < e.modeInfo.length; n++) {
        var r = e.modeInfo[n];
        if (r.ext)
          for (var i = 0; i < r.ext.length; i++)
            if (r.ext[i] == t) return r
      }
    }, e.findModeByFileName = function(t) {
      for (var n = 0; n < e.modeInfo.length; n++) {
        var r = e.modeInfo[n];
        if (r.file && r.file.test(t)) return r
      }
      var i = t.lastIndexOf("."),
        o = i > -1 && t.substring(i + 1, t.length);
      return o ? e.findModeByExtension(o) : void 0
    }, e.findModeByName = function(t) {
      t = t.toLowerCase();
      for (var n = 0; n < e.modeInfo.length; n++) {
        var r = e.modeInfo[n];
        if (r.name.toLowerCase() == t) return r;
        if (r.alias)
          for (var i = 0; i < r.alias.length; i++)
            if (r.alias[i].toLowerCase() == t) return r
      }
    }
  }), define.registerEnd(), define.register("codemirror/addon/mode/simple"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";

    function t(e, t) {
      if (!e.hasOwnProperty(t)) throw new Error("Undefined state " + t + " in simple mode")
    }

    function n(e, t) {
      if (!e) return /(?:)/;
      var n = "";
      return e instanceof RegExp ? (e.ignoreCase && (n = "i"), e = e.source) : e = String(e), new RegExp((t === !1 ? "" : "^") + "(?:" + e + ")", n)
    }

    function r(e) {
      if (!e) return null;
      if (e.apply) return e;
      if ("string" == typeof e) return e.replace(/\./g, " ");
      for (var t = [], n = 0; n < e.length; n++) t.push(e[n] && e[n].replace(/\./g, " "));
      return t
    }

    function i(e, i) {
      (e.next || e.push) && t(i, e.next || e.push), this.regex = n(e.regex), this.token = r(e.token), this.data = e
    }

    function o(e, t) {
      return function(n, r) {
        if (r.pending) {
          var i = r.pending.shift();
          return 0 == r.pending.length && (r.pending = null), n.pos += i.text.length, i.token
        }
        if (r.local) {
          if (r.local.end && n.match(r.local.end)) {
            var o = r.local.endToken || null;
            return r.local = r.localState = null, o
          }
          var l, o = r.local.mode.token(n, r.localState);
          return r.local.endScan && (l = r.local.endScan.exec(n.current())) && (n.pos = n.start + l.index), o
        }
        for (var s = e[r.state], c = 0; c < s.length; c++) {
          var u = s[c],
            d = (!u.data.sol || n.sol()) && n.match(u.regex);
          if (d) {
            u.data.next ? r.state = u.data.next : u.data.push ? ((r.stack || (r.stack = [])).push(r.state), r.state = u.data.push) : u.data.pop && r.stack && r.stack.length && (r.state = r.stack.pop()), u.data.mode && a(t, r, u.data.mode, u.token), u.data.indent && r.indent.push(n.indentation() + t.indentUnit), u.data.dedent && r.indent.pop();
            var f = u.token;
            if (f && f.apply && (f = f(d)), d.length > 2) {
              r.pending = [];
              for (var h = 2; h < d.length; h++) d[h] && r.pending.push({
                text: d[h],
                token: u.token[h - 1]
              });
              return n.backUp(d[0].length - (d[1] ? d[1].length : 0)), f[0]
            }
            return f && f.join ? f[0] : f
          }
        }
        return n.next(), null
      }
    }

    function l(e, t) {
      if (e === t) return !0;
      if (!e || "object" != typeof e || !t || "object" != typeof t) return !1;
      var n = 0;
      for (var r in e)
        if (e.hasOwnProperty(r)) {
          if (!t.hasOwnProperty(r) || !l(e[r], t[r])) return !1;
          n++
        }
      for (var r in t) t.hasOwnProperty(r) && n--;
      return 0 == n
    }

    function a(t, r, i, o) {
      var a;
      if (i.persistent)
        for (var s = r.persistentStates; s && !a; s = s.next)(i.spec ? l(i.spec, s.spec) : i.mode == s.mode) && (a = s);
      var c = a ? a.mode : i.mode || e.getMode(t, i.spec),
        u = a ? a.state : e.startState(c);
      i.persistent && !a && (r.persistentStates = {
        mode: c,
        spec: i.spec,
        state: u,
        next: r.persistentStates
      }), r.localState = u, r.local = {
        mode: c,
        end: i.end && n(i.end),
        endScan: i.end && i.forceEnd !== !1 && n(i.end, !1),
        endToken: o && o.join ? o[o.length - 1] : o
      }
    }

    function s(e, t) {
      for (var n = 0; n < t.length; n++)
        if (t[n] === e) return !0
    }

    function c(t, n) {
      return function(r, i, o) {
        if (r.local && r.local.mode.indent) return r.local.mode.indent(r.localState, i, o);
        if (null == r.indent || r.local || n.dontIndentStates && s(r.state, n.dontIndentStates) > -1) return e.Pass;
        var l = r.indent.length - 1,
          a = t[r.state];
        e: for (;;) {
          for (var c = 0; c < a.length; c++) {
            var u = a[c];
            if (u.data.dedent && u.data.dedentIfLineStart !== !1) {
              var d = u.regex.exec(i);
              if (d && d[0]) {
                l--, (u.next || u.push) && (a = t[u.next || u.push]), i = i.slice(d[0].length);
                continue e
              }
            }
          }
          break
        }
        return 0 > l ? 0 : r.indent[l]
      }
    }
    e.defineSimpleMode = function(t, n) {
      e.defineMode(t, function(t) {
        return e.simpleMode(t, n)
      })
    }, e.simpleMode = function(n, r) {
      t(r, "start");
      var l = {},
        a = r.meta || {},
        s = !1;
      for (var u in r)
        if (u != a && r.hasOwnProperty(u))
          for (var d = l[u] = [], f = r[u], h = 0; h < f.length; h++) {
            var p = f[h];
            d.push(new i(p, r)), (p.indent || p.dedent) && (s = !0)
          }
      var m = {
        startState: function() {
          return {
            state: "start",
            pending: null,
            local: null,
            localState: null,
            indent: s ? [] : null
          }
        },
        copyState: function(t) {
          var n = {
            state: t.state,
            pending: t.pending,
            local: t.local,
            localState: null,
            indent: t.indent && t.indent.slice(0)
          };
          t.localState && (n.localState = e.copyState(t.local.mode, t.localState)), t.stack && (n.stack = t.stack.slice(0));
          for (var r = t.persistentStates; r; r = r.next) n.persistentStates = {
            mode: r.mode,
            spec: r.spec,
            state: r.state == t.localState ? n.localState : e.copyState(r.mode, r.state),
            next: n.persistentStates
          };
          return n
        },
        token: o(l, n),
        innerMode: function(e) {
          return e.local && {
            mode: e.local.mode,
            state: e.localState
          }
        },
        indent: c(l, a)
      };
      if (a)
        for (var g in a) a.hasOwnProperty(g) && (m[g] = a[g]);
      return m
    }
  }), define.registerEnd(), define.register("codemirror/addon/mode/overlay"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";
    e.overlayMode = function(t, n, r) {
      return {
        startState: function() {
          return {
            base: e.startState(t),
            overlay: e.startState(n),
            basePos: 0,
            baseCur: null,
            overlayPos: 0,
            overlayCur: null,
            streamSeen: null
          }
        },
        copyState: function(r) {
          return {
            base: e.copyState(t, r.base),
            overlay: e.copyState(n, r.overlay),
            basePos: r.basePos,
            baseCur: null,
            overlayPos: r.overlayPos,
            overlayCur: null
          }
        },
        token: function(e, i) {
          return (e != i.streamSeen || Math.min(i.basePos, i.overlayPos) < e.start) && (i.streamSeen = e, i.basePos = i.overlayPos = e.start), e.start == i.basePos && (i.baseCur = t.token(e, i.base), i.basePos = e.pos), e.start == i.overlayPos && (e.pos = e.start, i.overlayCur = n.token(e, i.overlay), i.overlayPos = e.pos), e.pos = Math.min(i.basePos, i.overlayPos), null == i.overlayCur ? i.baseCur : null != i.baseCur && i.overlay.combineTokens || r && null == i.overlay.combineTokens ? i.baseCur + " " + i.overlayCur : i.overlayCur
        },
        indent: t.indent && function(e, n) {
          return t.indent(e.base, n)
        },
        electricChars: t.electricChars,
        innerMode: function(e) {
          return {
            state: e.base,
            mode: t
          }
        },
        blankLine: function(e) {
          var i, o;
          return t.blankLine && (i = t.blankLine(e.base)), n.blankLine && (o = n.blankLine(e.overlay)), null == o ? i : r && null != i ? i + " " + o : o
        }
      }
    }
  }), define.registerEnd(), define.register("codemirror/addon/mode/multiplex"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";
    e.multiplexingMode = function(t) {
      function n(e, t, n, r) {
        if ("string" == typeof t) {
          var i = e.indexOf(t, n);
          return r && i > -1 ? i + t.length : i
        }
        var o = t.exec(n ? e.slice(n) : e);
        return o ? o.index + n + (r ? o[0].length : 0) : -1
      }
      var r = Array.prototype.slice.call(arguments, 1);
      return {
        startState: function() {
          return {
            outer: e.startState(t),
            innerActive: null,
            inner: null
          }
        },
        copyState: function(n) {
          return {
            outer: e.copyState(t, n.outer),
            innerActive: n.innerActive,
            inner: n.innerActive && e.copyState(n.innerActive.mode, n.inner)
          }
        },
        token: function(i, o) {
          if (o.innerActive) {
            var l = o.innerActive,
              a = i.string;
            if (!l.close && i.sol()) return o.innerActive = o.inner = null, this.token(i, o);
            var s = l.close ? n(a, l.close, i.pos, l.parseDelimiters) : -1;
            if (s == i.pos && !l.parseDelimiters) return i.match(l.close), o.innerActive = o.inner = null, l.delimStyle && l.delimStyle + " " + l.delimStyle + "-close";
            s > -1 && (i.string = a.slice(0, s));
            var c = l.mode.token(i, o.inner);
            return s > -1 && (i.string = a), s == i.pos && l.parseDelimiters && (o.innerActive = o.inner = null), l.innerStyle && (c = c ? c + " " + l.innerStyle : l.innerStyle), c
          }
          for (var u = 1 / 0, a = i.string, d = 0; d < r.length; ++d) {
            var f = r[d],
              s = n(a, f.open, i.pos);
            if (s == i.pos) return f.parseDelimiters || i.match(f.open), o.innerActive = f, o.inner = e.startState(f.mode, t.indent ? t.indent(o.outer, "") : 0), f.delimStyle && f.delimStyle + " " + f.delimStyle + "-open"; - 1 != s && u > s && (u = s)
          }
          u != 1 / 0 && (i.string = a.slice(0, u));
          var h = t.token(i, o.outer);
          return u != 1 / 0 && (i.string = a), h
        },
        indent: function(n, r) {
          var i = n.innerActive ? n.innerActive.mode : t;
          return i.indent ? i.indent(n.innerActive ? n.inner : n.outer, r) : e.Pass
        },
        blankLine: function(n) {
          var i = n.innerActive ? n.innerActive.mode : t;
          if (i.blankLine && i.blankLine(n.innerActive ? n.inner : n.outer), n.innerActive) "\n" === n.innerActive.close && (n.innerActive = n.inner = null);
          else
            for (var o = 0; o < r.length; ++o) {
              var l = r[o];
              "\n" === l.open && (n.innerActive = l, n.inner = e.startState(l.mode, i.indent ? i.indent(n.outer, "") : 0))
            }
        },
        electricChars: t.electricChars,
        innerMode: function(e) {
          return e.inner ? {
            state: e.inner,
            mode: e.innerActive.mode
          } : {
            state: e.outer,
            mode: t
          }
        }
      }
    }
  }), define.registerEnd(), define.register("codemirror/addon/dialog/dialog"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    function t(e, t, n) {
      var r, i = e.getWrapperElement();
      return r = i.appendChild(document.createElement("div")), n ? r.className = "CodeMirror-dialog CodeMirror-dialog-bottom" : r.className = "CodeMirror-dialog CodeMirror-dialog-top", "string" == typeof t ? r.innerHTML = t : r.appendChild(t), r
    }

    function n(e, t) {
      e.state.currentNotificationClose && e.state.currentNotificationClose(), e.state.currentNotificationClose = t
    }
    e.defineExtension("openDialog", function(r, i, o) {
      function l(e) {
        if ("string" == typeof e) d.value = e;
        else {
          if (c) return;
          c = !0, s.parentNode.removeChild(s), u.focus(), o.onClose && o.onClose(s)
        }
      }
      o || (o = {}), n(this, null);
      var a, s = t(this, r, o.bottom),
        c = !1,
        u = this,
        d = s.getElementsByTagName("input")[0];
      return d ? (d.focus(), o.value && (d.value = o.value, o.selectValueOnOpen !== !1 && d.select()), o.onInput && e.on(d, "input", function(e) {
        o.onInput(e, d.value, l)
      }), o.onKeyUp && e.on(d, "keyup", function(e) {
        o.onKeyUp(e, d.value, l)
      }), e.on(d, "keydown", function(t) {
        o && o.onKeyDown && o.onKeyDown(t, d.value, l) || ((27 == t.keyCode || o.closeOnEnter !== !1 && 13 == t.keyCode) && (d.blur(), e.e_stop(t), l()), 13 == t.keyCode && i(d.value, t))
      }), o.closeOnBlur !== !1 && e.on(d, "blur", l)) : (a = s.getElementsByTagName("button")[0]) && (e.on(a, "click", function() {
        l(), u.focus()
      }), o.closeOnBlur !== !1 && e.on(a, "blur", l), a.focus()), l
    }), e.defineExtension("openConfirm", function(r, i, o) {
      function l() {
        c || (c = !0, a.parentNode.removeChild(a), u.focus())
      }
      n(this, null);
      var a = t(this, r, o && o.bottom),
        s = a.getElementsByTagName("button"),
        c = !1,
        u = this,
        d = 1;
      s[0].focus();
      for (var f = 0; f < s.length; ++f) {
        var h = s[f];
        ! function(t) {
          e.on(h, "click", function(n) {
            e.e_preventDefault(n), l(), t && t(u)
          })
        }(i[f]), e.on(h, "blur", function() {
          --d, setTimeout(function() {
            0 >= d && l()
          }, 200)
        }), e.on(h, "focus", function() {
          ++d
        })
      }
    }), e.defineExtension("openNotification", function(r, i) {
      function o() {
        s || (s = !0, clearTimeout(l), a.parentNode.removeChild(a))
      }
      n(this, o);
      var l, a = t(this, r, i && i.bottom),
        s = !1,
        c = i && "undefined" != typeof i.duration ? i.duration : 5e3;
      return e.on(a, "click", function(t) {
        e.e_preventDefault(t), o()
      }), c && (l = setTimeout(o, c)), o
    })
  }), define.registerEnd(), define.register("codemirror/addon/search/searchcursor"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";

    function t(e) {
      var t = e.flags;
      return null != t ? t : (e.ignoreCase ? "i" : "") + (e.global ? "g" : "") + (e.multiline ? "m" : "")
    }

    function n(e) {
      return e.global ? e : new RegExp(e.source, t(e) + "g")
    }

    function r(e) {
      return /\\s|\\n|\n|\\W|\\D|\[\^/.test(e.source)
    }

    function i(e, t, r) {
      t = n(t);
      for (var i = r.line, o = r.ch, l = e.lastLine(); l >= i; i++, o = 0) {
        t.lastIndex = o;
        var a = e.getLine(i),
          s = t.exec(a);
        if (s) return {
          from: m(i, s.index),
          to: m(i, s.index + s[0].length),
          match: s
        }
      }
    }

    function o(e, t, o) {
      if (!r(t)) return i(e, t, o);
      t = n(t);
      for (var l, a = 1, s = o.line, c = e.lastLine(); c >= s;) {
        for (var u = 0; a > u; u++) {
          var d = e.getLine(s++);
          l = null == l ? d : l + "\n" + d
        }
        a = 2 * a, t.lastIndex = o.ch;
        var f = t.exec(l);
        if (f) {
          var h = l.slice(0, f.index).split("\n"),
            p = f[0].split("\n"),
            g = o.line + h.length - 1,
            v = h[h.length - 1].length;
          return {
            from: m(g, v),
            to: m(g + p.length - 1, 1 == p.length ? v + p[0].length : p[p.length - 1].length),
            match: f
          }
        }
      }
    }

    function l(e, t) {
      for (var n, r = 0;;) {
        t.lastIndex = r;
        var i = t.exec(e);
        if (!i) return n;
        if (n = i, r = n.index + (n[0].length || 1), r == e.length) return n
      }
    }

    function a(e, t, r) {
      t = n(t);
      for (var i = r.line, o = r.ch, a = e.firstLine(); i >= a; i--, o = -1) {
        var s = e.getLine(i);
        o > -1 && (s = s.slice(0, o));
        var c = l(s, t);
        if (c) return {
          from: m(i, c.index),
          to: m(i, c.index + c[0].length),
          match: c
        }
      }
    }

    function s(e, t, r) {
      t = n(t);
      for (var i, o = 1, a = r.line, s = e.firstLine(); a >= s;) {
        for (var c = 0; o > c; c++) {
          var u = e.getLine(a--);
          i = null == i ? u.slice(0, r.ch) : u + "\n" + i
        }
        o *= 2;
        var d = l(i, t);
        if (d) {
          var f = i.slice(0, d.index).split("\n"),
            h = d[0].split("\n"),
            p = a + f.length,
            g = f[f.length - 1].length;
          return {
            from: m(p, g),
            to: m(p + h.length - 1, 1 == h.length ? g + h[0].length : h[h.length - 1].length),
            match: d
          }
        }
      }
    }

    function c(e, t, n, r) {
      if (e.length == t.length) return n;
      for (var i = Math.min(n, e.length);;) {
        var o = r(e.slice(0, i)).length;
        if (n > o) ++i;
        else {
          if (!(o > n)) return i;
          --i
        }
      }
    }

    function u(e, t, n, r) {
      if (!t.length) return null;
      var i = r ? h : p,
        o = i(t).split(/\r|\n\r?/);
      e: for (var l = n.line, a = n.ch, s = e.lastLine() + 1 - o.length; s >= l; l++, a = 0) {
        var u = e.getLine(l).slice(a),
          d = i(u);
        if (1 == o.length) {
          var f = d.indexOf(o[0]);
          if (-1 == f) continue e;
          var n = c(u, d, f, i) + a;
          return {
            from: m(l, c(u, d, f, i) + a),
            to: m(l, c(u, d, f + o[0].length, i) + a)
          }
        }
        var g = d.length - o[0].length;
        if (d.slice(g) == o[0]) {
          for (var v = 1; v < o.length - 1; v++)
            if (i(e.getLine(l + v)) != o[v]) continue e;
          var y = e.getLine(l + o.length - 1),
            x = i(y),
            b = o[o.length - 1];
          if (y.slice(0, b.length) == b) return {
            from: m(l, c(u, d, g, i) + a),
            to: m(l + o.length - 1, c(y, x, b.length, i))
          }
        }
      }
    }

    function d(e, t, n, r) {
      if (!t.length) return null;
      var i = r ? h : p,
        o = i(t).split(/\r|\n\r?/);
      e: for (var l = n.line, a = n.ch, s = e.firstLine() - 1 + o.length; l >= s; l--, a = -1) {
        var u = e.getLine(l);
        a > -1 && (u = u.slice(0, a));
        var d = i(u);
        if (1 == o.length) {
          var f = d.lastIndexOf(o[0]);
          if (-1 == f) continue e;
          return {
            from: m(l, c(u, d, f, i)),
            to: m(l, c(u, d, f + o[0].length, i))
          }
        }
        var g = o[o.length - 1];
        if (d.slice(0, g.length) == g) {
          for (var v = 1, n = l - o.length + 1; v < o.length - 1; v++)
            if (i(e.getLine(n + v)) != o[v]) continue e;
          var y = e.getLine(l + 1 - o.length),
            x = i(y);
          if (x.slice(x.length - o[0].length) == o[0]) return {
            from: m(l + 1 - o.length, c(y, x, y.length - o[0].length, i)),
            to: m(l, c(u, d, g.length, i))
          }
        }
      }
    }

    function f(e, t, r, l) {
      this.atOccurrence = !1, this.doc = e, r = r ? e.clipPos(r) : m(0, 0), this.pos = {
        from: r,
        to: r
      };
      var c;
      "object" == typeof l ? c = l.caseFold : (c = l, l = null), "string" == typeof t ? (null == c && (c = !1), this.matches = function(n, r) {
        return (n ? d : u)(e, t, r, c)
      }) : (t = n(t), l && l.multiline === !1 ? this.matches = function(n, r) {
        return (n ? a : i)(e, t, r)
      } : this.matches = function(n, r) {
        return (n ? s : o)(e, t, r)
      })
    }
    var h, p, m = e.Pos;
    String.prototype.normalize ? (h = function(e) {
      return e.normalize("NFD").toLowerCase()
    }, p = function(e) {
      return e.normalize("NFD")
    }) : (h = function(e) {
      return e.toLowerCase()
    }, p = function(e) {
      return e
    }), f.prototype = {
      findNext: function() {
        return this.find(!1)
      },
      findPrevious: function() {
        return this.find(!0)
      },
      find: function(t) {
        for (var n = this.matches(t, this.doc.clipPos(t ? this.pos.from : this.pos.to)); n && 0 == e.cmpPos(n.from, n.to);) t ? n.from.ch ? n.from = m(n.from.line, n.from.ch - 1) : n = n.from.line == this.doc.firstLine() ? null : this.matches(t, this.doc.clipPos(m(n.from.line - 1))) : n.to.ch < this.doc.getLine(n.to.line).length ? n.to = m(n.to.line, n.to.ch + 1) : n = n.to.line == this.doc.lastLine() ? null : this.matches(t, m(n.to.line + 1, 0));
        if (n) return this.pos = n, this.atOccurrence = !0, this.pos.match || !0;
        var r = m(t ? this.doc.firstLine() : this.doc.lastLine() + 1, 0);
        return this.pos = {
          from: r,
          to: r
        }, this.atOccurrence = !1
      },
      from: function() {
        return this.atOccurrence ? this.pos.from : void 0
      },
      to: function() {
        return this.atOccurrence ? this.pos.to : void 0
      },
      replace: function(t, n) {
        if (this.atOccurrence) {
          var r = e.splitLines(t);
          this.doc.replaceRange(r, this.pos.from, this.pos.to, n), this.pos.to = m(this.pos.from.line + r.length - 1, r[r.length - 1].length + (1 == r.length ? this.pos.from.ch : 0))
        }
      }
    }, e.defineExtension("getSearchCursor", function(e, t, n) {
      return new f(this.doc, e, t, n)
    }), e.defineDocExtension("getSearchCursor", function(e, t, n) {
      return new f(this, e, t, n)
    }), e.defineExtension("selectMatches", function(t, n) {
      for (var r = [], i = this.getSearchCursor(t, this.getCursor("from"), n); i.findNext() && !(e.cmpPos(i.to(), this.getCursor("to")) > 0);) r.push({
        anchor: i.from(),
        head: i.to()
      });
      r.length && this.setSelections(r, 0)
    })
  }), define.registerEnd(), define.register("codemirror/addon/search/search"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";

    function t(e, t) {
      return "string" == typeof e ? e = new RegExp(e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), t ? "gi" : "g") : e.global || (e = new RegExp(e.source, e.ignoreCase ? "gi" : "g")), {
        token: function(t) {
          e.lastIndex = t.pos;
          var n = e.exec(t.string);
          return n && n.index == t.pos ? (t.pos += n[0].length || 1, "searching") : void(n ? t.pos = n.index : t.skipToEnd())
        }
      }
    }

    function n() {
      this.posFrom = this.posTo = this.lastQuery = this.query = null, this.overlay = null
    }

    function r(e) {
      return e.state.search || (e.state.search = new n)
    }

    function i(e) {
      return "string" == typeof e && e == e.toLowerCase()
    }

    function o(e, t, n) {
      return e.getSearchCursor(t, n, {
        caseFold: i(t),
        multiline: !0
      })
    }

    function l(e, t, n, r, i) {
      e.openDialog(t, r, {
        value: n,
        selectValueOnOpen: !0,
        closeOnEnter: !1,
        onClose: function() {
          p(e)
        },
        onKeyDown: i
      })
    }

    function a(e, t, n, r, i) {
      e.openDialog ? e.openDialog(t, i, {
        value: r,
        selectValueOnOpen: !0
      }) : i(prompt(n, r))
    }

    function s(e, t, n, r) {
      e.openConfirm ? e.openConfirm(t, r) : confirm(n) && r[0]()
    }

    function c(e) {
      return e.replace(/\\(.)/g, function(e, t) {
        return "n" == t ? "\n" : "r" == t ? "\r" : t
      })
    }

    function u(e) {
      var t = e.match(/^\/(.*)\/([a-z]*)$/);
      if (t) try {
        e = new RegExp(t[1], -1 == t[2].indexOf("i") ? "" : "i")
      } catch (n) {} else e = c(e);
      return ("string" == typeof e ? "" == e : e.test("")) && (e = /x^/), e
    }

    function d(e, n, r) {
      n.queryText = r, n.query = u(r), e.removeOverlay(n.overlay, i(n.query)), n.overlay = t(n.query, i(n.query)), e.addOverlay(n.overlay), e.showMatchesOnScrollbar && (n.annotate && (n.annotate.clear(), n.annotate = null), n.annotate = e.showMatchesOnScrollbar(n.query, i(n.query)))
    }

    function f(t, n, i, o) {
      var s = r(t);
      if (s.query) return h(t, n);
      var c = t.getSelection() || s.lastQuery;
      if (i && t.openDialog) {
        var u = null,
          f = function(n, r) {
            e.e_stop(r), n && (n != s.queryText && (d(t, s, n), s.posFrom = s.posTo = t.getCursor()), u && (u.style.opacity = 1), h(t, r.shiftKey, function(e, n) {
              var r;
              n.line < 3 && document.querySelector && (r = t.display.wrapper.querySelector(".CodeMirror-dialog")) && r.getBoundingClientRect().bottom - 4 > t.cursorCoords(n, "window").top && ((u = r).style.opacity = .4)
            }))
          };
        l(t, v, c, f, function(n, i) {
          var o = e.keyName(n),
            l = e.keyMap[t.getOption("keyMap")][o];
          l || (l = t.getOption("extraKeys")[o]), "findNext" == l || "findPrev" == l || "findPersistentNext" == l || "findPersistentPrev" == l ? (e.e_stop(n), d(t, r(t), i), t.execCommand(l)) : ("find" == l || "findPersistent" == l) && (e.e_stop(n), f(i, n))
        }), o && c && (d(t, s, c), h(t, n))
      } else a(t, v, "Search for:", c, function(e) {
        e && !s.query && t.operation(function() {
          d(t, s, e), s.posFrom = s.posTo = t.getCursor(), h(t, n)
        })
      })
    }

    function h(t, n, i) {
      t.operation(function() {
        var l = r(t),
          a = o(t, l.query, n ? l.posFrom : l.posTo);
        (a.find(n) || (a = o(t, l.query, n ? e.Pos(t.lastLine()) : e.Pos(t.firstLine(), 0)), a.find(n))) && (t.setSelection(a.from(), a.to()), t.scrollIntoView({
          from: a.from(),
          to: a.to()
        }, 20), l.posFrom = a.from(), l.posTo = a.to(), i && i(a.from(), a.to()))
      })
    }

    function p(e) {
      e.operation(function() {
        var t = r(e);
        t.lastQuery = t.query, t.query && (t.query = t.queryText = null, e.removeOverlay(t.overlay), t.annotate && (t.annotate.clear(), t.annotate = null))
      })
    }

    function m(e, t, n) {
      e.operation(function() {
        for (var r = o(e, t); r.findNext();)
          if ("string" != typeof t) {
            var i = e.getRange(r.from(), r.to()).match(t);
            r.replace(n.replace(/\$(\d)/g, function(e, t) {
              return i[t]
            }))
          } else r.replace(n)
      })
    }

    function g(e, t) {
      if (!e.getOption("readOnly")) {
        var n = e.getSelection() || r(e).lastQuery,
          i = '<span class="CodeMirror-search-label">' + (t ? "Replace all:" : "Replace:") + "</span>";
        a(e, i + y, i, n, function(n) {
          n && (n = u(n), a(e, x, "Replace with:", "", function(r) {
            if (r = c(r), t) m(e, n, r);
            else {
              p(e);
              var i = o(e, n, e.getCursor("from")),
                l = function() {
                  var t, c = i.from();
                  !(t = i.findNext()) && (i = o(e, n), !(t = i.findNext()) || c && i.from().line == c.line && i.from().ch == c.ch) || (e.setSelection(i.from(), i.to()), e.scrollIntoView({
                    from: i.from(),
                    to: i.to()
                  }), s(e, b, "Replace?", [function() {
                    a(t)
                  }, l, function() {
                    m(e, n, r)
                  }]))
                },
                a = function(e) {
                  i.replace("string" == typeof n ? r : r.replace(/\$(\d)/g, function(t, n) {
                    return e[n]
                  })), l()
                };
              l()
            }
          }))
        })
      }
    }
    var v = '<span class="CodeMirror-search-label">Search:</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',
      y = ' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use /re/ syntax for regexp search)</span>',
      x = '<span class="CodeMirror-search-label">With:</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>',
      b = '<span class="CodeMirror-search-label">Replace?</span> <button>Yes</button> <button>No</button> <button>All</button> <button>Stop</button>';
    e.commands.find = function(e) {
      p(e), f(e)
    }, e.commands.findPersistent = function(e) {
      p(e), f(e, !1, !0)
    }, e.commands.findPersistentNext = function(e) {
      f(e, !1, !0, !0)
    }, e.commands.findPersistentPrev = function(e) {
      f(e, !0, !0, !0)
    }, e.commands.findNext = f, e.commands.findPrev = function(e) {
      f(e, !0)
    }, e.commands.clearSearch = p, e.commands.replace = g, e.commands.replaceAll = function(e) {
      g(e, !0)
    }
  }), define.registerEnd(), define.register("codemirror/addon/search/jump-to-line"),
  function(e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../dialog/dialog")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror", "../dialog/dialog"], e) : e(CodeMirror)
  }(function(e) {
    "use strict";

    function t(e, t, n, r, i) {
      e.openDialog ? e.openDialog(t, i, {
        value: r,
        selectValueOnOpen: !0
      }) : i(prompt(n, r))
    }

    function n(e, t) {
      var n = Number(t);
      return /^[-+]/.test(t) ? e.getCursor().line + n : n - 1
    }
    var r = 'Jump to line: <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">(Use line:column or scroll% syntax)</span>';
    e.commands.jumpToLine = function(e) {
      var i = e.getCursor();
      t(e, r, "Jump to line:", i.line + 1 + ":" + i.ch, function(t) {
        if (t) {
          var r;
          if (r = /^\s*([\+\-]?\d+)\s*\:\s*(\d+)\s*$/.exec(t)) e.setCursor(n(e, r[1]), Number(r[2]));
          else if (r = /^\s*([\+\-]?\d+(\.\d+)?)\%\s*/.exec(t)) {
            var o = Math.round(e.lineCount() * Number(r[1]) / 100);
            /^[-+]/.test(r[1]) && (o = i.line + o + 1), e.setCursor(o - 1, i.ch)
          } else(r = /^\s*\:?\s*([\+\-]?\d+)\s*/.exec(t)) && e.setCursor(n(e, r[1]), i.ch)
        }
      })
    }, e.keyMap["default"]["Alt-G"] = "jumpToLine"
  }), define.registerEnd(), define.register("codemirror-contrib/lib/mode/meta"),
  function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("codemirror/lib/codemirror"), require("codemirror/mode/meta")) : "function" == typeof define && define.amd ? define(["codemirror/lib/codemirror", "codemirror/mode/meta"], t) : t(e.CodeMirror, e.undefined)
  }(this, function(e, t) {
    "use strict";
    e = "default" in e ? e["default"] : e, e.modeInfo.push({
      name: "ABAP",
      mime: "text/abap",
      mode: "abap",
      ext: ["abap"],
      contrib: !0
    })
  }), define.registerEnd(), define("github/codemirror/loadmode", ["exports", "codemirror/lib/codemirror", "../typecast"], function(e, t, n) {
    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      }
    }

    function i(e, t) {
      var n = t;
      return function() {
        0 === --n && e()
      }
    }

    function o(e, t) {
      var n = s["default"].modes[e].dependencies;
      if (!n) return t();
      for (var r = [], o = 0; o < n.length; ++o) s["default"].modes.hasOwnProperty(n[o]) || r.push(n[o]);
      if (!r.length) return t();
      for (var l = i(t, r.length), a = 0; a < r.length; ++a) s["default"].requireMode(r[a], l)
    }

    function l(e, t) {
      if ("string" != typeof e && (e = e.name), s["default"].modes.hasOwnProperty(e)) return o(e, t);
      if (h.hasOwnProperty(e)) return h[e].push(t);
      var n = s["default"].findModeByName(e),
        r = n && n.contrib ? "/contrib" : "",
        i = f.replace(/%CONTRIB/, r).replace(/%N/g, e);
      window.CodeMirror = s["default"];
      var l = document.createElement("script");
      l.src = i;
      var a = document.getElementsByTagName("script")[0],
        c = h[e] = [t];
      if (s["default"].on(l, "load", function() {
          o(e, function() {
            for (var e = 0; e < c.length; ++e) c[e]()
          })
        }), null == a.parentNode) throw new Error("first script node must be in the document.");
      a.parentNode.insertBefore(l, a)
    }

    function a(e, t) {
      s["default"].modes.hasOwnProperty(t) || s["default"].requireMode(t, function() {
        e.setOption("mode", e.getOption("mode"))
      })
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.requireMode = l, e.autoLoadMode = a;
    var s = r(t),
      c = r(n),
      u = document.querySelector("link[rel=assets]"),
      d = u && c["default"](u, HTMLLinkElement).href || "/",
      f = d + "static/javascripts/codemirror%CONTRIB/mode/%N/%N.js?v=1",
      h = {}
  }), define("github/codemirror", ["exports", "./codemirror/loadmode", "codemirror/lib/codemirror", "codemirror/addon/comment/comment", "codemirror/mode/meta", "codemirror/addon/mode/simple", "codemirror/addon/mode/overlay", "codemirror/addon/mode/multiplex", "codemirror/addon/dialog/dialog", "codemirror/addon/search/search", "codemirror/addon/search/searchcursor", "codemirror/addon/search/jump-to-line", "codemirror-contrib/lib/mode/meta"], function(e, t, n) {
    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      }
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = r(n);
    i["default"].autoLoadMode = t.autoLoadMode, i["default"].requireMode = t.requireMode, i["default"].defineMode("conflict", function(e, t) {
      var n = {
        startState: function() {
          return {
            insideConflict: !1
          }
        },
        token: function(e, t) {
          if (e.sol()) {
            if (e.match(/^<<<<<<</)) return t.insideConflict = !0, e.skipToEnd(), "conflict-marker line-background-conflict-background";
            if (t.insideConflict && e.match(/^=======/)) return e.skipToEnd(), "conflict-marker line-background-conflict-background";
            if (t.insideConflict && e.match(/^>>>>>>>/)) return t.insideConflict = !1, e.skipToEnd(), "conflict-marker line-background-conflict-background"
          }
          return t.insideConflict ? (e.next(), "line-background-conflict-background") : (e.next(), null)
        },
        blankLine: function(e) {
          return e.insideConflict ? "line-background-conflict-background" : null
        }
      };
      if (t.baseMode) {
        var r = i["default"].getMode(e, t.baseMode);
        if ("null" !== r.name) return i["default"].overlayMode(r, n, !0);
        var o = i["default"].findModeByMIME(t.baseMode);
        i["default"].autoLoadMode(t.editor, o.mode)
      }
      return n
    }), i["default"].defineMIME("application/x-conflict", "conflict"), e["default"] = i["default"]
  }), define("github/editor/code-editor", ["exports", "../code-editor", "../codemirror", "../typecast", "../form", "delegated-events", "../hash-change", "../observe"], function(e, t, n, r, i, o, l, a) {
    function s(e) {
      return e && e.__esModule ? e : {
        "default": e
      }
    }

    function c(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function u(e) {
      var t = void 0,
        n = void 0,
        r = e.match(/\#?(?:L|-)(\d+)/gi);
      if (r) {
        var i = [];
        for (t = 0, n = r.length; n > t; t++) {
          var o = r[t];
          i.push(parseInt(o.replace(/\D/g, "")))
        }
        return i
      }
      return []
    }
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.CodeEditor = void 0;
    var d = s(n),
      f = s(r),
      h = s(l),
      p = function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
          }
        }
        return function(t, n, r) {
          return n && e(t.prototype, n), r && e(t, r), t
        }
      }(),
      m = e.CodeEditor = function() {
        function e(t) {
          if (c(this, e), this.container = t, this.container) {
            this.textarea = f["default"](this.container.querySelector(".js-code-textarea"), HTMLTextAreaElement), this.filename = this.textarea.getAttribute("data-filename") || "";
            var n = this.textarea.value,
              r = this.textarea.getAttribute("data-codemirror-mode");
            this.mergeMode = "true" === this.textarea.getAttribute("data-merge-mode");
            var i = this.textarea.clientHeight;
            this.textarea.style.display = "none";
            var o = {
              lineNumbers: !0,
              value: n,
              inputStyle: "contenteditable",
              theme: "github-light"
            };
            if (this.mergeMode && (o.gutters = ["CodeMirror-linenumbers", "merge-gutter"]), this.editor = d["default"](f["default"](this.textarea.parentNode, HTMLElement), o), 0 !== i) {
              var l = this.container.querySelector(".CodeMirror");
              l && (l.style.height = i + "px")
            }
            this.setMode(r), this.setupKeyBindings(), this.setupFormBindings(), this.setupControlBindings(), this.setupScrollOnHashChange()
          }
        }
        return p(e, [{
          key: "code",
          value: function() {
            return this.editor.getValue()
          }
        }, {
          key: "setCode",
          value: function(e) {
            this.editor.setValue(e)
          }
        }, {
          key: "focus",
          value: function() {
            this.editor.focus()
          }
        }, {
          key: "getDocument",
          value: function() {
            return this.editor.getDoc()
          }
        }, {
          key: "on",
          value: function(e, t) {
            this.container.addEventListener(e, t)
          }
        }, {
          key: "off",
          value: function(e, t) {
            this.container.removeEventListener(e, t)
          }
        }, {
          key: "setDocument",
          value: function(e) {
            this.editor.swapDoc(e), e.modeOption && "undefined" != typeof e.modeOption.name || this.setMode(e.modeOption)
          }
        }, {
          key: "loading",
          value: function(e) {
            return regeneratorRuntime.async(function(t) {
              for (;;) switch (t.prev = t.next) {
                case 0:
                  return this.editor.setOption("readOnly", !0), t.next = 3, regeneratorRuntime.awrap(e());
                case 3:
                  window.onbeforeunload = null, this.editor.setOption("readOnly", !1);
                case 5:
                case "end":
                  return t.stop()
              }
            }, null, this)
          }
        }, {
          key: "setMode",
          value: function(e) {
            if (this.mergeMode && (e = {
                name: "conflict",
                baseMode: e,
                editor: this.editor
              }), this.editor.setOption("mode", e), e && !this.mergeMode) {
              var t = d["default"].findModeByMIME(e);
              d["default"].autoLoadMode(this.editor, t.mode)
            }
          }
        }, {
          key: "setConfirmUnloadMessage",
          value: function(e) {
            this.confirmUnload = function() {
              return e
            }
          }
        }, {
          key: "clearConfirmUnloadMessage",
          value: function() {
            this.confirmUnload = null, window.onbeforeunload = null
          }
        }, {
          key: "setupFormBindings",
          value: function() {
            var e = this,
              t = function(t, n) {
                e.confirmUnload && (window.onbeforeunload = e.confirmUnload), i.changeValue(e.textarea, e.code()), o.fire(e.container, "change", {
                  editor: t,
                  changes: n
                })
              };
            if (this.editor.on("change", t), this.editor.on("swapDoc", t), this.confirmUnload) {
              var n = this.textarea.closest("form");
              if (null == n) return;
              n.addEventListener("submit", function() {
                return window.onbeforeunload = null
              })
            }
          }
        }, {
          key: "setupControlBindings",
          value: function() {
            var e = this,
              t = f["default"](this.container.querySelector(".js-code-indent-width"), HTMLSelectElement),
              n = f["default"](this.container.querySelector(".js-code-wrap-mode"), HTMLSelectElement),
              r = f["default"](this.container.querySelector(".js-code-indent-mode"), HTMLSelectElement);
            this.editor.setOption("tabSize", parseInt(t.value)), this.editor.setOption("indentUnit", parseInt(t.value)), this.editor.setOption("lineWrapping", "on" === n.value), this.editor.setOption("indentWithTabs", "space" !== r.value), t.addEventListener("change", function() {
              e.editor.setOption("tabSize", parseInt(t.value)), e.editor.setOption("indentUnit", parseInt(t.value))
            }), n.addEventListener("change", function() {
              e.editor.setOption("lineWrapping", null != n && "on" === n.value)
            }), r.addEventListener("change", function() {
              e.editor.setOption("indentWithTabs", "space" !== r.value)
            })
          }
        }, {
          key: "setupKeyBindings",
          value: function() {
            var e = this;
            this.editor.addKeyMap({
              Tab: function(t) {
                return t.somethingSelected() ? void t.indentSelection("add") : void("space" !== f["default"](e.container.querySelector(".js-code-indent-mode"), HTMLSelectElement).value ? t.replaceSelection("	", "end", "+input") : t.execCommand("insertSoftTab"))
              },
              "Shift-Tab": function(e) {
                e.indentSelection("subtract")
              },
              "Cmd-/": "toggleComment",
              "Ctrl-/": "toggleComment"
            })
          }
        }, {
          key: "setupScrollOnHashChange",
          value: function() {
            var e = this;
            h["default"](function() {
              var t = u(window.location.hash);
              t.length > 0 && (e.focus(), e.editor.setCursor({
                line: t[0] - 1,
                ch: 0
              }, {
                scroll: !0
              }))
            })
          }
        }]), e
      }();
    a.observe(".js-code-editor", function(e) {
      var n = t.getCodeEditor(e);
      if (!n) {
        n = new m(e);
        var r = e.getAttribute("data-github-confirm-unload") || "";
        ("yes" === r || "true" === r) && (r = ""), "no" !== r && "false" !== r && n.setConfirmUnloadMessage(r), t.setCodeEditor(e, n), o.fire(e, "codeEditor:ready")
      }
    })
  }), define("github/conflict-resolver", ["./fetch", "./codemirror", "./typecast", "./number-helpers", "./code-editor", "./observe", "delegated-events", "./inflector", "./sso"], function(e, t, n, r, i, o, l, a, s) {
    function c(e) {
      return e && e.__esModule ? e : {
        "default": e
      }
    }

    function u(e) {
      var t = v["default"](document.querySelector(".js-resolve-conflicts-form"), HTMLFormElement);
      return t.elements.namedItem(e)
    }

    function d(e) {
      var t = u(e);
      return x.get(t)
    }

    function f(e, t) {
      x.set(u(e), t)
    }

    function h(t) {
      var n, o, l, s, c = this;
      return regeneratorRuntime.async(function(u) {
        for (;;) switch (u.prev = u.next) {
          case 0:
            if (l = function() {
                var e = t.getAttribute("data-filename") || "",
                  n = "files[" + e + "]",
                  r = d(n);
                if (null == r) throw new Error("Expected data for " + n + " to be loaded and was not");
                p(r)
              }, n = document.querySelector(".js-code-editor")) {
              u.next = 4;
              break
            }
            return u.abrupt("return");
          case 4:
            return u.next = 6, regeneratorRuntime.awrap(i.getAsyncCodeEditor(n));
          case 6:
            if (o = u.sent, o.off("change", l), o.on("change", l), s = n.closest(".js-conflict-resolver"), null != s) {
              u.next = 12;
              break
            }
            return u.abrupt("return");
          case 12:
            s.classList.add("loading"), o.loading(function() {
              var n, i, l, u, h, y, x, b, w, C, S;
              return regeneratorRuntime.async(function(c) {
                for (;;) switch (c.prev = c.next) {
                  case 0:
                    if (n = t.getAttribute("data-filename")) {
                      c.next = 3;
                      break
                    }
                    return c.abrupt("return");
                  case 3:
                    for (i = "files[" + n + "]", l = v["default"](document.querySelector(".js-resolve-file-form"), HTMLFormElement), v["default"](l.elements.namedItem("filename"), HTMLInputElement).value = i, v["default"](l.querySelector(".js-filename"), HTMLElement).textContent = decodeURIComponent(n), l.classList.toggle("is-resolved", t.classList.contains("resolved")), u = !0, h = !1, y = void 0, c.prev = 11, x = v["default"](t.parentNode, HTMLElement).children[Symbol.iterator](); !(u = (b = x.next()).done); u = !0) w = b.value, w.classList.toggle("selected", w === t);
                    c.next = 19;
                    break;
                  case 15:
                    c.prev = 15, c.t0 = c["catch"](11), h = !0, y = c.t0;
                  case 19:
                    c.prev = 19, c.prev = 20, !u && x["return"] && x["return"]();
                  case 22:
                    if (c.prev = 22, !h) {
                      c.next = 25;
                      break
                    }
                    throw y;
                  case 25:
                    return c.finish(22);
                  case 26:
                    return c.finish(19);
                  case 27:
                    if (C = d(i)) {
                      c.next = 35;
                      break
                    }
                    return c.next = 31, regeneratorRuntime.awrap(e.fetchJSON(t.href));
                  case 31:
                    S = c.sent, C = {
                      document: g["default"].Doc(S.conflicted_file.data, S.conflicted_file.codemirror_mime_type),
                      headDocument: g["default"].Doc(S.head.data, S.head.codemirror_mime_type),
                      baseDocument: g["default"].Doc(S.base.data, S.base.codemirror_mime_type),
                      conflicts: []
                    }, p(C), f(i, C);
                  case 35:
                    s.classList.remove("loading"), o.setDocument(C.document), v["default"](document.querySelector(".js-code-editor .js-conflict-count"), HTMLElement).textContent = r.formatNumber(C.conflicts.length), a.pluralizeNode(C.conflicts.length, v["default"](document.querySelector(".js-code-editor .js-conflict-label"), HTMLElement)), m(1);
                  case 40:
                  case "end":
                    return c.stop()
                }
              }, null, c, [
                [11, 15, 19, 27],
                [20, , 22, 26]
              ])
            });
          case 14:
          case "end":
            return u.stop()
        }
      }, null, this)
    }

    function p(e) {
      var t = {};
      e.conflicts = [], e.document.eachLine(function(n) {
        if (n) {
          if (e.document.setGutterMarker(n, "merge-gutter", null), !t.start && /^<<<<<<</.test(n.text) ? t.start = n : t.start && /^=======/.test(n.text) ? t.middle = n : t.start && /^>>>>>>>/.test(n.text) && (t.end = n), t.start) {
            var r = ".js-line";
            t.start === n ? r = ".js-start" : t.middle === n ? r = ".js-middle" : t.end === n && (r = ".js-end");
            var i = v["default"](document.querySelector(".js-conflict-gutters " + r), HTMLElement).cloneNode(!0);
            e.document.setGutterMarker(n, "merge-gutter", i)
          }
          t.end && (e.conflicts.push(t), t = {})
        }
      })
    }

    function m(e) {
      var t = v["default"](document.querySelector(".js-resolve-file-form"), HTMLFormElement),
        n = v["default"](t.elements.namedItem("filename"), HTMLInputElement).value,
        r = d(n);
      if (null == r) throw new Error("Expected data for " + n + " to be loaded and was not");
      for (var i = r.document.getCursor().line, o = r.conflicts, l = null, a = e ? 0 : o.length - 1; e ? a < o.length : a >= 0; e ? a++ : a--) {
        var s = o[a].middle;
        if (null != s) {
          var c = r.document.getLineNumber(s);
          if (e && c > i || !e && i > c) {
            l = c;
            break
          }
        }
      }
      null != l && r.document.setCursor(l, 0), r.document.getEditor().focus()
    }
    var g = c(t),
      v = c(n),
      y = c(s),
      x = new WeakMap;
    l.on("click", ".js-conflicted-file", function(e) {
      h(this), e.preventDefault()
    }), l.on("click", ".js-prev-conflict", function(e) {
      m(!1), e.preventDefault()
    }), l.on("click", ".js-next-conflict", function(e) {
      m(!0), e.preventDefault()
    }), l.on("submit", ".js-resolve-file-form", function(e) {
      if (e.preventDefault(), !this.querySelector("button.js-mark-resolved").classList.contains("disabled")) {
        var t = document.querySelector(".js-conflicted-file.selected");
        t && t.classList.add("resolved");
        var n = document.querySelectorAll(".js-conflicted-file.resolved").length,
          r = document.querySelectorAll(".js-conflicted-file").length;
        if (n === r) {
          var i = document.querySelector(".js-resolve-conflicts-complete");
          i && i.classList.remove("d-none");
          var o = document.querySelector(".js-resolve-file-form");
          o && o.classList.add("is-resolved")
        }
        var l = t;
        if (null != l)
          do l = l.nextElementSibling; while (l && !l.classList.contains("js-conflicted-file"));
        return l ? h(v["default"](l, HTMLAnchorElement)) : void 0
      }
    }), l.on("submit", ".js-resolve-conflicts-form", function(t) {
      function n(t) {
        var n, r, o, l, a, s, c, u, f, h, p, m, g, y;
        return regeneratorRuntime.async(function(x) {
          for (;;) switch (x.prev = x.next) {
            case 0:
              n = new FormData(t), r = t.querySelectorAll(".js-file"), o = !0, l = !1, a = void 0, x.prev = 5, s = r[Symbol.iterator]();
            case 7:
              if (o = (c = s.next()).done) {
                x.next = 16;
                break
              }
              if (u = c.value, f = d(u.name), null != f) {
                x.next = 12;
                break
              }
              throw new Error("Expected data for " + u.name + " to be loaded and was not");
            case 12:
              n.append(u.name, f.document.getValue());
            case 13:
              o = !0, x.next = 7;
              break;
            case 16:
              x.next = 22;
              break;
            case 18:
              x.prev = 18, x.t0 = x["catch"](5), l = !0, a = x.t0;
            case 22:
              x.prev = 22, x.prev = 23, !o && s["return"] && s["return"]();
            case 25:
              if (x.prev = 25, !l) {
                x.next = 28;
                break
              }
              throw a;
            case 28:
              return x.finish(25);
            case 29:
              return x.finish(22);
            case 30:
              return x.next = 32, regeneratorRuntime.awrap(e.fetchJSON(t.action, {
                method: "POST",
                body: n
              }));
            case 32:
              if (h = x.sent, x.prev = 33, !h.error) {
                x.next = 36;
                break
              }
              throw new Error(h.error);
            case 36:
              return x.next = 38, regeneratorRuntime.awrap(e.fetchPoll(h.job.url));
            case 38:
              return p = v["default"](document.querySelector(".js-code-editor"), HTMLElement), x.next = 41, regeneratorRuntime.awrap(i.getAsyncCodeEditor(p));
            case 41:
              m = x.sent, m.clearConfirmUnloadMessage(), window.location.pathname += "/..", x.next = 52;
              break;
            case 46:
              x.prev = 46, x.t1 = x["catch"](33), g = document.querySelector(".js-resolve-conflicts-complete"), g && g.classList.toggle("d-none"), y = document.querySelector(".js-resolve-conflicts-failed"), y && y.classList.toggle("d-none");
            case 52:
            case "end":
              return x.stop();
          }
        }, null, this, [
          [5, 18, 22, 30],
          [23, , 25, 29],
          [33, 46]
        ])
      }
      t.preventDefault();
      var r = this;
      y["default"]().then(function() {
        n(r)
      })
    }), l.on("change", ".js-conflict-resolver .js-code-editor", function() {
      var e, t, n, r, o, l;
      return regeneratorRuntime.async(function(a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            return a.next = 2, regeneratorRuntime.awrap(i.getAsyncCodeEditor(this));
          case 2:
            if (e = a.sent, t = v["default"](document.querySelector(".js-resolve-file-form"), HTMLFormElement), n = v["default"](t.elements.namedItem("filename"), HTMLInputElement).value, r = d(n), null != r) {
              a.next = 8;
              break
            }
            throw new Error("Expected data for " + n + " to be loaded and was not");
          case 8:
            o = 0 !== r.conflicts.length || /^[<>]{7}/m.test(e.code()), l = this.querySelector("button.js-mark-resolved"), l.classList.toggle("disabled", o), l.classList.toggle("tooltipped", o), l.setAttribute("aria-label", l.getAttribute(o ? "data-disabled-label" : "data-label"));
          case 13:
          case "end":
            return a.stop()
        }
      }, null, this)
    }), o.observe(".js-conflict-list", function(e) {
      var t = e.querySelector(".js-conflicted-file");
      t && h(t);
      var n = document.querySelector(".new-discussion-timeline");
      n && n.classList.add("p-0")
    })
  }), define("github/editor", ["./editor/blob-editor", "./editor/code-editor", "./conflict-resolver"], function() {}), ghImport("github/editor")["catch"](function(e) {
    setTimeout(function() {
      throw e
    })
  });
