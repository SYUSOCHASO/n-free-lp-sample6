(function(){
  var d=document; d.documentElement.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var b=d.querySelector('.hd__burger'), nav=d.getElementById('spnav');
  if(b&&nav){
    b.addEventListener('click',function(){
      var o=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',String(!o));
      b.setAttribute('aria-label',o?'メニューを開く':'メニューを閉じる');
      nav.classList.toggle('open',!o);
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){b.setAttribute('aria-expanded','false');nav.classList.remove('open');});});
  }

  function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  function countUp(el){
    if(el.dataset.done) return; el.dataset.done=1;
    var to=+el.dataset.to; if(reduce){el.textContent=fmt(to);return;}
    var t0=null, dur=1200;
    function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur); var e=1-Math.pow(1-p,3);
      el.textContent=fmt(Math.round(to*e)); if(p<1) requestAnimationFrame(step); }
    el.textContent='0'; requestAnimationFrame(step);
  }

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll && e.target.querySelectorAll('.count').forEach(countUp);
      if(e.target.classList.contains('count')) countUp(e.target);
      io.unobserve(e.target);
    });
  },{rootMargin:'0px 0px -12% 0px'});
  d.querySelectorAll('.rv,.pipe,.converge,.esc__item,.exp__blk,.hero__meta').forEach(function(el){io.observe(el);});

  // timeline progress
  var tl=d.querySelector('.tl'), rail=d.querySelector('.tl__rail span'), items=[].slice.call(d.querySelectorAll('.tl__item'));
  function onScroll(){
    if(!tl) return;
    var r=tl.getBoundingClientRect(), vh=window.innerHeight, mid=vh*0.6;
    var p=Math.max(0,Math.min(1,(mid-r.top)/r.height));
    rail.parentNode.style.setProperty('--p',(p*100)+'%');
    items.forEach(function(it){ var m=it.querySelector('.tl__mark').getBoundingClientRect(); it.classList.toggle('on', m.top+m.height/2 < mid); });
  }
  window.addEventListener('scroll',onScroll,{passive:true}); window.addEventListener('resize',onScroll); onScroll();

  d.querySelectorAll('.exp__toggle').forEach(function(t){
    t.addEventListener('click',function(){
      var el=d.getElementById(t.getAttribute('aria-controls'));
      var o=t.getAttribute('aria-expanded')==='true';
      t.setAttribute('aria-expanded',String(!o)); el.hidden=o;
    });
  });
})();
