/**
 * CALLE NOMAD (callenomad.com) - CLIENT LOGIC
 * Practical Spanish for Digital Nomads
 * Features:
 * - Upgraded Natural Browser Speech Engine with Neural/Enhanced Voice Prioritization
 * - 1-Click Clipboard phrase copy
 * - Mobile drawer navigation toggle
 * - Clean FAQ Accordion
 */

(function () {
  'use strict';

  // Everyday Latin American Spanish Scenarios
  const SCENARIOS = {
    wifi: {
      category: '☕ Cafe & Workspace',
      phrase: '¡Buenas! ¿Cómo le va? ¿Me regala la clave del wifi y una mesita cerca al enchufe, porfa? Vengo a trabajar un ratico.',
      literal: 'Hello! How is it going? Could you give me the wifi password and a table near the socket, please? I have come to work for a little bit.',
      tip: 'In Colombia and across much of Latin America, opening with "¿Me regala...?" is the ultimate polite, warm greeting. Saying "un ratico" adds friendly natural warmth that staff love.',
      phonetic: 'bweh-nas! koh-moh leh vah? meh reh-gah-lah lah clah-veh del wee-fee ee oo-nah meh-see-tah serr-kah ahl en-choo-feh, por-fah? ven-goh ah trah-bah-har oon rah-tee-koh.'
    },
    rent: {
      category: '🏡 Apartment & Host Chat',
      phrase: 'Hola, buenas tardes. Me gustó muchísimo el apartamento. ¿Habría posibilidad de cuadrar un arriendo mensual directo si me quedo dos o tres meses?',
      literal: 'Hello, good afternoon. I really liked the apartment. Would there be a possibility to agree on a direct monthly rental if I stay two or three months?',
      tip: '"Cuadrar" is the universal Latin American verb for sorting out, aligning, or finalizing an agreement. Asking for an "arriendo mensual directo" is the natural way to propose bypassing app fees.',
      phonetic: 'oh-lah, bweh-nas tar-des. meh goos-toh moo-chee-see-moh el ah-par-tah-men-toh. ah-bree-ah poh-see-bee-lee-dad deh kwah-drar oon ah-ryen-doh men-soo-ahl dee-rek-toh...'
    },
    food: {
      category: '🍲 Local Eatery & Lunch',
      phrase: 'Buenas, ¿qué almuerzo tiene para hoy? ¿Viene con sopa o frijoles? Y me regala juguito natural en agua, por favor.',
      literal: 'Hello, what lunch do you have for today? Does it come with soup or beans? And could you give me natural fruit juice in water, please.',
      tip: 'Daily set menus (almuerzos del día) are the heartbeat of Latin America. Specifying "en agua" (in water) or "en leche" (with milk) is how you order fresh tropical fruit juices.',
      phonetic: 'bweh-nas, keh al-mwer-zoh tyen-eh pah-rah oy? vyeh-neh kon soh-pah oh free-hoh-les? ee meh reh-gah-lah hoo-gee-toh nah-too-ral en ah-gwah, por fah-vor.'
    },
    ride: {
      category: '🚕 Coordinating a Ride',
      phrase: 'Buenas, ya voy saliendo del edificio y estoy en la portería. Me avisa cuando esté afuera, porfa.',
      literal: 'Hello, I am now heading out of the building and I am at the main entrance gate. Let me know when you are outside, please.',
      tip: 'In South American apartment buildings, "la portería" is the 24/7 security gatehouse. Sending this quick WhatsApp note stops drivers from cancelling or waiting on the wrong corner.',
      phonetic: 'bweh-nas, yah voy sah-lyen-doh del eh-dee-fee-syoh ee es-toy en lah por-teh-ree-ah. meh ah-vee-sah kwahn-doh es-teh ah-fweh-rah, por-fah.'
    },
    social: {
      category: '🤝 Relaxed Social Banter',
      phrase: '¡Qué buen plan! Me encantaría. Vamos a tomar un café y charlar un rato. ¿A qué horas nos vemos?',
      literal: 'What a great plan! I would love to. Let us go grab a coffee and chat for a while. What time shall we meet?',
      tip: '"Charlar" (to chat) and "¡Qué buen plan!" are warm, friendly expressions used daily by locals. It sounds natural, open, and effortless.',
      phonetic: 'keh bwen plahn! meh en-kahn-tah-ree-ah. vah-mos ah toh-mar oon kah-feh ee char-lar oon rah-toh. ah keh oh-ras nos veh-mos?'
    }
  };

  let currentScenario = 'wifi';
  let availableVoices = [];

  // Voice population & discovery
  function loadVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices();
    }
  }

  loadVoices();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Intelligent Voice Picker: Prioritize Natural / Neural / Enhanced Spanish Voices
  function getBestSpanishVoice() {
    if (!availableVoices.length && 'speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices();
    }

    const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));
    if (!spanishVoices.length) return null;

    // 1. Natural / Neural online voices (Edge & modern browsers)
    const naturalVoice = spanishVoices.find(v => 
      v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Neural')
    );
    if (naturalVoice) return naturalVoice;

    // 2. Enhanced / Siri / Premium voices (macOS / iOS)
    const enhancedVoice = spanishVoices.find(v => 
      v.name.includes('Enhanced') || v.name.includes('Siri') || v.name.includes('Premium')
    );
    if (enhancedVoice) return enhancedVoice;

    // 3. Google High-Quality Spanish (Chrome)
    const googleVoice = spanishVoices.find(v => 
      v.name.includes('Google') && (v.lang === 'es-US' || v.lang === 'es-ES' || v.lang === 'es-419')
    );
    if (googleVoice) return googleVoice;

    // 4. Preferred natural sounding voices by name
    const preferredNames = ['Paulina', 'Luciana', 'Jorge', 'Juan', 'Angelica', 'Diego', 'Carlos', 'Soledad'];
    for (const name of preferredNames) {
      const match = spanishVoices.find(v => v.name.includes(name));
      if (match) return match;
    }

    // 5. Latin American tagged voice
    const latamVoice = spanishVoices.find(v => 
      v.lang === 'es-CO' || v.lang === 'es-419' || v.lang === 'es-US' || v.lang === 'es-MX'
    );
    if (latamVoice) return latamVoice;

    return spanishVoices[0];
  }

  const App = {
    init: function () {
      this.initLab();
      this.initNavigation();
      this.initFaq();
    },

    // 1. Everyday Spanish Lab
    initLab: function () {
      const scenarioBtns = document.querySelectorAll('.scenario-btn');
      const copyBtn = document.getElementById('btnCopyPhrase');
      const speakBtn = document.getElementById('btnSpeakPhrase');

      scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          scenarioBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentScenario = btn.getAttribute('data-scenario');
          this.renderLabPhrase();

          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            this.resetAudioBtn();
          }
        });
      });

      // Copy Button
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const phraseText = document.getElementById('labPhrase').innerText;
          navigator.clipboard.writeText(phraseText).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `<span>✓ Copied!</span>`;
            setTimeout(() => {
              copyBtn.innerHTML = originalHTML;
            }, 1800);
          }).catch(err => {
            console.error('Clipboard copy failed: ', err);
          });
        });
      }

      // Audio Speech Button
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          this.speakCurrentPhrase();
        });
      }

      this.renderLabPhrase();
    },

    renderLabPhrase: function () {
      const data = SCENARIOS[currentScenario];
      if (!data) return;

      const indicator = document.getElementById('labCityIndicator');
      const phrase = document.getElementById('labPhrase');
      const literal = document.getElementById('labLiteral');
      const tip = document.getElementById('labTip');
      const phonetic = document.getElementById('labPhonetic');

      if (indicator) indicator.innerText = data.category;
      if (phrase) phrase.innerText = `"${data.phrase}"`;
      if (literal) literal.innerText = `"${data.literal}"`;
      if (tip) tip.innerHTML = data.tip;
      if (phonetic) phonetic.innerText = data.phonetic;
    },

    speakCurrentPhrase: function () {
      const data = SCENARIOS[currentScenario];
      if (!data || !('speechSynthesis' in window)) {
        alert('Web Speech Synthesis is not supported in this browser.');
        return;
      }

      const speakBtn = document.getElementById('btnSpeakPhrase');

      // If already speaking, stop
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        this.resetAudioBtn();
        return;
      }

      // Set active speaking UI state
      if (speakBtn) {
        speakBtn.style.background = '#059669';
        speakBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span>Speaking...</span>
        `;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(data.phrase);

      const bestVoice = getBestSpanishVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = 'es-CO';
      }

      // Humanized cadence tuning
      utterance.rate = 0.88; // Slightly relaxed pace feels much more human and clear
      utterance.pitch = 1.0;

      utterance.onend = () => { this.resetAudioBtn(); };
      utterance.onerror = () => { this.resetAudioBtn(); };

      window.speechSynthesis.speak(utterance);
    },

    resetAudioBtn: function () {
      const speakBtn = document.getElementById('btnSpeakPhrase');
      if (speakBtn) {
        speakBtn.style.background = '';
        speakBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <span>Listen to Pronunciation</span>
        `;
      }
    },

    // 2. Navigation
    initNavigation: function () {
      const toggle = document.getElementById('mobileMenuToggle');
      const drawer = document.getElementById('mobileDrawer');
      const links = document.querySelectorAll('.mobile-link');

      if (toggle && drawer) {
        toggle.addEventListener('click', () => {
          const isOpen = drawer.classList.contains('open');
          if (isOpen) {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            drawer.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });

        links.forEach(l => {
          l.addEventListener('click', () => {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
          });
        });
      }
    },

    // 3. FAQ Accordion
    initFaq: function () {
      const items = document.querySelectorAll('.faq-item');
      items.forEach(item => {
        const btn = item.querySelector('.faq-q');
        if (!btn) return;

        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          items.forEach(i => {
            i.classList.remove('active');
            const q = i.querySelector('.faq-q');
            if (q) q.setAttribute('aria-expanded', 'false');
          });

          if (!isActive) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
          }
        });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
