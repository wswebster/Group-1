// script.js
// - Adds tilt/3D hover effect for cards
// - Opens external link when "Open Site" is clicked
// - "Notes" opens local note page (note.html?id=...) so user can type paragraphs

(function(){
  // configurable external links (default placeholders)
  // If you prefer, edit these values or set data-link attributes directly in HTML.
  const defaultLinks = {
    2: 'https://example.com/page2',
    3: 'https://example.com/page3',
    4: 'https://example.com/page4',
    5: 'https://example.com/page5'
  };

  // Tilt effect
  const cards = document.querySelectorAll('.card-inner');
  function handleMove(e){
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
    if (clientX == null) return;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -12; // rotateX
    const ry = (x - 0.5) * 12;  // rotateY
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  }
  function handleLeave(e){
    e.currentTarget.style.transform = '';
  }
  document.querySelectorAll('.card').forEach(card => {
    const inner = card.querySelector('.card-inner');
    inner.addEventListener('mousemove', handleMove);
    inner.addEventListener('touchmove', handleMove, {passive:true});
    inner.addEventListener('mouseleave', handleLeave);
    inner.addEventListener('touchend', handleLeave);

    // Keyboard: Enter opens external link; N opens notes
    card.addEventListener('keydown', (ev) => {
      const id = card.dataset.id;
      if(ev.key === 'Enter'){
        const url = card.dataset.link || defaultLinks[id];
        if(url) window.open(url, '_blank', 'noopener');
      } else if(ev.key.toLowerCase() === 'n'){ // quick "Notes" shortcut
        window.location.href = `note.html?id=${card.dataset.id}`;
      }
    });
  });

  // Buttons
  document.addEventListener('click', function(e){
    const openBtn = e.target.closest('.open-btn');
    if(openBtn){
      const url = openBtn.dataset.link || defaultLinks[openBtn.closest('.card').dataset.id];
      if(url) window.open(url, '_blank', 'noopener');
      return;
    }
    const notesBtn = e.target.closest('.notes-btn');
    if(notesBtn){
      const id = notesBtn.dataset.id;
      window.location.href = `note.html?id=${id}`;
      return;
    }
  });

  // Optionally, keep defaultLinks in sync with data-link attributes on cards
  document.querySelectorAll('.card[data-id]').forEach(c=>{
    const id = c.dataset.id;
    if(c.dataset.link) defaultLinks[id] = c.dataset.link;
  });

})();
