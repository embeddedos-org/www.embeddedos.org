import { readFileSync, existsSync, globSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { load } from 'cheerio';
const DIST='dist';
const pages=globSync('dist/**/*.html');
const brokenLinks=new Map(), deadButtons=new Map(); let anchors=0, extern=0;
const brokenAssets=new Map();
function resolveLocal(p,u){
  u=u.split('#')[0].split('?')[0]; if(!u) return true;
  let t=u.startsWith('/')?join(DIST,u):resolve(dirname(p),u);
  if(existsSync(t)) return true;
  if(!/\.[a-z0-9]+$/i.test(u) && existsSync(join(t,'index.html'))) return true;
  return false;
}
for(const p of pages){
  const $=load(readFileSync(p,'utf8'));
  $('a[href]').each((_,a)=>{
    const u=$(a).attr('href')||''; anchors++;
    if(/^(https?:|mailto:|tel:|data:|javascript:)/.test(u)){extern++;return;}
    if(u===''||u==='#'){deadButtons.set(p,(deadButtons.get(p)||0)+1);return;}
    if(u.startsWith('#'))return;
    if(!resolveLocal(p,u)) brokenLinks.set(u,(brokenLinks.get(u)||0)+1);
  });
  $('img[src],script[src],link[href]').each((_,el)=>{
    const u=$(el).attr('src')||$(el).attr('href')||'';
    if(!u||/^(https?:|data:)/.test(u))return;
    if(!resolveLocal(p,u)) brokenAssets.set(u,(brokenAssets.get(u)||0)+1);
  });
}
console.log(`anchors=${anchors} external=${extern}`);
const bl=[...brokenLinks.entries()].sort((a,b)=>b[1]-a[1]);
console.log(`\nBROKEN internal links: ${bl.length}`);
bl.slice(0,40).forEach(([u,c])=>console.log(`  ${c}x  ${u}`));
const ba=[...brokenAssets.entries()].sort((a,b)=>b[1]-a[1]);
console.log(`\nBROKEN assets: ${ba.length}`);
ba.slice(0,40).forEach(([u,c])=>console.log(`  ${c}x  ${u}`));
const totDead=[...deadButtons.values()].reduce((a,b)=>a+b,0);
console.log(`\nhref="#" / empty (dead buttons): ${totDead} across ${deadButtons.size} pages`);
