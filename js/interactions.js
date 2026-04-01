// js/interactions.js

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealOptions = {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it comes into view
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // --- 2. 3D Tilt Effect for Profile Card ---
  const tiltCard = document.querySelector('.tilt-card');
  
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8; // Max rotation 8deg
      const rotateY = ((x - centerX) / centerX) * 8;
      
      // Update custom properties on the element
      tiltCard.style.setProperty('--rx', `${rotateX}deg`);
      tiltCard.style.setProperty('--ry', `${rotateY}deg`);
    });
    
    // Reset on mouse leave
    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.setProperty('--rx', `0deg`);
      tiltCard.style.setProperty('--ry', `0deg`);
      tiltCard.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    
    // Remove transition on enter for smooth tracking
    tiltCard.addEventListener('mouseenter', () => {
      tiltCard.style.transition = 'none';
      // Slight scale purely on hover, rotation handled by mousemove
    });
  }
});
