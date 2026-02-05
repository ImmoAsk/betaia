/**
 * Tests unitaires basiques
 */

// Simule l'environnement navigateur
global.window = {
  matchMedia: () => ({ matches: false }),
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { origin: 'http://localhost', href: 'http://localhost/' }
};

global.document = {
  readyState: 'complete',
  cookie: '',
  body: { style: {} },
  documentElement: { style: {} },
  createElement: (tag) => ({
    style: {},
    setAttribute: () => {},
    addEventListener: () => {},
    appendChild: () => {},
    innerHTML: ''
  }),
  getElementById: () => null,
  querySelector: () => null,
  addEventListener: () => {}
};

global.navigator = {
  userAgent: 'Mozilla/5.0 Chrome/90.0',
  language: 'fr-FR',
  doNotTrack: null
};

global.crypto = {
  randomUUID: () => 'test-uuid-1234',
  getRandomValues: (arr) => arr
};

global.sessionStorage = {
  data: {},
  getItem: (k) => global.sessionStorage.data[k],
  setItem: (k, v) => global.sessionStorage.data[k] = v,
  removeItem: (k) => delete global.sessionStorage.data[k]
};

// Tests
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (e) {
    console.log(`[FAIL] ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Charge les modules
const path = require('path');
const srcDir = path.join(__dirname, '..', 'src');

// Test constants
test('Constants are defined', () => {
  const constants = require(path.join(srcDir, 'core/constants.js'));
  assert(constants.VERSION === '1.0.0');
  assert(constants.NAMESPACE === '__AnnoncesWidget__');
  assert(typeof constants.BREAKPOINTS === 'object');
});

// Test timing utils
test('Debounce creates function', () => {
  const { debounce } = require(path.join(srcDir, 'utils/timing.js'));
  const fn = debounce(() => {}, 100);
  assert(typeof fn === 'function');
  assert(typeof fn.cancel === 'function');
});

// Test UUID generation
test('UUID generates valid format', () => {
  const { generateShortId, simpleHash } = require(path.join(srcDir, 'utils/uuid.js'));
  const id = generateShortId(8);
  assert(id.length === 8);
  const hash = simpleHash('test');
  assert(typeof hash === 'string');
});

// Test sanitizer
test('Sanitizer escapes HTML', () => {
  const { sanitizeText } = require(path.join(srcDir, 'security/sanitizer.js'));
  const result = sanitizeText('<script>alert("xss")</script>');
  assert(!result.includes('<script>'));
});

// Test scoring engine
test('Engagement score calculation', () => {
  const { calculateEngagementScore } = require(path.join(srcDir, 'rotation/scoringEngine.js'));
  const score = calculateEngagementScore({ viewTime: 5000, hoverDuration: 2000 });
  assert(typeof score === 'number');
  assert(score >= 0 && score <= 100);
});

// Resume
console.log(`\n=== Resume ===`);
console.log(`Passes: ${passed}`);
console.log(`Echecs: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
