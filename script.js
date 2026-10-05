const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const nodes = [];
const maxNodes = 90;
const maxDistance = 160;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  nodes.length = 0;
  for (let i = 0; i < maxNodes; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      r: Math.random() * 2.2 + 1.2,
    });
  }
}

function drawNetwork() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    const dx = pointer.x - node.x;
    const dy = pointer.y - node.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 180) {
      node.vx += (dx / (dist || 1)) * 0.02;
      node.vy += (dy / (dist || 1)) * 0.02;
    }

    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
    if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;

    node.x = Math.min(Math.max(node.x, 0), window.innerWidth);
    node.y = Math.min(Math.max(node.y, 0), window.innerHeight);

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < nodes.length; j++) {
      const other = nodes[j];
      const dx2 = node.x - other.x;
      const dy2 = node.y - other.y;
      const dist2 = Math.hypot(dx2, dy2);

      if (dist2 < maxDistance) {
        const alpha = 1 - dist2 / maxDistance;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
        ctx.lineWidth = 1;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawNetwork);
}

window.addEventListener('pointermove', (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawNetwork();
