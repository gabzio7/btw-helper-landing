/* =========================================================================
   hero.js — Three.js ambient particle field + GSAP hero load timeline.
   Reduced motion: nothing here runs; the CSS gradient fallback + final
   text already in the markup ARE the final state.
   ========================================================================= */

import * as THREE from "three";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------ Three.js */
function initField() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap DPR at 2
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.z = 60;

  // Instanced points with a lightweight custom shader — no geometry to speak of.
  const COUNT = 700;
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        // slow ambient drift, unique per particle
        p.x += sin(uTime * 0.12 + aSeed * 40.0) * 3.5;
        p.y += cos(uTime * 0.10 + aSeed * 55.0) * 3.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.4 + aSeed * 2.4) * uPixelRatio * (60.0 / -mv.z);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vSeed;
      void main() {
        // soft round point
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        // indigo (#5B5BF0) -> violet (#a78bfa)
        vec3 indigo = vec3(0.357, 0.357, 0.941);
        vec3 violet = vec3(0.655, 0.545, 0.980);
        vec3 col = mix(indigo, violet, vSeed);
        gl_FragColor = vec4(col, a * 0.32); // low opacity — never competes with text
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const clock = new THREE.Clock();
  let raf = null;
  let visible = true;   // tab visibility
  let onScreen = true;  // hero in viewport

  function frame() {
    raf = null;
    if (!visible || !onScreen) return;
    mat.uniforms.uTime.value = clock.getElapsedTime();
    points.rotation.y = clock.getElapsedTime() * 0.01;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf && visible && onScreen) raf = requestAnimationFrame(frame); }
  function stop()  { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // pause when the tab is hidden
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    visible ? start() : stop();
  });

  // pause when the hero is scrolled out of view
  new IntersectionObserver((entries) => {
    onScreen = entries[0].isIntersecting;
    onScreen ? start() : stop();
  }).observe(canvas);

  // resize without reallocating anything
  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }, 120);
  });

  window.addEventListener("pagehide", () => {
    stop();
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  });

  start();
}

/* ------------------------------------------------------- GSAP timeline */
function formatEuro(v) {
  return "+€" + v.toFixed(2).replace(".", ",");
}

function initTimeline() {
  const resultEl = document.getElementById("mock-result");
  const target = parseFloat(resultEl.dataset.target); // 24.15

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // headline mask reveal (lines rise out of overflow-hidden .mask wrappers)
  tl.from(".hero h1 .line", { yPercent: 110, duration: 0.9, stagger: 0.12 })
    .from(".hero .eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.55")
    .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.35")
    .from([".hero-ctas .btn", ".cta-note"], { opacity: 0, y: 18, duration: 0.55, stagger: 0.08 }, "-=0.3")
    .from("#hero-mock", { opacity: 0, y: 26, duration: 0.7 }, "-=0.35");

  // the count-up: 0 -> +€24,15 (power2.inOut per the brief)
  const counter = { v: 0 };
  tl.to(counter, {
    v: target,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => { resultEl.textContent = formatEuro(counter.v); },
    onComplete: () => { resultEl.textContent = formatEuro(target); },
  }, "-=0.2");

  // rubriek rows tick in beneath the number
  tl.from("#mock-rows .mock-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.12 }, "-=1.0");

  // subtle parallax on the dashboard card while scrolling the hero
  gsap.to("#hero-mock", {
    y: -40,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
}

if (!reducedMotion) {
  initField();
  initTimeline();
}
