const { readFileSync, statSync } = require('fs');
const { join } = require('path');

function walkMdFiles(dir) {
  const results = [];
  const fs = require('fs');
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkMdFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath);
      }
    }
  } catch(e) { console.warn(e); }
  return results;
}

function slugFromFilePath(filepath) {
  return filepath.replace(/\\/g, '/').split('/').pop().replace(/\.md$/, '');
}

function normalizeDate(raw) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^\d{8}$/.test(raw)) {
    return raw.slice(0,4)+'-'+raw.slice(4,6)+'-'+raw.slice(6,8);
  }
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  return raw;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) { console.log('  [NO FRONT MATTER MATCH]'); return {}; }
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(': ');
    if (idx > 0) {
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 2).trim();
      fm[key] = key === 'date' ? normalizeDate(value) : value;
    } else {
      if (line.trim()) console.log('  [SKIPPED LINE] "' + line + '" (no colon+space)');
    }
  }
  return fm;
}

const notesDir = 'D:/Test1/content/notes';
const results = [];
for (const fullPath of walkMdFiles(notesDir)) {
  const slug = slugFromFilePath(fullPath);
  const raw = readFileSync(fullPath, 'utf-8');
  const fm = parseFrontmatter(raw);
  const mtime = statSync(fullPath).mtime;
  const fallbackDate = mtime.getFullYear()+'-'+String(mtime.getMonth()+1).padStart(2,'0')+'-'+String(mtime.getDate()).padStart(2,'0');
  results.push({
    slug,
    path: fullPath.replace(/\\/g, '/').split('/notes/')[1],
    date: fm.date || fallbackDate,
    title: fm.title || '(derived from slug)',
    rawDate: fm.date || '(no date field, using mtime)'
  });
}

results.sort((a,b) => b.date.localeCompare(a.date));
console.log('=== SORTED BY DATE (desc) ===');
results.forEach((r,i) => console.log((i+1) + '. ' + r.date + '\t' + r.rawDate + '\t' + r.path));
console.log('\n=== SUMMARY ===');
console.log('Total files:', results.length);
const noDate = results.filter(r => r.rawDate === '(no date field, using mtime)');
console.log('Files without date field:', noDate.length);
noDate.forEach(r => console.log('  -', r.path));
