/**
 * Script de minification du bundle
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const inputPath = path.join(distDir, 'widget.js');
const outputPath = path.join(distDir, 'widget.min.js');

/**
 * Minification simple sans dependances
 */
function minify(code) {
  return code
    // Supprime les commentaires multi-lignes (sauf le header)
    .replace(/\/\*(?!\*)[\s\S]*?\*\//g, '')
    // Supprime les commentaires single-line
    .replace(/\/\/(?!\s*===).*$/gm, '')
    // Supprime les lignes vides multiples
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Supprime les espaces en debut de ligne
    .replace(/^\s+/gm, '')
    // Compacte les accolades
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Compacte les virgules
    .replace(/\s*,\s*/g, ',')
    // Compacte les points-virgules
    .replace(/\s*;\s*/g, ';')
    // Supprime les espaces autour des operateurs
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*:\s*/g, ':')
    // Nettoie les fins de ligne
    .replace(/;\n/g, ';')
    .trim();
}

/**
 * Execute la minification
 */
function run() {
  console.log('[Minify] Demarrage...');
  
  if (!fs.existsSync(inputPath)) {
    console.error('[Minify] Bundle non trouve. Executez build d\'abord.');
    process.exit(1);
  }

  const source = fs.readFileSync(inputPath, 'utf8');
  
  // Garde le header
  const headerMatch = source.match(/^\/\*\*[\s\S]*?\*\//);
  const header = headerMatch ? headerMatch[0] + '\n' : '';
  
  // Minifie le reste
  const codeStart = headerMatch ? headerMatch[0].length : 0;
  const code = source.slice(codeStart);
  const minified = header + minify(code);

  fs.writeFileSync(outputPath, minified);
  
  const originalSize = fs.statSync(inputPath).size;
  const minifiedSize = fs.statSync(outputPath).size;
  const ratio = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
  
  console.log(`[Minify] Original: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`[Minify] Minifie: ${(minifiedSize / 1024).toFixed(2)} KB`);
  console.log(`[Minify] Reduction: ${ratio}%`);
}

run();
