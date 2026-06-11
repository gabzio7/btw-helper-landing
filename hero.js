/* =========================================================================
   hero.js — Three.js mouse-reactive ambient field + GSAP hero load timeline.
   Reduced motion: nothing here runs; the CSS gradient fallback + final
   text already in the markup ARE the final state.
   ========================================================================= */

import * as THREE from "three";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------ Three.js */
function initField() {
  const canvas = document.getElementById("hero-canvas");
  const hero = document.getElementById("hero");
  if (!canvas || !hero) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap DPR at 2
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  const FOV = 55;
  const CAM_Z = 60;
  const camera = new THREE.PerspectiveCamera(FOV, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.z = CAM_Z;

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
    uniforms: {
      uTime:       { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse:      { value: new THREE.Vector2(0, 0) },
      uStrength:   { value: 0 }, // eases in/out as the pointer enters/leaves
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2  uMouse;
      uniform float uStrength;
      varying float vSeed;
      varying float vForce;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        // slow ambient drift, unique per particle
        p.x += sin(uTime * 0.12 + aSeed * 40.0) * 3.5;
        p.y += cos(uTime * 0.10 + aSeed * 55.0) * 3.0;
        // magnetic field around the pointer: repel + swirl
        vec2 d = p.xy - uMouse;
        float dist = length(d);
        float force = smoothstep(26.0, 0.0, dist) * uStrength;
        vec2 dir = dist > 0.001 ? d / dist : vec2(0.0, 1.0);
        p.xy += dir * force * 10.0;                       // push away
        p.xy += vec2(-dir.y, dir.x) * force * 5.0;        // swirl around
        vForce = force;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.4 + aSeed * 2.4) * uPixelRatio * (60.0 / -mv.z) * (1.0 + force * 1.6);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vSeed;
      varying float vForce;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        // indigo (#5B5BF0) -> violet (#a78bfa), brightening near the pointer
        vec3 indigo = vec3(0.357, 0.357, 0.941);
        vec3 violet = vec3(0.655, 0.545, 0.980);
        vec3 col = mix(indigo, violet, vSeed);
        col = mix(col, vec3(1.0), vForce * 0.45);
        gl_FragColor = vec4(col, a * (0.32 + vForce * 0.5));
      }
    `,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* pointer → world coords on the z=0 plane, eased every frame */
  const mouseTarget = new THREE.Vector2(0, 0);
  let strengthTarget = 0;
  let tiltX = 0, tiltY = 0; // whole-field lean toward the pointer
  hero.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAM_Z;
    const halfW = halfH * camera.aspect;
    mouseTarget.set(nx * halfW, ny * halfH);
    tiltY = nx * 0.08;
    tiltX = -ny * 0.05;
    strengthTarget = 1;
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { strengthTarget = 0; }, { passive: true });

  const clock = new THREE.Clock();
  let raf = null;
  let visible = true;   // tab visibility
  let onScreen = true;  // hero in viewport

  function frame() {
    raf = null;
    if (!visible || !onScreen) return;
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    mat.uniforms.uMouse.value.lerp(mouseTarget, 0.08);
    mat.uniforms.uStrength.value += (strengthTarget - mat.uniforms.uStrength.value) * 0.06;
    points.rotation.y += (t * 0.01 + tiltY - points.rotation.y) * 0.05;
    points.rotation.x += (tiltX - points.rotation.x) * 0.05;
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

/* ------------------------------------------------- headline char split */
function splitHeadline() {
  const h1 = document.querySelector(".hero h1");
  const lines = [...h1.querySelectorAll(".line")];
  h1.setAttribute("aria-label", h1.textContent.trim().replace(/\s+/g, " "));
  const chars = [];
  lines.forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    words.forEach((word, wi) => {
      const w = document.createElement("span");
      w.className = "word";
      [...word].forEach((ch) => {
        const c = document.createElement("span");
        c.className = "char";
        c.textContent = ch;
        w.appendChild(c);
        chars.push(c);
      });
      line.appendChild(w);
      if (wi < words.length - 1) line.appendChild(document.createTextNode(" "));
    });
  });
  return {
    chars,
    restore() {
      // collapse spans back to plain text (keeps the live-translated copy intact)
      lines.forEach((l) => { l.textContent = l.textContent; l.removeAttribute("aria-hidden"); });
      h1.removeAttribute("aria-label");
    },
  };
}

/* ------------------------------------------------------- GSAP timeline */
function formatEuro(v) {
  return "+€" + v.toFixed(2).replace(".", ",");
}

function initTimeline() {
  const resultEl = document.getElementById("mock-result");
  const target = parseFloat(resultEl.dataset.target); // 24.15
  const split = splitHeadline();

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => split.restore(),
  });

  // headline: letter-by-letter rise out of the line masks
  tl.from(split.chars, { yPercent: 120, duration: 0.7, stagger: 0.04 })
    .from(".hero .eyebrow", { opacity: 0, y: 12, duration: 0.5 }, "-=0.9")
    .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.35")
    .from([".hero-ctas .btn", ".cta-note"], { opacity: 0, y: 18, duration: 0.55, stagger: 0.08 }, "-=0.3");

  // dashboard: 3D perspective tilt entrance
  tl.from("#hero-mock", {
    opacity: 0, y: 46, rotationY: -14, rotationX: 9,
    transformPerspective: 1000, duration: 1.1,
  }, "-=0.5");

  // the result: a reveal, not a ticker — counts up while resolving from blur
  const counter = { v: 0 };
  tl.fromTo(resultEl,
    { opacity: 0, scale: 1.14, filter: "blur(14px)" },
    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.3, ease: "power2.out" },
    "-=0.45");
  tl.to(counter, {
    v: target,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => { resultEl.textContent = formatEuro(counter.v); },
    onComplete: () => { resultEl.textContent = formatEuro(target); },
  }, "<");

  // rubriek rows tick in beneath the number
  tl.from("#mock-rows .mock-row", { opacity: 0, y: 10, duration: 0.4, stagger: 0.12 }, "-=0.9");

  // subtle parallax on the dashboard card while scrolling the hero
  gsap.to("#hero-mock", {
    y: -40,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });

  // the gradient behind the hero shifts as you scroll into the Pain section
  gsap.to(".hero-glow", {
    yPercent: 28,
    scale: 1.18,
    opacity: 0.55,
    filter: "hue-rotate(40deg)",
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom 20%", scrub: true },
  });
}

if (!reducedMotion) {
  initField();
  initTimeline();
}
