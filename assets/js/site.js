(function () {
  'use strict';

  // ----- Hide events that have already ended -----
  // The site is static, so "upcoming" lists are trimmed in the browser.
  var today = new Date();
  var todayStr = today.getFullYear() + '-' +
    String(today.getMonth() + 1).padStart(2, '0') + '-' +
    String(today.getDate()).padStart(2, '0');

  // Any card or row whose edition has ended stops showing its dates, and is
  // dropped from upcoming lists, sponsored or not.
  document.querySelectorAll('[data-end]').forEach(function (el) {
    if (el.getAttribute('data-end') >= todayStr) return;
    el.classList.remove('is-live');
    el.classList.add('is-past');
  });

  // Convention pages: show the "this edition has ended" note.
  document.querySelectorAll('[data-ended-note]').forEach(function (el) {
    if (el.getAttribute('data-ended-note') < todayStr) {
      el.hidden = false;
      document.querySelectorAll('[data-hide-when-ended]').forEach(function (x) { x.hidden = true; });
      document.querySelectorAll('[data-show-when-ended]').forEach(function (x) { x.hidden = false; });
    }
  });

  document.querySelectorAll('[data-upcoming]').forEach(function (list) {
    var limit = parseInt(list.getAttribute('data-limit'), 10);
    if (limit) {
      var shown = 0;
      Array.prototype.forEach.call(list.children, function (el) {
        if (el.classList.contains('is-past')) return;
        if (shown >= limit) el.hidden = true; else shown++;
      });
    }

    // Calendar: hide month headings whose rows are all past.
    list.querySelectorAll('[data-month-head]').forEach(function (h) {
      var ol = h.nextElementSibling;
      if (ol && !ol.querySelector('.cal-row:not(.is-past)')) {
        h.classList.add('is-empty');
        ol.hidden = true;
      }
    });
  });

  // ----- Directory filters -----
  var form = document.querySelector('[data-filters]');
  if (form) {
    var results = document.querySelector('[data-results]');
    var cards = results.querySelectorAll('.card');
    var countEl = form.querySelector('[data-count]');
    var emptyEl = document.querySelector('[data-empty]');
    var params = new URLSearchParams(location.search);

    ['type', 'region', 'month'].forEach(function (key) {
      var val = params.get(key);
      if (!val) return;
      var field = form.elements[key];
      if (field) field.value = val;
    });

    function apply() {
      var type = form.elements.type.value;
      var region = form.elements.region.value;
      var month = form.elements.month.value;
      var n = 0;
      cards.forEach(function (card) {
        var ok = (!type || card.dataset.type === type) &&
                 (!region || card.dataset.region === region) &&
                 (!month || card.dataset.month === month);
        card.hidden = !ok;
        if (ok) n++;
      });
      countEl.textContent = n;
      emptyEl.hidden = n !== 0;

      var q = new URLSearchParams();
      if (type) q.set('type', type);
      if (region) q.set('region', region);
      if (month) q.set('month', month);
      var qs = q.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    }

    form.addEventListener('change', apply);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    document.querySelector('[data-reset]').addEventListener('click', function () {
      form.reset();
      apply();
    });
    apply();
  }

  // ----- Click tracking (GA4) -----
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el || typeof window.gtag !== 'function') return;
    var kind = el.getAttribute('data-track');
    var label = el.getAttribute('data-track-label') || '';
    var name = kind === 'outbound' ? 'outbound_click' : kind === 'lead' ? 'generate_lead' : 'promo_click';
    window.gtag('event', name, {
      link_label: label,
      link_url: el.href || '',
      transport_type: 'beacon'
    });
  });
})();
