/**
 * Skills Bubble Physics Engine
 * Features: Gravity, Wall Collisions (Damped), Circle Collisions (Elasticish), Dragging
 */

const container = document.getElementById("skills-grid");
const bubbles = Array.from(document.querySelectorAll(".bubble"));

// --- Configuration ---
// --- Configuration ---
const CONFIG = {
  gravity: 0.8,           // Heavy gravity
  friction: 0.8,          // Syrup atmosphere (0.8 = loses 20% speed per frame)
  wallBounce: 0.0,        // No bounce
  ballBounce: 0.0,        // No bounce
  dragStiffness: 0.2,
  radius: 37,
  maxSpeed: 8
};

// --- Skill Data ---
const SKILL_DATA = {
  "Proxmox": "A complete open-source platform for enterprise virtualization, combining KVM and LXC/LXD containers, software-defined storage, and networking.",
  "Docker": "The industry standard for building, shipping, and running applications in containers, ensuring consistency across environments.",
  "Linux": "The operating system running the internet. Proficient in administration, shell scripting, and kernel tuning (Ubuntu, Debian, Alpine).",
  "PowerShell": "Automating Windows and cross-platform management with advanced scripting and configuration management.",
  "Python": "Versatile programming for automation, data analysis, glue code, and backend development.",
  "Grafana": "Visualizing metrics and logs. Creating beautiful informative dashboards to monitor infrastructure health.",
  "InfluxDB": "High-performance time-series database for handling high write loads of sensor data and system metrics.",
  "FastAPI": "Modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.",
  "Node.js": "JavaScript runtime built on Chrome's V8 engine for building scalable network applications.",
  "JavaScript": "The language of the web. DOM manipulation, async logic, and building interactive frontends.",
  "iDRAC": "Integrated Dell Remote Access Controller. Managing servers remotely even when powered off.",
  "Redfish": "Standard schema for the management of modern scalable platform hardware, enabling simple and secure management.",
  "Uptime Kuma": "A fancy self-hosted monitoring tool to track uptime and receive notifications for downtime.",
  "TailScale": "Zero-config VPN. Securely connecting devices worldwide on a private overlay network.",
  "Cloudflare": "CDN, DDoS protection, and security services. Managing DNS, Workers, and Zero Trust access.",
  "Git": "Version control system for tracking changes in source code during software development.",
  "Nginx": "High-performance HTTP server and reverse proxy, also an IMAP/POP3 proxy server.",
  "Apache": "The classic, robust, and extensible web server software powering a large chunk of the internet.",
  "Raspberry Pi": "Tiny, affordable computers for learning, edge processing, and home automation projects.",
  "OpenWebUI": "A user-friendly web interface for interacting with LLMs locally.",
  "Ollama": "Get up and running with large language models locally.",
  "ComfyUI": "A powerful node-based GUI for Stable Diffusion, enabling complex image generation workflows.",
  "Ansible": "IT automation tool. Configuration management, application deployment, and task automation.",
  "Bash": "The Bourne Again SHell. Essential for interacting with Linux systems and automating tasks.",
  "Systemd": "Init system and service manager for Linux operating systems.",
  "DNS": "Domain Name System. Understanding records, propagation, and troubleshooting resolution issues.",
  "SSL / TLS": "Securing communications over a computer network. Managing certificates and encryption.",
  "Telegram Bots": "Creating interactive bots for automation, notifications, and user interaction on Telegram.",
  "PM2": "Production process manager for Node.js applications with a built-in load balancer.",
  "Azure AD": "Microsoft Entra ID. Identity and access management in the cloud.",
  "Microsoft 365": "Cloud productivity suite. Managing users, licenses, and Exchange Online.",
  "VPN": "Virtual Private Network. Securing remote access and interconnecting networks.",
  "Firewall": "Network security device/software determining whether to allow or block specific traffic.",
  "DHCP": "Dynamic Host Configuration Protocol. Managing IP address assignment in networks.",
  "Ngrok": "Exposing local servers to the public internet over secure tunnels.",
};

// --- State ---
let nodes = [];
let draggingNode = null;
let animationId;
let startX = 0, startY = 0;
let startTime = 0;

