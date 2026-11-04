/**
 * CalleNomad Street Tools
 * Pure vanilla JavaScript, zero dependencies, no tracking.
 */
(function () {
  'use strict';

  var data = null;
  var currentSrc = null;

  // Cache DOM nodes
  var tabButtons = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');

  // Tool A elements
  var formToolA = document.getElementById('priceCheckerForm');
  var selectCategory = document.getElementById('categorySelect');
  var selectCity = document.getElementById('citySelect');
  var inputPrice = document.getElementById('priceInput');
  var containerResultA = document.getElementById('toolAResult');

  // Tool B elements
  var selectSituation = document.getElementById('situationSelect');
  var selectMessage = document.getElementById('messageSelect');
  var radioTonePolite = document.getElementById('tonePolite');
  var radioToneFirm = document.getElementById('toneFirm');
  var containerVariables = document.getElementById('variablesContainer');
  var containerResultB = document.getElementById('toolBResult');
  var textSpanish = document.getElementById('messageSpanish');
  var textEnglish = document.getElementById('messageEnglish');
  var btnCopyMessage = document.getElementById('btnCopyMessage');
  var btnSendWhatsApp = document.getElementById('btnSendWhatsApp');
  var copyFeedbackB = document.getElementById('copyFeedbackB');

  // Attribution parameter handling
  function initAttribution() {
    try {
      var params = new URLSearchParams(window.location.search);
      currentSrc = params.get('src');
      if (currentSrc) {
        updateOutboundLinks(currentSrc);
      }
    } catch (e) {
      // Fallback gracefully if URLSearchParams is unavailable
    }
  }

  function appendParam(url, key, val) {
    if (!val) return url;
    try {
      var parsed = new URL(url, window.location.origin);
      parsed.searchParams.set(key, val);
      return parsed.toString();
    } catch (e) {
      var sep = url.indexOf('?') === -1 ? '?' : '&';
      return url + sep + encodeURIComponent(key) + '=' + encodeURIComponent(val);
    }
  }

  function updateOutboundLinks(srcVal) {
    var links = document.querySelectorAll('a[data-track-src]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href) {
        links[i].setAttribute('href', appendParam(href, 'src', srcVal));
      }
    }
  }

  // Tabs management
  function initTabs() {
    var initialTab = 'tab-price';
    try {
      var savedTab = localStorage.getItem('callenomad_tool_tab');
      if (savedTab && document.getElementById(savedTab)) {
        initialTab = savedTab;
      }
    } catch (e) {}

    switchTab(initialTab, false);

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('aria-controls');
        switchTab(targetId, true);
      });

      btn.addEventListener('keydown', function (e) {
        var buttonsArray = Array.prototype.slice.call(tabButtons);
        var index = buttonsArray.indexOf(btn);
        var nextIndex = -1;

        if (e.key === 'ArrowRight') {
          nextIndex = (index + 1) % buttonsArray.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (index - 1 + buttonsArray.length) % buttonsArray.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = buttonsArray.length - 1;
        }

        if (nextIndex !== -1) {
          e.preventDefault();
          buttonsArray[nextIndex].focus();
          switchTab(buttonsArray[nextIndex].getAttribute('aria-controls'), true);
        }
      });
    });
  }

  function switchTab(panelId, persist) {
    tabPanels.forEach(function (panel) {
      var matches = panel.id === panelId;
      panel.classList.toggle('active', matches);
      panel.setAttribute('aria-hidden', matches ? 'false' : 'true');
    });

    tabButtons.forEach(function (btn) {
      var matches = btn.getAttribute('aria-controls') === panelId;
      btn.setAttribute('aria-selected', matches ? 'true' : 'false');
      btn.tabIndex = matches ? 0 : -1;
    });

    if (persist) {
      try {
        localStorage.setItem('callenomad_tool_tab', panelId);
      } catch (e) {}
    }
  }

  // Clipboard utility with textarea fallback
  function copyText(str, feedbackEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(function () {
        showFeedback(feedbackEl, 'Copied to clipboard');
      }).catch(function () {
        fallbackCopyText(str, feedbackEl);
      });
    } else {
      fallbackCopyText(str, feedbackEl);
    }
  }

  function fallbackCopyText(str, feedbackEl) {
    var textArea = document.createElement('textarea');
    textArea.value = str;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var success = document.execCommand('copy');
      if (success) {
        showFeedback(feedbackEl, 'Copied to clipboard');
      } else {
        showFeedback(feedbackEl, 'Please select and copy manually');
      }
    } catch (err) {
      showFeedback(feedbackEl, 'Please select and copy manually');
    }
    document.body.removeChild(textArea);
  }

  function showFeedback(el, msg) {
    if (!el) return;
    el.textContent = msg;
    setTimeout(function () {
      el.textContent = '';
    }, 2500);
  }

  // Share utility
  function triggerShare() {
    var shareUrl = 'https://callenomad.com/tools/?src=share';
    var shareText = 'Found this useful for checking whether a price is fair in Colombia. Free, no sign-up: ' + shareUrl;

    if (navigator.share) {
      navigator.share({
        title: 'CalleNomad Street Tools',
        text: shareText
      }).catch(function () {
        // User cancelled or share failed; do not force popup
      });
    } else {
      var whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(shareText);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Build Tool A UI
  function populateToolASelects() {
    if (!data || !data.tool_a) return;

    selectCategory.innerHTML = '';
    data.tool_a.categories.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name + ' (' + cat.unit_description + ')';
      selectCategory.appendChild(opt);
    });

    selectCity.innerHTML = '';
    data.tool_a.cities.forEach(function (city) {
      var opt = document.createElement('option');
      opt.value = city.id;
      opt.textContent = city.name;
      selectCity.appendChild(opt);
    });
  }

  function handlePriceCheck(e) {
    e.preventDefault();
    if (!data || !data.tool_a) return;

    var catId = selectCategory.value;
    var cityId = selectCity.value;
    var rawPrice = inputPrice.value.replace(/[^\d]/g, '');
    var price = parseInt(rawPrice, 10);

    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price in Colombian Pesos (COP).');
      inputPrice.focus();
      return;
    }

    var category = data.tool_a.categories.find(function (c) {
      return c.id === catId;
    });

    if (!category) return;

    var range = category.ranges && category.ranges[cityId];
    var verdictText = '';
    var verdictClass = '';
    var hasValidRange = false;

    if (range && typeof range.min === 'number' && typeof range.max === 'number' && range.status !== 'TO VERIFY') {
      hasValidRange = true;
      if (price <= range.max) {
        verdictText = 'Within the usual range';
        verdictClass = 'verdict-within';
      } else if (price <= Math.round(range.max * 1.30)) {
        verdictText = 'A little high, worth a counter-offer';
        verdictClass = 'verdict-high';
      } else {
        verdictText = 'Well above the usual range';
        verdictClass = 'verdict-above';
      }
    } else {
      verdictText = data.meta.missing_range_message || 'We do not have a reliable range for this yet.';
      verdictClass = 'verdict-missing';
    }

    renderToolAResult(category, verdictText, verdictClass, hasValidRange);
  }

  function renderToolAResult(category, verdictText, verdictClass, hasValidRange) {
    containerResultA.innerHTML = '';
    containerResultA.style.display = 'block';

    var box = document.createElement('div');
    box.className = 'result-box';

    // Verdict banner
    var verdict = document.createElement('div');
    verdict.className = 'verdict-banner ' + verdictClass;
    verdict.textContent = verdictText;
    box.appendChild(verdict);

    // Counter phrase section
    if (category.counter_phrase) {
      var phraseCard = document.createElement('div');
      phraseCard.className = 'phrase-card';

      var phraseLabel = document.createElement('div');
      phraseLabel.className = 'message-label';
      phraseLabel.textContent = 'Recommended Spanish response';
      phraseCard.appendChild(phraseLabel);

      var pSpanish = document.createElement('div');
      pSpanish.className = 'phrase-spanish';
      pSpanish.textContent = category.counter_phrase.spanish;
      phraseCard.appendChild(pSpanish);

      if (category.counter_phrase.phonetic) {
        var pPhonetic = document.createElement('div');
        pPhonetic.className = 'phrase-phonetic';
        pPhonetic.textContent = 'Pronunciation: ' + category.counter_phrase.phonetic;
        phraseCard.appendChild(pPhonetic);
      }

      if (category.counter_phrase.english) {
        var pEnglish = document.createElement('div');
        pEnglish.className = 'phrase-english';
        pEnglish.textContent = category.counter_phrase.english;
        phraseCard.appendChild(pEnglish);
      }

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn-secondary';
      copyBtn.style.marginTop = '10px';
      copyBtn.textContent = 'Copy phrase';

      var feedbackA = document.createElement('div');
      feedbackA.className = 'copy-feedback';

      copyBtn.addEventListener('click', function () {
        copyText(category.counter_phrase.spanish, feedbackA);
      });

      phraseCard.appendChild(copyBtn);
      phraseCard.appendChild(feedbackA);
      box.appendChild(phraseCard);
    }

    // Disclaimer
    var disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer-note';
    var lastUpdated = (data.meta && data.meta.last_updated) ? ' Last updated: ' + data.meta.last_updated + '.' : '';
    var cityName = selectCity.options[selectCity.selectedIndex] ? selectCity.options[selectCity.selectedIndex].text : '';
    var reportSubject = encodeURIComponent('Report wrong price: ' + category.name + ' in ' + cityName);
    disclaimer.innerHTML = (data.meta && data.meta.disclaimer ? data.meta.disclaimer : '') + lastUpdated +
      ' <a href="mailto:hola@callenomad.com?subject=' + reportSubject + '" class="report-price-link" style="margin-left: 6px;">Report a wrong price.</a>';
    box.appendChild(disclaimer);

    // In-result Quiet CTA
    var auditCta = document.createElement('div');
    auditCta.className = 'result-audit-cta';
    var auditUrl = appendParam('https://cal.com/callenomad/20min', 'src', currentSrc);
    auditCta.innerHTML = 'Want to practise saying it out loud? <a href="' + auditUrl + '" target="_blank" rel="noopener noreferrer">Book a free 20-minute Fluency Audit.</a>';
    box.appendChild(auditCta);

    // Share button
    var shareBlock = document.createElement('div');
    shareBlock.className = 'share-block';

    var shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-primary btn-full';
    shareBtn.textContent = 'Send this tool to a friend';
    shareBtn.addEventListener('click', triggerShare);

    shareBlock.appendChild(shareBtn);
    box.appendChild(shareBlock);

    containerResultA.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Tool B: Landlord WhatsApp translator
  var variableValues = {};

  function populateToolBSituations() {
    if (!data || !data.tool_b) return;

    selectSituation.innerHTML = '';
    data.tool_b.situations.forEach(function (sit) {
      var opt = document.createElement('option');
      opt.value = sit.id;
      opt.textContent = sit.title;
      selectSituation.appendChild(opt);
    });

    handleSituationChange();
  }

  function handleSituationChange() {
    if (!data || !data.tool_b) return;
    var sitId = selectSituation.value;
    var situation = data.tool_b.situations.find(function (s) {
      return s.id === sitId;
    });

    if (!situation) return;

    selectMessage.innerHTML = '';
    situation.messages.forEach(function (msg) {
      var opt = document.createElement('option');
      opt.value = msg.id;
      opt.textContent = msg.title;
      selectMessage.appendChild(opt);
    });

    handleMessageOrToneChange();
  }

  function extractPlaceholders(str) {
    if (!str) return [];
    var matches = str.match(/\[([a-zA-Z0-9_-]+)\]/g);
    if (!matches) return [];
    var unique = [];
    matches.forEach(function (m) {
      var key = m.slice(1, -1);
      if (unique.indexOf(key) === -1) {
        unique.push(key);
      }
    });
    return unique;
  }

  function handleMessageOrToneChange() {
    if (!data || !data.tool_b) return;

    var sitId = selectSituation.value;
    var msgId = selectMessage.value;
    var isFirm = radioToneFirm.checked;
    var toneKey = isFirm ? 'firm' : 'polite';

    var situation = data.tool_b.situations.find(function (s) {
      return s.id === sitId;
    });
    if (!situation) return;

    var message = situation.messages.find(function (m) {
      return m.id === msgId;
    });
    if (!message) return;

    var toneData = message.tones && message.tones[toneKey];
    if (!toneData) return;

    // Detect placeholders across Spanish and English versions
    var placeholdersEs = extractPlaceholders(toneData.spanish);
    var placeholdersEn = extractPlaceholders(toneData.english);
    var allPlaceholders = [];
    placeholdersEs.concat(placeholdersEn).forEach(function (p) {
      if (allPlaceholders.indexOf(p) === -1) {
        allPlaceholders.push(p);
      }
    });

    renderVariableInputs(allPlaceholders);
    updateToolBPreview(toneData);
  }

  function renderVariableInputs(placeholders) {
    containerVariables.innerHTML = '';
    if (placeholders.length === 0) {
      containerVariables.style.display = 'none';
      return;
    }

    containerVariables.style.display = 'grid';

    placeholders.forEach(function (ph) {
      var wrapper = document.createElement('div');
      wrapper.className = 'variable-item';

      var label = document.createElement('label');
      label.setAttribute('for', 'var_' + ph);
      label.textContent = ph.replace(/_/g, ' ');

      var input = document.createElement('input');
      input.type = 'text';
      input.id = 'var_' + ph;
      input.className = 'variable-input';
      input.placeholder = '[' + ph + ']';
      input.value = variableValues[ph] || '';

      input.addEventListener('input', function () {
        variableValues[ph] = input.value;
        refreshToolBText();
      });

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      containerVariables.appendChild(wrapper);
    });
  }

  function getActiveToneData() {
    var sitId = selectSituation.value;
    var msgId = selectMessage.value;
    var isFirm = radioToneFirm.checked;
    var toneKey = isFirm ? 'firm' : 'polite';

    var situation = data.tool_b.situations.find(function (s) {
      return s.id === sitId;
    });
    if (!situation) return null;

    var message = situation.messages.find(function (m) {
      return m.id === msgId;
    });
    if (!message) return null;

    return message.tones && message.tones[toneKey];
  }

  function replacePlaceholders(template) {
    if (!template) return '';
    return template.replace(/\[([a-zA-Z0-9_-]+)\]/g, function (match, key) {
      if (variableValues[key] && variableValues[key].trim() !== '') {
        return variableValues[key].trim();
      }
      return match;
    });
  }

  function refreshToolBText() {
    var toneData = getActiveToneData();
    if (!toneData) return;
    updateToolBPreview(toneData);
  }

  function updateToolBPreview(toneData) {
    var processedSpanish = replacePlaceholders(toneData.spanish);
    var processedEnglish = replacePlaceholders(toneData.english);

    textSpanish.textContent = processedSpanish;
    textEnglish.textContent = processedEnglish;

    btnSendWhatsApp.href = 'https://wa.me/?text=' + encodeURIComponent(processedSpanish);

    btnCopyMessage.onclick = function () {
      copyText(processedSpanish, copyFeedbackB);
    };

    containerResultB.style.display = 'block';
  }

  // Initialise
  function init() {
    initAttribution();
    initTabs();

    // Set up share button inside Tool B
    var shareBtnB = document.getElementById('btnShareToolB');
    if (shareBtnB) {
      shareBtnB.addEventListener('click', triggerShare);
    }

    // Set up form submission for Tool A
    if (formToolA) {
      formToolA.addEventListener('submit', handlePriceCheck);
    }

    // Tool B events
    if (selectSituation) {
      selectSituation.addEventListener('change', handleSituationChange);
    }
    if (selectMessage) {
      selectMessage.addEventListener('change', handleMessageOrToneChange);
    }
    if (radioTonePolite) {
      radioTonePolite.addEventListener('change', handleMessageOrToneChange);
    }
    if (radioToneFirm) {
      radioToneFirm.addEventListener('change', handleMessageOrToneChange);
    }

    // Fetch data.json
    fetch('data.json')
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Could not load data.json');
        }
        return res.json();
      })
      .then(function (json) {
        data = json;
        populateToolASelects();
        populateToolBSituations();
      })
      .catch(function (err) {
        var errorMsg = document.createElement('div');
        errorMsg.className = 'verdict-banner verdict-missing';
        errorMsg.textContent = 'Could not load price and template data. Please reload the page.';
        var main = document.querySelector('main');
        if (main) main.insertBefore(errorMsg, main.firstChild);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
