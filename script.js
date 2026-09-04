document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. THREE.JS 3D HYPERSPACE CANVAS ENGINE
  // ==========================================
  const container = document.getElementById('canvas-container');
  if (container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const particlesCount = 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 16;

      const mix = Math.random();
      if (mix > 0.5) {
        colors[i] = 1.0; colors[i + 1] = 0.71; colors[i + 2] = 0.01; // Gold
      } else if (mix > 0.25) {
        colors[i] = 0.0; colors[i + 1] = 0.94; colors[i + 2] = 1.0;  // Cyan
      } else {
        colors[i] = 0.54; colors[i + 1] = 0.17; colors[i + 2] = 0.88; // Purple
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });

    function animate3D() {
      requestAnimationFrame(animate3D);
      particleSystem.rotation.y += 0.0012;
      particleSystem.rotation.x += 0.0006;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    }
    animate3D();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ==========================================================
  // 2. 5-LAKH TAKA AGENCY LEVEL INTERACTIVE PARTICLE CURSOR
  // ==========================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let lastParticleTime = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    const now = Date.now();
    if (now - lastParticleTime > 25) {
      createParticle(mouseX, mouseY);
      lastParticleTime = now;
    }
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';

    const colors = ['#ffb703', '#f77f00', '#00f0ff', '#8a2be2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const size = Math.random() * 6 + 2;
    const moveX = (Math.random() - 0.5) * 40;
    const moveY = (Math.random() - 0.5) * 40;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = randomColor;
    particle.style.boxShadow = `0 0 10px ${randomColor}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--mx', `${moveX}px`);
    particle.style.setProperty('--my', `${moveY}px`);

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 800);
  }

  const hoverElements = document.querySelectorAll('a, button, .music-widget, .skill-chip, .contact-card, .orbit-badge');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // ==========================================
  // 3. SCROLL SPY & REVEAL ANIMATIONS
  // ==========================================
  const sections = document.querySelectorAll('.scroll-section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 250;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sec.id) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // ==========================================
  // 4. TYPEWRITER ENGINE WITH "i_am_a_expert"
  // ==========================================
  const skills = ["PROGRAMMER", "SOFTWARE DEVELOPER", "NETWORK ENGINEER", "CYBER SECURITY ENTHUSIAST"];
  let skillIdx = 0, charIdx = 0, isDeleting = false;
  const typewriterEl = document.getElementById("typewriter");

  function type() {
    if (!typewriterEl) return;
    const current = skills[skillIdx];
    typewriterEl.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
    charIdx += isDeleting ? -1 : 1;

    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      skillIdx = (skillIdx + 1) % skills.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  type();

  // ==========================================
  // 5. AUDIO ENGINE
  // ==========================================
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicText = document.getElementById('music-text');

  let isPlaying = false;

  function setAudioState(active) {
    isPlaying = active;
    if (active) {
      musicToggle.classList.add('playing');
      if (musicText) musicText.textContent = "SYSTEM LIVE";
    } else {
      musicToggle.classList.remove('playing');
      if (musicText) musicText.textContent = "SYSTEM PAUSED";
    }
  }

  function playMusic() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      setAudioState(true);
    }).catch(() => {
      setAudioState(false);
    });
  }

  function pauseMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    setAudioState(false);
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  const unlockAudio = () => {
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('scroll', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);
  document.addEventListener('scroll', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

  // ==========================================
  // 6. FEEDBACK & SECRET ADMIN LOGIC
  // ==========================================
  const stars = document.querySelectorAll('.star-rating-input .star');
  let selectedRating = 5;

  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-rating'));
      updateStars(selectedRating);
    });
  });

  function updateStars(rating) {
    stars.forEach(s => {
      const r = parseInt(s.getAttribute('data-rating'));
      if (r <= rating) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });
  }
  updateStars(5);

  const feedbackForm = document.getElementById('public-feedback-form');
  const feedbackAlert = document.getElementById('feedback-alert');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userName = document.getElementById('user-name').value.trim();
      const userMessage = document.getElementById('user-message').value.trim();

      if (!userName || !userMessage) return;

      const newFeedback = {
        id: Date.now(),
        name: userName,
        rating: selectedRating,
        message: userMessage,
        date: new Date().toLocaleString()
      };

      const existingFeedbacks = JSON.parse(localStorage.getItem('shawon_feedbacks') || '[]');
      existingFeedbacks.push(newFeedback);
      localStorage.setItem('shawon_feedbacks', JSON.stringify(existingFeedbacks));

      feedbackForm.reset();
      updateStars(5);
      selectedRating = 5;

      feedbackAlert.textContent = "✓ Transmission Received. Thank you for your feedback!";
      feedbackAlert.style.display = "block";
      setTimeout(() => {
        feedbackAlert.style.display = "none";
      }, 4000);

      renderLogs();
    });
  }

  // Secret Key Combination Listener (Ctrl + Shift + F)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
      e.preventDefault();
      const pwd = prompt("ENTER SECURITY CLEARANCE CODE:");
      if (pwd === "1234") {
        const adminPanel = document.getElementById('secret-admin-panel');
        adminPanel.style.display = 'block';
        adminPanel.scrollIntoView({ behavior: 'smooth' });
        renderLogs();
      } else if (pwd !== null) {
        alert("ACCESS DENIED: Unauthorized Credentials.");
      }
    }
  });

  function renderLogs() {
    const logsContainer = document.getElementById('logs-container');
    if (!logsContainer) return;

    const feedbacks = JSON.parse(localStorage.getItem('shawon_feedbacks') || '[]');
    if (feedbacks.length === 0) {
      logsContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No feedback logs found in local database.</p>`;
      return;
    }

    logsContainer.innerHTML = feedbacks.map(item => `
      <div class="log-card">
        <div class="log-header">
          <span class="log-author"><i class="fa-solid fa-user-astronaut"></i> ${escapeHTML(item.name)}</span>
          <span class="log-stars">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span>
        </div>
        <p class="log-msg">"${escapeHTML(item.message)}"</p>
        <div class="log-footer">
          <span class="log-date">${item.date}</span>
          <button class="delete-log-btn" onclick="deleteLog(${item.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).reverse().join('');
  }

  window.deleteLog = function(id) {
    let feedbacks = JSON.parse(localStorage.getItem('shawon_feedbacks') || '[]');
    feedbacks = feedbacks.filter(f => f.id !== id);
    localStorage.setItem('shawon_feedbacks', JSON.stringify(feedbacks));
    renderLogs();
  };

  const clearBtn = document.getElementById('clear-all-logs');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all feedback logs?")) {
        localStorage.removeItem('shawon_feedbacks');
        renderLogs();
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