// --- Modal ---
const modal = document.getElementById("skill-modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

if (closeModal) {
  closeModal.onclick = () => modal.classList.remove("show");
}

window.onclick = (event) => {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
}

function showModal(name) {
  if (!modal) return;
  modalTitle.textContent = name;
  modalDesc.textContent = SKILL_DATA[name] || "A key technology in my stack.";
  modal.classList.add("show");
}

// --- Loop ---
function loop() {
  updatePhysics();
  render();
  animationId = requestAnimationFrame(loop);
}

// --- Initialization ---
function init() {
  const { width, height } = container.getBoundingClientRect();
  const cols = Math.floor(width / (CONFIG.radius * 2.2)); // safe layout

  nodes = bubbles.map((el, i) => {
    // Grid layout to ensure NO initial overlap
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Spread them out nicely
    const x = (col * (CONFIG.radius * 2.5)) + CONFIG.radius * 2;
    // Start them higher up so they fall
    const y = (row * (CONFIG.radius * 2.5)) + CONFIG.radius * 2;

    return {
      el,
      x,
      y,
      vx: 0,
      vy: 0,
      isDragging: false
    };
  });

  // Start Loop
  cancelAnimationFrame(animationId);
  loop();
}

// ... handlers ...


// --- Interaction Handlers ---
function handleStart(x, y) {
  startX = x;
  startY = y;
  startTime = Date.now();

  const node = findNodeAt(x, y);
  if (node) {
    draggingNode = node;
    node.isDragging = true;
    node.vx = 0;
    node.vy = 0;
  }
}

function handleMove(x, y) {
  if (draggingNode) {
    const rect = container.getBoundingClientRect();
    draggingNode.x = x - rect.left;
    draggingNode.y = y - rect.top;
    draggingNode.vx = 0;
    draggingNode.vy = 0;
  }
}

function handleEnd(x, y) {
  if (draggingNode) {
    // Click Detection logic:
    // If moved less than threshold AND time < threshold
    const duration = Date.now() - startTime;
    const dx = x - startX;
    const dy = y - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (duration < 250 && dist < 10) {
      // It's a click!
      const name = draggingNode.el.getAttribute("data-name");
      showModal(name);
    }

    draggingNode.isDragging = false;
    draggingNode = null;
  }
}

function findNodeAt(x, y) {
  // Simple circle hit test
  const relativeX = x - container.getBoundingClientRect().left;
  const relativeY = y - container.getBoundingClientRect().top;

  // Find closest node within radius
  return nodes.find(node => {
    const dx = node.x - relativeX;
    const dy = node.y - relativeY;
    return (dx * dx + dy * dy) <= (CONFIG.radius * CONFIG.radius);
  });
}

// Mouse
window.addEventListener("mousedown", e => handleStart(e.clientX, e.clientY));
window.addEventListener("mousemove", e => handleMove(e.clientX, e.clientY));
window.addEventListener("mouseup", e => handleEnd(e.clientX, e.clientY));

// Touch
window.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  handleStart(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener("touchmove", e => {
  if (draggingNode) e.preventDefault(); // Prevent scrolling while dragging
  const touch = e.touches[0];
  handleMove(touch.clientX, touch.clientY);
}, { passive: false });

window.addEventListener("touchend", e => {
  // changedtouches for end event
  const touch = e.changedTouches[0];
  handleEnd(touch.clientX, touch.clientY);
});

function updatePhysics() {
  const { width, height } = container.getBoundingClientRect();

  // 1. Move & Wall Constraints
  nodes.forEach(node => {
    if (node.isDragging) return;

    // Gravity
    node.vy += CONFIG.gravity;

    // Friction
    node.vx *= CONFIG.friction;
    node.vy *= CONFIG.friction;

    // Strict Speed Limit (Molasses Mode)
    // If they move faster than 3px/frame, CLAMP IT.
    // This physically prevents "razzing".
    const maxSpeed = 3;
    const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      node.vx *= scale;
      node.vy *= scale;
    }

    // Apply Velocity
    node.x += node.vx;
    node.y += node.vy;

    // --- Walls ---

    // Floor
    if (node.y + CONFIG.radius > height) {
      node.y = height - CONFIG.radius;
      node.vy *= -CONFIG.wallBounce;

      // Friction on floor
      node.vx *= 0.5; // Grind to halt

      // Hard Stop threshold
      if (Math.abs(node.vy) < CONFIG.gravity * 3) {
        node.vy = 0;
      }
    }
    // Ceiling
    else if (node.y - CONFIG.radius < 0) {
      node.y = CONFIG.radius;
      node.vy *= -CONFIG.wallBounce;
    }

    // Walls
    if (node.x + CONFIG.radius > width) {
      node.x = width - CONFIG.radius;
      node.vx *= -CONFIG.wallBounce;
    }
    else if (node.x - CONFIG.radius < 0) {
      node.x = CONFIG.radius;
      node.vx *= -CONFIG.wallBounce;
    }
  });

  // 2. Collision Resolution (Circle-Circle)
  const iterations = 5; // More stable
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        resolveContact(nodes[i], nodes[j]);
      }
    }
  }
}

function resolveContact(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distSq = dx * dx + dy * dy;
  const radSum = CONFIG.radius * 2;

  if (distSq < radSum * radSum && distSq > 0) {
    const dist = Math.sqrt(distSq);
    const overlap = radSum - dist;

    // Normal
    const nx = dx / dist;
    const ny = dy / dist;

    // 1. Positional Correction (Push apart)
    const separation = overlap * 0.5;
    if (!a.isDragging) {
      a.x -= nx * separation;
      a.y -= ny * separation;
    }
    if (!b.isDragging) {
      b.x += nx * separation;
      b.y += ny * separation;
    }

    // 2. Velocity Resolution (Bounce)
    // If dragging, treat as infinite mass? Simplified: just bounce dynamic one off static one logic
    // For now, standard elastic

    // Relative Vel
    const dvx = b.vx - a.vx;
    const dvy = b.vy - a.vy;

    const velAlongNormal = dvx * nx + dvy * ny;

    // Only if moving towards each other
    if (velAlongNormal < 0) {
      const restitution = CONFIG.ballBounce;
      let j = -(1 + restitution) * velAlongNormal;
      j /= 2; // Equal mass

      const impulseX = j * nx;
      const impulseY = j * ny;

      if (!a.isDragging) {
        a.vx -= impulseX;
        a.vy -= impulseY;
      }
      if (!b.isDragging) {
        b.vx += impulseX;
        b.vy += impulseY;
      }
    }
  }
}

function render() {
  nodes.forEach(node => {
    // Translation uses top-left origin, x/y are center
    const tx = node.x - CONFIG.radius;
    const ty = node.y - CONFIG.radius;
    node.el.style.transform = `translate(${tx}px, ${ty}px)`;
  });
}

// Start
init();