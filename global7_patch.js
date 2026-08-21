/* SwingAI Global 7 — Paper Trading button patch */
(function(){
  function wire(){
    document.querySelectorAll('[data-swingai-buy], .signal, .global-signal, .opportunity-card').forEach(function(card){
      if(card.dataset.paperWired==='1') return;
      var text=card.textContent||'';
      var isBuy=/\bBUY\b/.test(text) || text.indexOf('🟢')>=0;
      if(!isBuy) return;
      var btn=document.createElement('button');
      btn.className='buybtn swingai-paper-buy';
      btn.textContent='🛒 خرید با Paper Trading';
      btn.type='button';
      btn.addEventListener('click',function(){
        var event=new CustomEvent('swingai:paper-buy',{detail:{card:card}});
        document.dispatchEvent(event);
        if(typeof window.openPaperTrade==='function') window.openPaperTrade(card);
      });
      card.appendChild(btn);
      card.dataset.paperWired='1';
    });
  }
  function start(){ wire(); new MutationObserver(wire).observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
