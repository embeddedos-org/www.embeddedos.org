import { readFileSync, existsSync, globSync } from 'node:fs';
import { load } from 'cheerio';
function textLen(file){
  if(!existsSync(file)) return -1;
  const $=load(readFileSync(file,'utf8'));
  $('script,style,noscript').remove();
  $('.navbar,.footer').remove();
  return $('body').text().replace(/\s+/g,' ').trim().length;
}
const pages = globSync('*.html').filter(f=>f!=='index.html.bak')
  .concat(globSync('docs/*.html'),globSync('stacks/*.html'),globSync('eApps/*.html'),globSync('downloads/*.html'));
const rows=[];
for(const p of pages){
  const orig=textLen(p), built=textLen('dist/'+p);
  rows.push({p,orig,built,ratio: orig>0?built/orig:0});
}
rows.sort((a,b)=>a.ratio-b.ratio);
console.log('WORST 20 by retention (built/orig):');
for(const r of rows.slice(0,20)) console.log(`  ${(r.ratio*100).toFixed(0).padStart(4)}%  orig=${String(r.orig).padStart(6)} built=${String(r.built).padStart(6)}  ${r.p}`);
const emp=rows.filter(r=>r.built<200);
console.log(`\nnearly-empty (<200 chars): ${emp.length}`);
emp.forEach(r=>console.log('  '+r.p+' built='+r.built));
