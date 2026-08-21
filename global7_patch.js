/* SwingAI Global 7 — Paper Trading UI + local paper position */
(function(){
  const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function parseCard(card){
    const t=(card.textContent||'').replace(/\s+/g,' ');
    const symbol=(t.match(/\b(?:[A-Z]{1,6}(?:\.[A-Z]{1,3})?|BUY\.[0-9]+)\b/)||[])[0]||'GLOBAL';
    const cur=(t.match(/\b(USD|SEK|EUR|JPY|CAD|AUD|HKD)\b/)||[])[1]||'SEK';
    const price=(t.match(new RegExp(cur+'\\s*([0-9]+(?:[.,][0-9]+)?)'))||[])[1];
    const target=(t.match(/Target\s*([A-Z]{3})?\s*([0-9]+(?:[.,][0-9]+)?)/i)||[])[2];
    const stop=(t.match(/Stop\s*([A-Z]{3})?\s*([0-9]+(?:[.,][0-9]+)?)/i)||[])[2];
    const name=(t.split(/\b(?:USA|US|SE|DE|JP|CA|AU|HK)\b/)[0]||'Global signal').trim().slice(-40);
    return {name,symbol,currency:cur,price:Number((price||'0').replace(',','.')),target:Number((target||'0').replace(',','.')),stop:Number((stop||'0').replace(',','.'))};
  }
  function showTrade(card){
    const s=parseCard(card); if(!s.price) return;
    let modal=document.getElementById('swingaiGlobalTrade');
    if(!modal){
      modal=document.createElement('div'); modal.id='swingaiGlobalTrade';
      modal.innerHTML='<div class="sgt-sheet"><div class="sgt-head"><b>🛒 Paper Trading</b><button id="sgtClose">✕</button></div><div id="sgtInfo"></div><label>تعداد سهم</label><input id="sgtQty" type="number" min="1" value="1"><div class="sgt-grid"><div>Entry<br><b id="sgtEntry"></b></div><div>Stop<br><b id="sgtStop"></b></div><div>Target<br><b id="sgtTarget"></b></div><div>Max loss<br><b id="sgtLoss"></b></div></div><button id="sgtConfirm">✅ تأیید و ثبت Paper Trade</button></div>';
      document.body.appendChild(modal);
      document.getElementById('sgtClose').onclick=()=>modal.remove();
    }
    const f=n=>n.toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2});
    document.getElementById('sgtInfo').textContent=s.name+' • '+s.symbol+' • '+s.currency;
    document.getElementById('sgtEntry').textContent=f(s.price)+' '+s.currency;
    document.getElementById('sgtStop').textContent=f(s.stop)+' '+s.currency;
    document.getElementById('sgtTarget').textContent=f(s.target)+' '+s.currency;
    const qty=document.getElementById('sgtQty');
    const update=()=>document.getElementById('sgtLoss').textContent=f(Math.max(0,(s.price-s.stop)*Number(qty.value||1)))+' '+s.currency;
    qty.oninput=update; update();
    document.getElementById('sgtConfirm').onclick=()=>{
      const q=Math.max(1,Math.floor(Number(qty.value)||1));
      const p={...s,entry:s.price,qty:q,time:new Date().toISOString(),status:'OPEN'};
      const arr=JSON.parse(localStorage.getItem('swingai_positions')||'[]'); arr.push(p); localStorage.setItem('swingai_positions',JSON.stringify(arr));
      modal.remove();
      let toast=document.getElementById('sgtToast'); if(!toast){toast=document.createElement('div');toast.id='sgtToast';document.body.appendChild(toast)}
      toast.textContent='✅ Paper Trade ثبت شد: '+s.symbol+' × '+q; toast.className='sgt-toast'; setTimeout(()=>toast.remove(),3000);
    };
  }
  function wire(){
    document.querySelectorAll('.signal, .global-signal, .opportunity-card').forEach(function(card){
      if(card.dataset.paperWired==='1') return;
      const text=card.textContent||'';
      if(!/\bBUY\b/.test(text)) return;
      const b=document.createElement('button'); b.type='button'; b.className='buybtn swingai-paper-buy'; b.textContent='🛒 خرید با Paper Trading'; b.onclick=()=>showTrade(card); card.appendChild(b); card.dataset.paperWired='1';
    });
  }
  function start(){
    const css=document.createElement('style'); css.textContent='#swingaiGlobalTrade{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9999;display:flex;align-items:flex-end;padding:16px}.sgt-sheet{width:min(820px,100%);margin:auto;background:#141c33;color:#fff;border:1px solid #334364;border-radius:24px;padding:20px}.sgt-head{display:flex;justify-content:space-between;align-items:center;font-size:22px}.sgt-head button{background:#283653;color:#fff;border:0;border-radius:10px;padding:8px}.sgt-sheet label{display:block;margin-top:16px;color:#9da9c4}.sgt-sheet input{width:100%;background:#0c1226;color:#fff;border:1px solid #334364;border-radius:12px;padding:13px;font-size:18px;margin:8px 0 14px}.sgt-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.sgt-grid div{background:#0c1226;border-radius:14px;padding:12px}.sgt-sheet>#sgtConfirm{width:100%;border:0;border-radius:15px;padding:15px;background:#0b4a36;color:#65e6aa;font-size:17px;font-weight:800}.sgt-toast{position:fixed;top:20px;left:20px;right:20px;z-index:10000;background:#0b4a36;color:#dfffee;border:1px solid #2c8c68;border-radius:15px;padding:14px;text-align:center;font-weight:800}'; document.head.appendChild(css);
    wire(); new MutationObserver(wire).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
