// Interactive floating particles animation
const canvas = document.createElement('canvas');
const heroSection = document.querySelector('.hero');
if (heroSection) {
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  heroSection.style.position = 'relative';
  heroSection.insertBefore(canvas, heroSection.firstChild);
  
  const ctx = canvas.getContext('2d');
  canvas.width = heroSection.offsetWidth;
  canvas.height = heroSection.offsetHeight;
  
  const particles = [];
  const particleCount = 50;
  const mouse = { x: null, y: null, radius: 100 };
  
  // Track mouse position
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseX: 0,
      baseY: 0,
      radius: Math.random() * 3 + 1,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
  
  // Set base positions
  particles.forEach(p => {
    p.baseX = p.x;
    p.baseY = p.y;
  });
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      // Normal movement
      p.baseX += p.vx;
      p.baseY += p.vy;
      
      if (p.baseX < 0 || p.baseX > canvas.width) p.vx *= -1;
      if (p.baseY < 0 || p.baseY > canvas.height) p.vy *= -1;
      
      // Mouse repulsion
      let dx = mouse.x - p.baseX;
      let dy = mouse.y - p.baseY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      
      if (distance < mouse.radius && mouse.x !== null) {
        p.x = p.baseX - forceDirectionX * force * 50;
        p.y = p.baseY - forceDirectionY * force * 50;
      } else {
        // Return to base position smoothly
        p.x += (p.baseX - p.x) * 0.1;
        p.y += (p.baseY - p.y) * 0.1;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(62, 162, 145, ${p.opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  });
}