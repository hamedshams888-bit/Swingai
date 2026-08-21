/* SwingAI Global 7 — Paper Trading button patch */
(function(){
  function wire(){
    document.querySelectorAll('.signal, .global-signal, .opportunity-card').forEach(function(card){
      if(card.dataset.paperWired==='1') return;
      var text=card.textContent||'';
      var isBuy=/\bBUY\b/.test(text);
      if(!isBuy) return;
      var btn=document.createElement('button');
      btn.className='buybtn swingai-paper-buy';
      btn.type='button';
      btn.textContent='🛒 خرید با Paper Trading';
      btn.addEventListener('click',function(){
        if(typeof window.openPaperTrade==='function') window.openPaperTrade(card);
        else document.dispatchEvent(new CustomEvent('swingai:paper-buy',{detail:{card:card}}));
      });
      card.appendChild(btn);
      card.dataset.paperWired='1';
    });
  }
  function start(){wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
