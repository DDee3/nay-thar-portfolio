/**
 * NAY THAR HTET — APPLE-INSPIRED MINIMALIST EDITORIAL MOTION & 3D ENGINE
 * Implements:
 * 1. Smooth Lenis Scrolling across the document
 * 2. Slow, Gentle, Continuous 3D Floating Abstract Glass Shape + Clean Isometric Grid
 *    in the Hero background (Three.js WebGL + 2D Canvas fallback)
 * 3. Framer Motion for Elegant, Slow Fade-Up Reveals on Load & Scroll
 * 4. Editorial Category Filter for the Stacked Project Showcase
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const APPLE_EASE_ARRAY = [0.16, 1, 0.3, 1];
  const APPLE_EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ==========================================================================
     1. LENIS SMOOTH SCROLLING
     ========================================================================== */
  let lenisInstance = null;

  function initLenis() {
    if (prefersReducedMotion) return;

    if (typeof window.Lenis !== 'undefined') {
      try {
        lenisInstance = new window.Lenis({
          duration: 1.2,
          easing: function (t) {
            return Math.min(1, 1.001 - Math.pow(2, -10 * t));
          },
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.92,
          touchMultiplier: 1.5,
        });

        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
          anchor.addEventListener('click', function (e) {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, { offset: -72 });
            }
          });
        });
      } catch (err) {
        // Fallback to native browser scroll
      }
    }
  }

  /* ==========================================================================
     2. SLOW, GENTLE, CONTINUOUS 3D FLOATING ABSTRACT GLASS SHAPE & ISOMETRIC GRID
        Designed for Apple Light Gray (#F5F5F7) Ground — Soothing & Subtle
     ========================================================================== */
  function initHeroApple3D() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    window.addEventListener(
      'mousemove',
      function (e) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      },
      { passive: true }
    );

    if (typeof window.THREE !== 'undefined') {
      try {
        const THREE = window.THREE;
        const scene = new THREE.Scene();

        const getWidth = function () {
          return (canvas.parentElement && canvas.parentElement.clientWidth) || window.innerWidth;
        };
        const getHeight = function () {
          return (canvas.parentElement && canvas.parentElement.clientHeight) || 720;
        };

        const camera = new THREE.PerspectiveCamera(36, getWidth() / getHeight(), 0.1, 100);
        camera.position.set(0, 0, 9.2);

        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(getWidth(), getHeight());
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        // Apple Studio Lighting Rig for #F5F5F7
        const ambientLight = new THREE.AmbientLight(0xf5f5f7, 0.96);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
        keyLight.position.set(4.0, 6.5, 6.0);
        scene.add(keyLight);

        const subtleBlueRim = new THREE.DirectionalLight(0x0066cc, 0.28);
        subtleBlueRim.position.set(-5.0, -3.5, 3.0);
        scene.add(subtleBlueRim);

        const softFillLight = new THREE.PointLight(0xe5e5ea, 0.75, 20);
        softFillLight.position.set(3.0, -3.0, 4.5);
        scene.add(softFillLight);

        const rootGroup = new THREE.Group();
        scene.add(rootGroup);

        // --- A. SOFT FLOATING ABSTRACT GLASS SHAPE (Centered behind Hero Typography) ---
        const glassGroup = new THREE.Group();
        rootGroup.add(glassGroup);

        const sphereGeo = new THREE.SphereGeometry(2.05, 64, 64);
        const posAttr = sphereGeo.attributes.position;
        const vertexCount = posAttr.count;
        const basePositions = new Float32Array(vertexCount * 3);

        for (let i = 0; i < vertexCount; i++) {
          basePositions[i * 3] = posAttr.getX(i);
          basePositions[i * 3 + 1] = posAttr.getY(i);
          basePositions[i * 3 + 2] = posAttr.getZ(i);
        }

        const glassMaterial =
          typeof THREE.MeshPhysicalMaterial === 'function'
            ? new THREE.MeshPhysicalMaterial({
                color: 0xeaeaef,
                roughness: 0.15,
                metalness: 0.02,
                clearcoat: 0.9,
                clearcoatRoughness: 0.1,
                reflectivity: 0.75,
                transparent: true,
                opacity: 0.68,
              })
            : new THREE.MeshPhongMaterial({
                color: 0xeaeaef,
                specular: 0xffffff,
                shininess: 95,
                transparent: true,
                opacity: 0.68,
              });

        const glassSculpture = new THREE.Mesh(sphereGeo, glassMaterial);
        glassGroup.add(glassSculpture);

        // Delicate Orbital Glass Ring
        const ringGeo = new THREE.TorusGeometry(2.82, 0.012, 20, 140);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc7c7cc,
          transparent: true,
          opacity: 0.42,
        });
        const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
        orbitalRing.rotation.x = 1.18;
        orbitalRing.rotation.y = -0.22;
        glassGroup.add(orbitalRing);

        // --- B. SUBTLE ARCHITECTURAL ISOMETRIC PLANE IN LOWER FIELD ---
        const isoGridGroup = new THREE.Group();
        isoGridGroup.position.set(0, -2.15, -1.6);
        isoGridGroup.rotation.x = -1.12;
        rootGroup.add(isoGridGroup);

        const GRID_COLS = 18;
        const GRID_ROWS = 10;
        const GRID_SPACING = 0.75;
        const gridVerts = new Float32Array(GRID_COLS * GRID_ROWS * 3);
        const gridIndices = [];

        let vIdx = 0;
        for (let r = 0; r < GRID_ROWS; r++) {
          for (let c = 0; c < GRID_COLS; c++) {
            gridVerts[vIdx * 3] = (c - (GRID_COLS - 1) / 2) * GRID_SPACING;
            gridVerts[vIdx * 3 + 1] = (r - (GRID_ROWS - 1) / 2) * GRID_SPACING;
            gridVerts[vIdx * 3 + 2] = 0;

            const curr = r * GRID_COLS + c;
            if (c < GRID_COLS - 1) gridIndices.push(curr, curr + 1);
            if (r < GRID_ROWS - 1) gridIndices.push(curr, curr + GRID_COLS);
            vIdx++;
          }
        }

        const gridGeo = new THREE.BufferGeometry();
        gridGeo.setAttribute('position', new THREE.BufferAttribute(gridVerts, 3));
        gridGeo.setIndex(gridIndices);

        const gridMat = new THREE.LineBasicMaterial({
          color: 0xd2d2d7,
          transparent: true,
          opacity: 0.36,
        });
        const isoLines = new THREE.LineSegments(gridGeo, gridMat);
        isoGridGroup.add(isoLines);

        let time = 0;

        function updateSculpture(t) {
          for (let i = 0; i < vertexCount; i++) {
            const bx = basePositions[i * 3];
            const by = basePositions[i * 3 + 1];
            const bz = basePositions[i * 3 + 2];

            const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
            const nx = bx / len;
            const ny = by / len;
            const nz = bz / len;

            const w1 = Math.sin(nx * 1.65 + t * 0.85) * Math.cos(ny * 1.45 + t * 0.65);
            const w2 = Math.sin(ny * 1.95 - t * 0.55) * Math.cos(nz * 1.75 + t * 0.5);
            const disp = 1 + (w1 * 0.065 + w2 * 0.045);

            posAttr.setXYZ(i, bx * disp, by * disp, bz * disp);
          }
          posAttr.needsUpdate = true;
          sphereGeo.computeVertexNormals();

          // Gentle wave across the subtle isometric architectural plane
          const gPos = gridGeo.attributes.position;
          let gCursor = 0;
          for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
              const gx = gPos.getX(gCursor);
              const gy = gPos.getY(gCursor);
              const gz = Math.sin(gx * 0.45 + t * 0.9) * 0.14 + Math.cos(gy * 0.5 + t * 0.7) * 0.12;
              gPos.setZ(gCursor, gz);
              gCursor++;
            }
          }
          gPos.needsUpdate = true;
        }

        function renderScene() {
          if (!prefersReducedMotion) {
            requestAnimationFrame(renderScene);
          }

          // Slow, continuous, meditative time step
          time += 0.0055;

          smoothMouseX += (mouseX - smoothMouseX) * 0.02;
          smoothMouseY += (mouseY - smoothMouseY) * 0.02;

          updateSculpture(time);

          glassGroup.rotation.y = time * 0.12 + smoothMouseX * 0.18;
          glassGroup.rotation.x = Math.sin(time * 0.22) * 0.08 - smoothMouseY * 0.14;
          glassGroup.position.y = Math.sin(time * 0.42) * 0.1;

          orbitalRing.rotation.z = time * 0.08;

          renderer.render(scene, camera);
        }

        renderScene();

        window.addEventListener(
          'resize',
          function () {
            const w = getWidth();
            const h = getHeight();
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            if (prefersReducedMotion) {
              renderer.render(scene, camera);
            }
          },
          { passive: true }
        );
        return;
      } catch (err) {
        // Fall through to 2D Canvas organic glass shape fallback
      }
    }

    initCanvasAppleGlassFallback(canvas, function () {
      return { mouseX: mouseX, mouseY: mouseY };
    });
  }

  function initCanvasAppleGlassFallback(canvas, getMouse) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = (canvas.parentElement && canvas.parentElement.clientWidth) || window.innerWidth;
      canvas.height = (canvas.parentElement && canvas.parentElement.clientHeight) || 680;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let t = 0;
    let sx = 0;
    let sy = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      const m = getMouse();
      sx += (m.mouseX - sx) * 0.02;
      sy += (m.mouseY - sy) * 0.02;

      const cx = canvas.width * 0.5 + sx * 16;
      const cy = canvas.height * 0.48 - sy * 12 + Math.sin(t * 0.5) * 6;
      const baseR = Math.min(canvas.width, canvas.height) * 0.27;

      const layers = [
        { scale: 1.0, fill: 'rgba(232, 232, 237, 0.62)', phase: 0 },
        { scale: 0.78, fill: 'rgba(255, 255, 255, 0.55)', phase: 1.4 },
      ];

      layers.forEach(function (layer) {
        ctx.beginPath();
        const steps = 72;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const morph =
            Math.sin(angle * 3 + t + layer.phase) * 0.04 +
            Math.cos(angle * 2 - t * 0.75 + layer.phase) * 0.03;
          const r = baseR * layer.scale * (1 + morph);
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = layer.fill;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    }

    draw();
  }

  /* ==========================================================================
     3. FRAMER MOTION ELEGANT, SLOW FADE-UP REVEALS ON LOAD & SCROLL
     ========================================================================== */
  function initFramerMotionReveals() {
    if (prefersReducedMotion) return;

    const heroItems = document.querySelectorAll('[data-hero-reveal]');
    const scrollSections = document.querySelectorAll('[data-scroll-section]');

    const motionLib = window.Motion || window.FramerMotion || null;
    const hasMotionAnimate = motionLib && typeof motionLib.animate === 'function';

    // 3A. Elegant Slow Fade-Up on Page Load
    if (heroItems.length > 0) {
      heroItems.forEach(function (el, idx) {
        if (hasMotionAnimate) {
          try {
            motionLib.animate(
              el,
              { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0px)'] },
              { duration: 0.95, delay: 0.08 + idx * 0.09, easing: APPLE_EASE_ARRAY }
            );
            return;
          } catch (e) {
            // Fall through to WAAPI
          }
        }
        if (typeof el.animate === 'function') {
          el.animate(
            [
              { opacity: 0, transform: 'translateY(22px)' },
              { opacity: 1, transform: 'translateY(0px)' },
            ],
            {
              duration: 950,
              delay: 80 + idx * 90,
              easing: APPLE_EASE_CSS,
              fill: 'both',
            }
          );
        }
      });
    }

    // 3B. Elegant Slow Fade-Up Reveals as the User Scrolls Down
    if (scrollSections.length > 0) {
      const revealSection = function (section) {
        if (section.dataset.revealed === 'true') return;
        section.dataset.revealed = 'true';

        if (hasMotionAnimate) {
          try {
            motionLib.animate(
              section,
              { opacity: [0, 1], transform: ['translateY(28px)', 'translateY(0px)'] },
              { duration: 0.95, easing: APPLE_EASE_ARRAY }
            );
          } catch (e) {
            section.style.opacity = '1';
            section.style.transform = 'none';
          }
        } else if (typeof section.animate === 'function') {
          section.animate(
            [
              { opacity: 0, transform: 'translateY(28px)' },
              { opacity: 1, transform: 'translateY(0px)' },
            ],
            {
              duration: 950,
              easing: APPLE_EASE_CSS,
              fill: 'forwards',
            }
          );
        }

        const items = section.querySelectorAll('[data-scroll-item]');
        items.forEach(function (item, idx) {
          if (hasMotionAnimate) {
            try {
              motionLib.animate(
                item,
                { opacity: [0, 1], transform: ['translateY(26px)', 'translateY(0px)'] },
                { duration: 0.9, delay: 0.08 + idx * 0.1, easing: APPLE_EASE_ARRAY }
              );
              return;
            } catch (e) {
              // Fall through to WAAPI
            }
          }
          if (typeof item.animate === 'function') {
            item.animate(
              [
                { opacity: 0, transform: 'translateY(26px)' },
                { opacity: 1, transform: 'translateY(0px)' },
              ],
              {
                duration: 900,
                delay: 80 + idx * 100,
                easing: APPLE_EASE_CSS,
                fill: 'forwards',
              }
            );
          }
        });
      };

      if (motionLib && typeof motionLib.inView === 'function') {
        scrollSections.forEach(function (section) {
          motionLib.inView(
            section,
            function () {
              revealSection(section);
            },
            { amount: 0.08 }
          );
        });
      } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                revealSection(entry.target);
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
        );

        scrollSections.forEach(function (sec) {
          observer.observe(sec);
        });
      }
    }
  }

  /* ==========================================================================
     4. EDITORIAL CATEGORY FILTER FOR STACKED PROJECT SECTIONS
     ========================================================================== */
  function initProjectFilter() {
    const filterButtons = document.querySelectorAll('[data-project-filter]');
    const projectItems = document.querySelectorAll('[data-project-tags]');

    if (!filterButtons.length || !projectItems.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-project-filter') || 'all';

        filterButtons.forEach(function (b) {
          const active = b.getAttribute('data-project-filter') === filter;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        projectItems.forEach(function (item) {
          const tags = (item.getAttribute('data-project-tags') || '').split(/\s+/);
          const matches = filter === 'all' || tags.indexOf(filter) !== -1;

          if (matches) {
            item.style.display = '';
            if (!prefersReducedMotion && typeof item.animate === 'function') {
              item.animate(
                [
                  { opacity: 0, transform: 'translateY(16px)' },
                  { opacity: 1, transform: 'translateY(0px)' },
                ],
                { duration: 480, easing: APPLE_EASE_CSS }
              );
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     BOOTSTRAP ON DOM READY
     ========================================================================== */
  function boot() {
    initLenis();
    initHeroApple3D();
    initFramerMotionReveals();
    initProjectFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
