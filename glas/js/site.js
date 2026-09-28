(function () {
  'use strict';

  var THEME_KEY = 'mediahead-events-theme';

  function readTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* приватный режим или file:// — просто не запоминаем */
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var buttons = document.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute('data-theme-set') === theme;
      buttons[i].classList.toggle('is-active', isActive);
    }
  }

  function initThemes() {
    applyTheme(readTheme() || 'academic');
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-theme-set]');
      if (!button) { return; }
      event.preventDefault();
      var theme = button.getAttribute('data-theme-set');
      applyTheme(theme);
      writeTheme(theme);
    });
  }

  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var bar = document.querySelector('[data-nav]');
    if (!toggle || !bar) { return; }
    toggle.addEventListener('click', function () {
      bar.classList.toggle('is-open');
    });
  }

  function initAfishaFilters() {
    var afisha = document.querySelector('.afisha');
    if (!afisha) { return; }

    var activeVenue = 'all';
    var monthButton = document.querySelector('.month.is-active');
    var activeMonth = monthButton ? monthButton.getAttribute('data-month') : null;

    function apply() {
      var children = afisha.children;
      var currentDay = null;
      var dayHasRows = false;

      function closeDay() {
        if (currentDay) { currentDay.classList.toggle('is-hidden', !dayHasRows); }
      }

      for (var i = 0; i < children.length; i++) {
        var node = children[i];
        if (node.classList.contains('afisha__day')) {
          closeDay();
          currentDay = node;
          dayHasRows = false;
          continue;
        }
        var okMonth = !activeMonth || node.getAttribute('data-month') === activeMonth;
        var okVenue = activeVenue === 'all'
          || node.getAttribute('data-venue') === activeVenue;
        var visible = okMonth && okVenue;
        node.classList.toggle('is-hidden', !visible);
        if (visible) { dayHasRows = true; }
      }
      closeDay();
    }

    document.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-filter-group="venue"]');
      if (chip) {
        var group = chip.parentNode.querySelectorAll('[data-filter-group="venue"]');
        for (var i = 0; i < group.length; i++) {
          group[i].classList.toggle('is-active', group[i] === chip);
        }
        activeVenue = chip.getAttribute('data-filter-value');
        apply();
        return;
      }

      var month = event.target.closest('[data-month].month');
      if (month) {
        var months = month.parentNode.querySelectorAll('.month');
        for (var j = 0; j < months.length; j++) {
          months[j].classList.toggle('is-active', months[j] === month);
        }
        activeMonth = month.getAttribute('data-month');
        apply();
      }
    });

    apply();
  }

  function initCategoryFilters() {
    document.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-filter-group="category"]');
      if (!chip) { return; }

      var chips = chip.parentNode.querySelectorAll(
        '[data-filter-group="category"]');
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.toggle('is-active', chips[i] === chip);
      }

      var value = chip.getAttribute('data-filter-value');
      var grid = chip.parentNode.nextElementSibling;
      if (!grid) { return; }

      var cards = grid.querySelectorAll('[data-category]');
      for (var j = 0; j < cards.length; j++) {
        var categories = cards[j].getAttribute('data-category').split(' ');
        var visible = value === 'all' || categories.indexOf(value) !== -1;
        cards[j].classList.toggle('is-hidden', !visible);
      }
    });
  }

  function initAccordions() {
    document.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) { return; }
      var accordion = toggle.closest('[data-accordion]');
      if (accordion) { accordion.classList.toggle('is-open'); }
    });
  }

  function initTabs() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-tab-target]');
      if (!link) { return; }

      var section = link.closest('.section');
      if (!section) { return; }

      var links = section.querySelectorAll('[data-tab-target]');
      for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle('is-active', links[i] === link);
      }

      var target = link.getAttribute('data-tab-target');
      var panels = section.querySelectorAll('[data-tab-panel]');
      for (var j = 0; j < panels.length; j++) {
        var isTarget = panels[j].getAttribute('data-tab-panel') === target;
        panels[j].classList.toggle('is-hidden', !isTarget);
      }
    });
  }

  function initSlider() {
    var slider = document.querySelector('[data-slider]');
    if (!slider) { return; }

    var slides = slider.querySelectorAll('[data-slider-slide]');
    if (!slides.length) { return; }
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('is-active', i === current);
      }
      var dots = slider.querySelectorAll('[data-slider-dot]');
      for (var j = 0; j < dots.length; j++) {
        var value = parseInt(dots[j].getAttribute('data-slider-dot'), 10);
        dots[j].classList.toggle('is-active', value === current);
      }
    }

    slider.addEventListener('click', function (event) {
      if (event.target.closest('[data-slider-next]')) { show(current + 1); return; }
      if (event.target.closest('[data-slider-prev]')) { show(current - 1); return; }
      var dot = event.target.closest('[data-slider-dot]');
      if (dot) { show(parseInt(dot.getAttribute('data-slider-dot'), 10)); }
    });

    show(0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemes();
    initNav();
    initAfishaFilters();
    initCategoryFilters();
    initAccordions();
    initTabs();
    initSlider();
  });
})();
