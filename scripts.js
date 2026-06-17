// ============================================================
//  FLAMES Calculator — scripts.js
// ============================================================

// ── FLAMES meanings ───────────────────────────────────────────
const MEANINGS = {
  F: {
    emoji: '🤝',
    label: 'Friends 🤝',
    desc:  'You two are destined to be incredible friends — a bond built on trust and good vibes!'
  },
  L: {
    emoji: '❤️',
    label: 'Love ❤️',
    desc:  'True love is written in the stars for you two. The universe wholeheartedly approves!'
  },
  A: {
    emoji: '😊',
    label: 'Affection 😊',
    desc:  'A deep, warm affection ties your hearts together — sweet, sincere, and wonderful.'
  },
  M: {
    emoji: '💍',
    label: 'Marriage 💍',
    desc:  'Wedding bells might just be ringing! The cosmos see a beautiful future together.'
  },
  E: {
    emoji: '😡',
    label: 'Enemies 😡',
    desc:  "Watch each other's back — sparks fly between you, but not always the romantic kind!"
  },
  S: {
    emoji: '👫',
    label: 'Siblings 👫',
    desc:  'You share a bond as strong as family — true siblings in spirit!'
  }
};

// ── Modal helpers ─────────────────────────────────────────────

function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('active');
  document.body.style.overflow = '';
}

// Close when clicking the dark overlay (not the box itself)
function overlayClose(event, id) {
  if (event.target === event.currentTarget) {
    closeModal(id);
  }
}

// Escape key closes any open modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(function (el) {
      closeModal(el.id);
    });
  }
});

// Enter key on either input triggers calculate
document.addEventListener('DOMContentLoaded', function () {
  ['name1', 'name2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') calculateFlames();
      });
    }
  });
});

// ── Algorithm helpers ─────────────────────────────────────────

/**
 * Returns only lowercase a-z characters as an array.
 */
function toLetters(str) {
  return str.toLowerCase().replace(/[^a-z]/g, '').split('');
}

/**
 * Removes common letters from both arrays (one-for-one matching).
 * Modifies the arrays in place.
 */
function crossOutCommon(a, b) {
  for (var i = 0; i < a.length; i++) {
    var j = b.indexOf(a[i]);
    if (j !== -1) {
      a.splice(i, 1);
      b.splice(j, 1);
      i--;
    }
  }
}

/**
 * Classic FLAMES circular elimination.
 * @param {number} count – remaining letter count
 * @returns {string} one of F L A M E S
 */
function runFlames(count) {
  var letters = ['F', 'L', 'A', 'M', 'E', 'S'];
  var idx = 0;
  while (letters.length > 1) {
    idx = (idx + count - 1) % letters.length;
    letters.splice(idx, 1);
  }
  return letters[0];
}

// ── Main calculate function ───────────────────────────────────

function calculateFlames() {
  var raw1 = (document.getElementById('name1').value || '').trim();
  var raw2 = (document.getElementById('name2').value || '').trim();

  var arr1 = toLetters(raw1);
  var arr2 = toLetters(raw2);

  // Validation
  if (arr1.length === 0 || arr2.length === 0) {
    shakeCard();
    showToast('Please enter both names! 🌸');
    return;
  }

  // Cross out common letters
  crossOutCommon(arr1, arr2);

  var count = arr1.length + arr2.length;

  // Edge case: both names have identical letters
  if (count === 0) {
    populateResult(
      raw1, raw2,
      '🪞', 'Mirror Souls',
      'Your names share the exact same letters — you might be more alike than you think!'
    );
    openModal('resultModal');
    return;
  }

  var letter = runFlames(count);
  var data   = MEANINGS[letter];

  populateResult(raw1, raw2, data.emoji, data.label, data.desc);
  openModal('resultModal');
}

/**
 * Fills in the result modal fields.
 */
function populateResult(name1, name2, emoji, label, desc) {
  var n1 = capitalize(name1);
  var n2 = capitalize(name2);

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultLabel').textContent = label;
  document.getElementById('resultNames').textContent = n1 + ' & ' + n2;
  document.getElementById('resultDesc').textContent  = desc;

  // Re-trigger the pop-in animation on the emoji
  var emojiEl = document.getElementById('resultEmoji');
  emojiEl.style.animation = 'none';
  emojiEl.offsetHeight;  // reflow
  emojiEl.style.animation = '';
}

// ── UI helpers ────────────────────────────────────────────────

function capitalize(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

/** Shake the card to signal invalid input */
function shakeCard() {
  var card = document.querySelector('.card');
  if (!card) return;

  // Inject keyframes once
  if (!document.getElementById('__shake_style')) {
    var s = document.createElement('style');
    s.id = '__shake_style';
    s.textContent =
      '@keyframes cardShake {' +
      '0%,100%{transform:translateX(0)}' +
      '20%{transform:translateX(-7px)}' +
      '40%{transform:translateX(7px)}' +
      '60%{transform:translateX(-4px)}' +
      '80%{transform:translateX(4px)}' +
      '}';
    document.head.appendChild(s);
  }

  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'cardShake 0.4s ease';
  setTimeout(function () { card.style.animation = ''; }, 420);
}

/** Show a temporary bottom toast */
function showToast(message) {
  var old = document.getElementById('__toast');
  if (old) old.remove();

  var t = document.createElement('div');
  t.id = '__toast';
  t.textContent = message;

  Object.assign(t.style, {
    position:      'fixed',
    bottom:        '2rem',
    left:          '50%',
    transform:     'translateX(-50%) translateY(14px)',
    background:    '#fff',
    color:         '#e0527a',
    border:        '1.5px solid #f5b8cc',
    padding:       '0.7rem 1.6rem',
    borderRadius:  '999px',
    fontSize:      '0.88rem',
    fontFamily:    "'Nunito', sans-serif",
    fontWeight:    '700',
    boxShadow:     '0 6px 20px rgba(220,80,130,0.18)',
    zIndex:        '9999',
    opacity:       '0',
    transition:    'opacity 0.28s ease, transform 0.28s ease',
    whiteSpace:    'nowrap',
    pointerEvents: 'none'
  });

  document.body.appendChild(t);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      t.style.opacity   = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(function () {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(function () { t.remove(); }, 300);
  }, 2600);
}