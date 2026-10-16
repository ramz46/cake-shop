/**
 * MAISON ÉLYSÉE - TASTING STUDIO & BOX BUILDER
 * Interactive flavor customizer, monogram wax seal studio, appointment booking form
 */

(function () {
  'use strict';

  // State for interactive tasting box
  const customizerState = {
    sponge: {
      name: 'Tahitian Vanilla Bean Genoese',
      notes: 'Fragrant double-fold Tahitian vanilla infused with organic bourbon cream.'
    },
    filling: {
      name: 'Blackberry Champagne Confit',
      notes: 'Reduction of wild blackberries simmered with Premier Cru Brut Champagne.'
    },
    finish: {
      name: 'Stucco White Chocolate Ganache',
      notes: 'Hand-troweled tempered Swiss white chocolate ganache with subtle stone texture.'
    }
  };

  // Attach option pills
  function initCustomizer() {
    const spongePills = document.querySelectorAll('[data-customizer-step="sponge"]');
    const fillingPills = document.querySelectorAll('[data-customizer-step="filling"]');
    const finishPills = document.querySelectorAll('[data-customizer-step="finish"]');

    function updatePills(pillList, stepKey) {
      pillList.forEach(pill => {
        pill.addEventListener('click', () => {
          pillList.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const name = pill.querySelector('.option-name')?.textContent || '';
          const notes = pill.querySelector('.option-desc')?.textContent || '';
          customizerState[stepKey] = { name, notes };
          updateSummaryReceipt();
        });
      });
    }

    updatePills(spongePills, 'sponge');
    updatePills(fillingPills, 'filling');
    updatePills(finishPills, 'finish');

    const applyToFormBtn = document.getElementById('applyBoxToFormBtn');
    if (applyToFormBtn) {
      applyToFormBtn.addEventListener('click', () => {
        const notesField = document.getElementById('tastingFlavorNotes');
        if (notesField) {
          notesField.value = `Selected Tasting Box:\n• Sponge: ${customizerState.sponge.name}\n• Filling: ${customizerState.filling.name}\n• Exterior: ${customizerState.finish.name}`;
          notesField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          notesField.focus();
          if (window.showToast) {
            window.showToast('Your custom tasting box has been added to your appointment form!', 'success');
          }
        }
      });
    }
  }

  function updateSummaryReceipt() {
    const spongeDisplay = document.getElementById('summarySponge');
    const fillingDisplay = document.getElementById('summaryFilling');
    const finishDisplay = document.getElementById('summaryFinish');
    const pairingDisplay = document.getElementById('summaryPairing');

    [spongeDisplay, fillingDisplay, finishDisplay].forEach(el => {
      if (el) {
        el.classList.add('val-updated');
        setTimeout(() => el.classList.remove('val-updated'), 350);
      }
    });

    if (spongeDisplay) spongeDisplay.textContent = customizerState.sponge.name;
    if (fillingDisplay) fillingDisplay.textContent = customizerState.filling.name;
    if (finishDisplay) finishDisplay.textContent = customizerState.finish.name;

    if (pairingDisplay) {
      if (customizerState.sponge.name.includes('Chocolate') || customizerState.filling.name.includes('Praline')) {
        pairingDisplay.textContent = 'Sommelier recommendation: Vintage Tawny Port or Espresso Stout reduction';
      } else if (customizerState.sponge.name.includes('Citrus') || customizerState.filling.name.includes('Champagne')) {
        pairingDisplay.textContent = 'Sommelier recommendation: Blanc de Blancs Champagne or Elderflower spritz';
      } else {
        pairingDisplay.textContent = 'Sommelier recommendation: Brut Rosé or Sparkling Jasmine Tea';
      }
    }
  }

  // --- Monogram & Wax Seal Live Studio ---
  function initMonogramStudio() {
    const initialsInput = document.getElementById('monogramInitials');
    const dateInput = document.getElementById('monogramDate');
    const sealText = document.getElementById('sealMonogramText');
    const sealDate = document.getElementById('sealDateText');

    if (initialsInput && sealText) {
      initialsInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase() || 'E & L';
        sealText.textContent = val;
      });
    }

    if (dateInput && sealDate) {
      dateInput.addEventListener('input', (e) => {
        const val = e.target.value.trim().toUpperCase() || 'OCTOBER 2026';
        sealDate.textContent = val;
      });
    }
  }

  // --- Input Restriction Helpers (Alphabet only / Numbers only) ---
  function restrictToAlphabets(inputEl) {
    if (!inputEl) return;

    inputEl.addEventListener('keydown', (e) => {
      if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        e.key === 'Enter' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Allow space and alphabetic letters only
      if (e.key === ' ' || /^[a-zA-Z\u00C0-\u024F]$/.test(e.key)) {
        return;
      }

      e.preventDefault();
    });

    inputEl.addEventListener('input', () => {
      const sanitized = inputEl.value.replace(/[^a-zA-Z\u00C0-\u024F\s]/g, '');
      if (inputEl.value !== sanitized) {
        inputEl.value = sanitized;
      }
    });

    inputEl.addEventListener('paste', (e) => {
      const pasteText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      if (/[^a-zA-Z\u00C0-\u024F\s]/.test(pasteText)) {
        e.preventDefault();
        const sanitized = pasteText.replace(/[^a-zA-Z\u00C0-\u024F\s]/g, '');
        const start = inputEl.selectionStart || 0;
        const end = inputEl.selectionEnd || 0;
        const currentVal = inputEl.value;
        inputEl.value = currentVal.substring(0, start) + sanitized + currentVal.substring(end);
        inputEl.selectionStart = inputEl.selectionEnd = start + sanitized.length;
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  function restrictToNumbers(inputEl) {
    if (!inputEl) return;

    inputEl.addEventListener('keydown', (e) => {
      if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Tab' ||
        e.key === 'Escape' ||
        e.key === 'Enter' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Allow digits 0-9 only
      if (/^[0-9]$/.test(e.key)) {
        return;
      }

      e.preventDefault();
    });

    inputEl.addEventListener('input', () => {
      const sanitized = inputEl.value.replace(/[^0-9]/g, '');
      if (inputEl.value !== sanitized) {
        inputEl.value = sanitized;
      }
    });

    inputEl.addEventListener('paste', (e) => {
      const pasteText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      if (/[^0-9]/.test(pasteText)) {
        e.preventDefault();
        const sanitized = pasteText.replace(/[^0-9]/g, '');
        const start = inputEl.selectionStart || 0;
        const end = inputEl.selectionEnd || 0;
        const currentVal = inputEl.value;
        inputEl.value = currentVal.substring(0, start) + sanitized + currentVal.substring(end);
        inputEl.selectionStart = inputEl.selectionEnd = start + sanitized.length;
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  }

  // --- Tasting Booking Form Submission ---
  function initTastingForm() {
    const tastingForm = document.getElementById('tastingBookingForm');
    const modalConfirm = document.getElementById('tastingConfirmationModal');
    const nameInput = document.getElementById('tastingName');
    const phoneInput = document.getElementById('tastingPhone');

    // Attach real-time input restrictions
    restrictToAlphabets(nameInput);
    restrictToNumbers(phoneInput);

    if (tastingForm) {
      tastingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput?.value.trim() || '';
        const email = document.getElementById('tastingEmail')?.value || '';
        const phone = phoneInput?.value.trim() || '';
        const date = document.getElementById('tastingDate')?.value || '';
        const guests = document.getElementById('tastingGuests')?.value || '2';
        const weddingDate = document.getElementById('tastingWeddingDate')?.value || '';

        // Validate that name contains only alphabets and spaces
        if (!/^[a-zA-Z\u00C0-\u024F\s]+$/.test(name)) {
          if (window.showToast) {
            window.showToast('Please enter only alphabet letters for Couple Names.', 'error');
          }
          nameInput?.focus();
          return;
        }

        // Validate that phone contains only numeric digits
        if (!/^[0-9]+$/.test(phone)) {
          if (window.showToast) {
            window.showToast('Please enter only numbers for the Phone Number.', 'error');
          }
          phoneInput?.focus();
          return;
        }

        // Generate luxury confirmation code
        const refCode = 'ELY-' + Math.floor(1000 + Math.random() * 9000);

        if (modalConfirm) {
          const refEl = modalConfirm.querySelector('.confirm-ref-code');
          const nameEl = modalConfirm.querySelector('.confirm-client-name');
          const dateEl = modalConfirm.querySelector('.confirm-tasting-date');
          const guestEl = modalConfirm.querySelector('.confirm-guest-count');

          if (refEl) refEl.textContent = refCode;
          if (nameEl) nameEl.textContent = name;
          if (dateEl) dateEl.textContent = date;
          if (guestEl) guestEl.textContent = `${guests} guests`;

          modalConfirm.classList.add('active');
          document.body.style.overflow = 'hidden';
        } else {
          if (window.showToast) {
            window.showToast(`Thank you, ${name}! Your private tasting reservation request (${refCode}) is received.`, 'success');
          }
          tastingForm.reset();
        }
      });
    }

    if (modalConfirm) {
      const closeBtn = modalConfirm.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modalConfirm.classList.remove('active');
          document.body.style.overflow = '';
          if (tastingForm) tastingForm.reset();
        });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCustomizer();
    initMonogramStudio();
    initTastingForm();
  });
})();
