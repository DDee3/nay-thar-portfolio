/**
 * NAY THAR HTET — SPATIAL 3D, LENIS SMOOTH SCROLL & FRAMER MOTION ENGINE
 * Implements:
 * 1. Lenis Smooth Scrolling wrapper & anchor intercept
 * 2. Three.js 3D Floating Wireframe Construct (with 2D 3D-math fallback)
 * 3. Staggered Hero Text Reveal & Scroll-Triggered Section Animations (Framer Motion DOM / WAAPI)
 * 4. 3D Perspective Tilt + Radial Orange Glow on Project & Bento Cards
 * 5. Snappy Magnetic Button Micro-interactions
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. LENIS SMOOTH SCROLLING
     ========================================================================== */
  let lenisInstance = null;

  function initLenis() {
    if (prefersReducedMotion) return;

    if (typeof window.Lenis !== 'undefined') {
      lenisInstance = new window.Lenis({
        duration: 1.15,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Smooth anchor scrolling
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          const targetId = anchor.getAttribute('href');
          if (!targetId || targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, { offset: -80 });
          }
        });
      });
    }
  }

  /* ==========================================================================
     2. HERO 3D FLOATING WIREFRAME GEOMETRY (LaunchKit Spatial Style)
     ========================================================================== */
  function initHero3D() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    const coordReadout = document.getElementById('telemetry-coords');
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener(
      'mousemove',
      function (e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        if (coordReadout) {
          const rx = (mouseX * 45).toFixed(1);
          const ry = (mouseY * 45).toFixed(1);
          coordReadout.textContent = 'VEC[' + rx + '°, ' + ry + '°]';
        }
      },
      { passive: true }
    );

    // Use Three.js WebGL if available
    if (typeof window.THREE !== 'undefined') {
      try {
        const THREE = window.THREE;
        const scene = new THREE.Scene();

        const width = canvas.parentElement.clientWidth || window.innerWidth;
        const height = canvas.parentElement.clientHeight || 640;

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.z = 6.5;

        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const mainGroup = new THREE.Group();
        // Position slightly right on desktop so it balances the massive hero typography
        function updateGroupOffset() {
          const w = canvas.parentElement.clientWidth || window.innerWidth;
          mainGroup.position.x = w >= 1024 ? 1.55 : 0;
          mainGroup.position.y = w >= 1024 ? 0.1 : 0.2;
        }
        updateGroupOffset();
        scene.add(mainGroup);

        // 1. Outer Wireframe Geodesic Icosahedron (Crisp White subtle cage)
        const outerGeo = new THREE.IcosahedronGeometry(2.15, 1);
        const outerEdges = new THREE.EdgesGeometry(outerGeo);
        const outerMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.22,
        });
        const outerWireframe = new THREE.LineSegments(outerEdges, outerMat);
        mainGroup.add(outerWireframe);

        // 2. Inner Core Octahedron Wireframe (Vibrant Orange #FF5A00)
        const innerGeo = new THREE.OctahedronGeometry(1.22, 0);
        const innerEdges = new THREE.EdgesGeometry(innerGeo);
        const innerMat = new THREE.LineBasicMaterial({
          color: 0xff5a00,
          transparent: true,
          opacity: 0.88,
        });
        const innerWireframe = new THREE.LineSegments(innerEdges, innerMat);
        mainGroup.add(innerWireframe);

        // 3. Inner Nested Wireframe Lattice
        const midGeo = new THREE.IcosahedronGeometry(1.55, 0);
        const midEdges = new THREE.EdgesGeometry(midGeo);
        const midMat = new THREE.LineBasicMaterial({
          color: 0xff5a00,
          transparent: true,
          opacity: 0.32,
        });
        const midWireframe = new THREE.LineSegments(midEdges, midMat);
        mainGroup.add(midWireframe);

        // 4. Orbital Telemetry Ring 1 (Orange)
        const ringGeo1 = new THREE.RingGeometry(2.58, 2.6, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({
          color: 0xff5a00,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.35,
        });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 2.6;
        ring1.rotation.y = Math.PI / 6;
        mainGroup.add(ring1);

        // 5. Orbital Telemetry Ring 2 (White)
        const ringGeo2 = new THREE.RingGeometry(2.92, 2.935, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.12,
        });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.x = -Math.PI / 3;
        ring2.rotation.y = -Math.PI / 5;
        mainGroup.add(ring2);

        // 6. Spatial Vertex Nodes (Points at outer icosahedron vertices)
        const ptsMat = new THREE.PointsMaterial({
          color: 0xff5a00,
          size: 0.065,
          transparent: true,
          opacity: 0.9,
        });
        const vertexPoints = new THREE.Points(outerGeo, ptsMat);
        mainGroup.add(vertexPoints);

        let clock = 0;
        function animate3D() {
          if (!prefersReducedMotion) {
            requestAnimationFrame(animate3D);
          }
          clock += 0.0065;

          targetX += (mouseX - targetX) * 0.05;
          targetY += (mouseY - targetY) * 0.05;

          const scrollY = window.scrollY || 0;
          const scrollFactor = scrollY * 0.0012;

          outerWireframe.rotation.y = clock * 0.55 + targetX * 0.5 + scrollFactor;
          outerWireframe.rotation.x = clock * 0.32 - targetY * 0.4 + scrollFactor * 0.5;

          vertexPoints.rotation.copy(outerWireframe.rotation);

          innerWireframe.rotation.y = -clock * 0.95 + targetX * 0.8;
          innerWireframe.rotation.x = -clock * 0.65 + targetY * 0.6;
          innerWireframe.rotation.z = clock * 0.4;

          midWireframe.rotation.y = clock * 0.35 - targetX * 0.3;
          midWireframe.rotation.z = -clock * 0.45;

          ring1.rotation.z = clock * 0.5;
          ring2.rotation.z = -clock * 0.35;

          // Subtle floating bob
          mainGroup.position.y = (window.innerWidth >= 1024 ? 0.05 : 0.15) + Math.sin(clock * 1.6) * 0.12;

          renderer.render(scene, camera);
        }

        animate3D();

        window.addEventListener(
          'resize',
          function () {
            const newW = canvas.parentElement.clientWidth || window.innerWidth;
            const newH = canvas.parentElement.clientHeight || 640;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
            updateGroupOffset();
          },
          { passive: true }
        );
        return;
      } catch (err) {
        // Fall through to 2D Canvas 3D-Math Wireframe Engine
      }
    }

    // Fallback 2D Canvas 3D-Projection Wireframe Renderer
    initCanvas3DFallback(canvas);
  }

  function initCanvas3DFallback(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 640;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
      [4, 5], [2, 11], [6, 10], [8, 7], [9, 1],
      [4, 11], [2, 10], [6, 7], [8, 1], [9, 5],
    ];

    let angle = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      angle += 0.006;
      const cx = canvas.width >= 1024 ? canvas.width * 0.72 : canvas.width * 0.5;
      const cy = canvas.height * 0.48;
      const scale = Math.min(canvas.width, canvas.height) * 0.22;

      const projected = rawVerts.map(function (v) {
        let x = v[0], y = v[1], z = v[2];
        // Rotate Y
        let x1 = x * Math.cos(angle) - z * Math.sin(angle);
        let z1 = x * Math.sin(angle) + z * Math.cos(angle);
        // Rotate X
        let y2 = y * Math.cos(angle * 0.6) - z1 * Math.sin(angle * 0.6);
        let z2 = y * Math.sin(angle * 0.6) + z1 * Math.cos(angle * 0.6);
        const perspective = 4 / (4 - z2 * 0.35);
        return [cx + x1 * scale * perspective, cy + y2 * scale * perspective];
      });

      ctx.strokeStyle = 'rgba(255, 90, 0, 0.45)';
      ctx.lineWidth = 1;
      edges.forEach(function (e) {
        const p1 = projected[e[0]];
        const p2 = projected[e[1]];
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      projected.forEach(function (p) {
        ctx.fillStyle = '#FF5A00';
        ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    }
    draw();
  }

  /* ==========================================================================
     3. STAGGERED HERO REVEAL & SCROLL-TRIGGERED SECTION ANIMATIONS
     ========================================================================== */
  function initScrollAndHeroAnimations() {
    const heroWords = document.querySelectorAll('[data-hero-reveal]');
    const scrollSections = document.querySelectorAll('[data-scroll-section]');

    if (prefersReducedMotion) return;

    const hasMotion = typeof window.Motion !== 'undefined' && typeof window.Motion.animate === 'function';

    // 3A. Staggered Hero Text & Element Reveal
    if (heroWords.length > 0) {
      if (hasMotion) {
        heroWords.forEach(function (el) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(32px)';
        });
        window.Motion.animate(
          heroWords,
          { opacity: [0, 1], y: [32, 0] },
          {
            duration: 0.75,
            delay: window.Motion.stagger ? window.Motion.stagger(0.075) : 0.08,
            easing: [0.16, 1, 0.3, 1],
          }
        );
      } else {
        heroWords.forEach(function (el, idx) {
          el.animate(
            [
              { opacity: 0, transform: 'translateY(32px)' },
              { opacity: 1, transform: 'translateY(0px)' },
            ],
            {
              duration: 750,
              delay: idx * 75,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              fill: 'both',
            }
          );
        });
      }
    }

    // 3B. Scroll-Triggered Fade-In & Slide-Up for Every Section & Bento Card
    if (scrollSections.length > 0) {
      if (hasMotion && typeof window.Motion.inView === 'function') {
        scrollSections.forEach(function (section) {
          const items = section.querySelectorAll('[data-scroll-item]');
          section.style.opacity = '0';
          section.style.transform = 'translateY(36px)';

          window.Motion.inView(
            section,
            function () {
              window.Motion.animate(
                section,
                { opacity: [0, 1], y: [36, 0] },
                { duration: 0.72, easing: [0.16, 1, 0.3, 1] }
              );

              if (items.length > 0) {
                window.Motion.animate(
                  items,
                  { opacity: [0, 1], y: [28, 0] },
                  {
                    duration: 0.68,
                    delay: window.Motion.stagger ? window.Motion.stagger(0.085, { start: 0.1 }) : 0.1,
                    easing: [0.16, 1, 0.3, 1],
                  }
                );
              }
            },
            { amount: 0.12 }
          );
        });
      } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                const section = entry.target;
                section.animate(
                  [
                    { opacity: 0, transform: 'translateY(36px)' },
                    { opacity: 1, transform: 'translateY(0px)' },
                  ],
                  {
                    duration: 720,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    fill: 'forwards',
                  }
                );

                const items = section.querySelectorAll('[data-scroll-item]');
                items.forEach(function (item, idx) {
                  item.animate(
                    [
                      { opacity: 0, transform: 'translateY(28px)' },
                      { opacity: 1, transform: 'translateY(0px)' },
                    ],
                    {
                      duration: 680,
                      delay: 90 + idx * 85,
                      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      fill: 'forwards',
                    }
                  );
                });

                obs.unobserve(section);
              }
            });
          },
          { threshold: 0.1 }
        );

        scrollSections.forEach(function (sec) {
          observer.observe(sec);
        });
      }
    }
  }

  /* ==========================================================================
     4. 3D TILT EFFECT + GLOWING ORANGE SPOTLIGHT ON PROJECT / BENTO CARDS
     ========================================================================== */
  function initTiltCards() {
    const cards = document.querySelectorAll('[data-tilt-card]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      const maxTilt = parseFloat(card.getAttribute('data-max-tilt')) || 5.5;

      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update CSS spotlight coordinates
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        if (prefersReducedMotion) return;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;

        card.style.transition = 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.08s ease-out';
        card.style.transform =
          'perspective(1100px) rotateX(' +
          rotateX.toFixed(2) +
          'deg) rotateY(' +
          rotateY.toFixed(2) +
          'deg) scale3d(1.012, 1.012, 1.012)';
      });

      card.addEventListener('mouseleave', function () {
        if (prefersReducedMotion) return;
        card.style.transition =
          'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ==========================================================================
     5. SNAPPY MAGNETIC BUTTON MICRO-INTERACTIONS
     ========================================================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    const buttons = document.querySelectorAll('[data-magnetic]');
    buttons.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = 'translate3d(' + (dx * 0.16).toFixed(1) + 'px, ' + (dy * 0.2 - 2).toFixed(1) + 'px, 0) scale(1.02)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     6. LIVE TELEMETRY CLOCK IN FOOTER / HEADER
     ========================================================================== */
  function initTelemetryClock() {
    const clockEl = document.getElementById('telemetry-clock');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      const sgt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      clockEl.textContent = 'SGT ' + sgt + ' // UTC+8';
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ==========================================================================
     BOOTSTRAP ON DOM READY
     ========================================================================== */
  function boot() {
    initLenis();
    initHero3D();
    initScrollAndHeroAnimations();
    initTiltCards();
    initMagneticButtons();
    initTelemetryClock();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

