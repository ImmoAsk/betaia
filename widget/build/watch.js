/**
 * Script de watch pour developpement
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');

console.log('[Watch] Surveillance des fichiers...');
console.log('[Watch] Ctrl+C pour arreter\n');

// Build initial
execSync('node build/bundle.js --dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

// Watch recursif
function watchDirectory(dir) {
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.js')) return;
    
    console.log(`[Watch] Changement detecte: ${filename}`);
    
    try {
      execSync('node build/bundle.js --dev', { 
        stdio: 'inherit', 
        cwd: path.join(__dirname, '..') 
      });
      console.log('[Watch] Rebuild complete\n');
    } catch (e) {
      console.error('[Watch] Erreur build:', e.message);
    }
  });
}

watchDirectory(srcDir);
