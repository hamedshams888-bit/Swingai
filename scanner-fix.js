(()=>{
  let running=false,timer=null,observer=null;
  const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};
  const scanButtons=()=>[...document.querySelectorAll('button')].filter(visible).filter(b=>/اسکن|scan/i.test((b.textContent||'')));
  const signature=()=>[...document.querySelectorAll('.global-signal,.signal,.opportunity-card')].filter(visible).map(c=>(c.textContent||'').replace(/\s+/g,' ').trim()).join('|');
  function ensureStatus(){
    let box=document.getElementById('swingaiScanStatus');
    if(!box){box=document.createElement('div');box.id='swingaiScanStatus';box.style.cssText='position:fixed;top:14px;left:14px;right:14px;z-index:99999;background:#141c33;color:#fff;border:1px solid #334364;border-radius:16px;padding:13px;text-align:center;font-weight:800;display:none;box-shadow:0 8px 30px rgba(0,0,0,.35)';document.body.appendChild(box)}
    return box;
  }
  function status(msg,ok=false){const b=ensureStatus();b.textContent=msg;b.style.display='block';b.style.background=ok?'#0b4a36':'#141c33';if(ok)setTimeout(()=>b.style.display='none',1800)}
  function finish(btn,ok,msg){running=false;if(timer){clearTimeout(timer);timer=null}if(observer){observer.disconnect();observer=null}btn.disabled=false;btn.style.opacity='1';btn.textContent='🔄 اسکن جهانی بازار';status(msg||(ok?'✅ اسکن کامل شد':'❌ اسکن متوقف شد'),ok)}
  function wire(btn){
    if(btn.dataset.scanFix==='1')return;btn.dataset.scanFix='1';
    btn.addEventListener('click',()=>{
      if(running){status('⏳ اسکن هنوز در حال اجراست؛ لطفاً صبر کن.');return}
      running=true;btn.disabled=true;btn.style.opacity='.65';btn.textContent='⏳ در حال اسکن...';status('⏳ اسکن جهانی شروع شد… دریافت داده‌ها');
      const started=Date.now(),baseline=signature();let seenLoading=false;
      observer=new MutationObserver(()=>{
        const now=Date.now(),cards=[...document.querySelectorAll('.global-signal,.signal,.opportunity-card')].filter(visible),loading=[...document.querySelectorAll('.loading')].some(visible);
        if(loading)seenLoading=true;
        const changed=signature()!==baseline;
        if(now-started>1500&&cards.length&&(changed||(seenLoading&&!loading)))finish(btn,true,'✅ اسکن کامل شد — نتایج آماده است');
        else if(now-started>45000)finish(btn,false,'⚠️ اسکن بیش از ۴۵ ثانیه طول کشید؛ دوباره تلاش کن');
      });
      observer.observe(document.body,{childList:true,subtree:true,characterData:true});
      timer=setTimeout(()=>finish(btn,false,'⚠️ اسکن بیش از ۴۵ ثانیه طول کشید؛ پاسخ داده‌ها دیر شد'),46000);
    },true);
  }
  function boot(){scanButtons().forEach(wire);new MutationObserver(()=>scanButtons().forEach(wire)).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
