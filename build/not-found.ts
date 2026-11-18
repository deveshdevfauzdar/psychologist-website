import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Inline the error page's art so an unknown URL can be any number of directories deep.
export function notFoundDocument(root: string) {
  function asset(file: string, type: string) {
    return 'data:' + type + ';base64,' + readFileSync(resolve(root, 'public', file)).toString('base64')
  }
  const font = asset('fonts/instrument-serif-regular.woff2', 'font/woff2')
  const logo = asset('media/therapy-office-logo-dark.png', 'image/png')
  const photo = asset('media/folded-sheet.webp', 'image/webp')
  return `<!doctype html>
<html lang="en" data-page="404">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#f3f0e7"><title>Page not found — Therapy Office of Anna Tseytlina</title>
<style>
@font-face{font-family:Instrument;src:url("${font}") format('woff2');font-display:swap}
*{box-sizing:border-box}body{margin:0;background:#f3f0e7;color:#393630;font:17px/1.5 Arial,Helvetica,sans-serif}
header,main{width:min(100%,1510px);margin:auto;padding-inline:clamp(24px,6vw,105px)}
header{display:flex;align-items:center;justify-content:space-between;padding-block:clamp(24px,2.8vw,45px)}
header img{width:clamp(164px,18vw,257px);height:auto;display:block;filter:grayscale(1)}
a{color:inherit;text-decoration:none}a:focus-visible{outline:2px solid currentColor;outline-offset:6px}
header>a:last-child,.return{display:inline-flex;align-items:center;gap:14px;border-bottom:1px solid currentColor;padding:5px 0}
header>a:last-child{font-size:15px}main{display:grid;grid-template-columns:1fr .92fr;align-items:center;gap:clamp(32px,8vw,135px);padding-block:clamp(28px,4vw,75px) 60px}
small{font-size:16px;letter-spacing:.06em;color:#6d6254}h1{font:400 clamp(78px,9vw,151px)/.91 Instrument,Georgia,serif;letter-spacing:-.04em;margin:22px 0}
p{max-width:34ch;color:#62594e;margin:0 0 23px}.return span{transition:transform .3s}.return:hover span{transform:translateX(-4px)}
figure{margin:0;overflow:hidden;background:#e6dfd3}figure img{display:block;width:100%;height:clamp(420px,63svh,720px);object-fit:cover}
@media(max-width:680px){main{grid-template-columns:1fr;gap:30px;padding-top:28px}h1{font-size:clamp(67px,15vw,92px)}h1 br{display:none}figure img{height:clamp(230px,38svh,350px);object-position:center 58%}}
@media(prefers-reduced-motion:no-preference){main{animation:appear .7s cubic-bezier(.22,.78,.23,1) both}@keyframes appear{from{opacity:.25;transform:translateY(9px)}to{opacity:1;transform:none}}}
</style></head><body>
<header><a data-home href="/" aria-label="Therapy Office of Anna Tseytlina, home"><img width="1200" height="268" src="${logo}" alt="Therapy Office of Anna Tseytlina, LMFT"></a><a data-home href="/">Home</a><span data-sound-slot></span></header>
<main><div><small>404</small><h1>Page not <br>found.</h1><p>This address doesn’t lead to a page in Anna’s practice.</p><a data-home class="return" href="/"><span aria-hidden="true">←</span> Back to home</a></div>
<figure><img src="${photo}" alt="A folded paper airplane resting in afternoon light" width="800" height="1000"></figure></main>
<script>
const links=document.querySelectorAll('[data-home]');
function useHome(path){for(const link of links)link.href=path}
const parts=location.pathname.split('/').filter(Boolean);
if(location.hostname.endsWith('.github.io')&&parts[0])useHome('/'+parts[0]+'/');
// A static host may mount the same build below a subdirectory.
(async()=>{let prefix='/';for(const part of ['',...parts.slice(0,-1)]){if(part)prefix+=part+'/';try{const res=await fetch(prefix+'index.html');if(res.ok&&(await res.text()).includes('name="application-name" content="Therapy Office of Anna Tseytlina"')){useHome(prefix);const sound=document.createElement('script');sound.src=prefix+'ambient-player.js';document.head.append(sound);break}}catch{break}}})();
for(const link of links)link.addEventListener('click',event=>{if(event.button||event.metaKey||event.shiftKey||event.ctrlKey||event.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches||!document.body.animate)return;event.preventDefault();const dest=link.href;const exit=document.body.animate([{opacity:1},{opacity:.15}],{duration:150,easing:'ease-in'});exit.finished.then(()=>location.assign(dest),()=>location.assign(dest))});
</script></body></html>`
}
