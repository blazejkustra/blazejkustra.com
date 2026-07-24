"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// GLSL port of the BirthdayFireworks WGSL shader from react-native-effects
// (example/src/components/BirthdayFireworks.tsx). Extra here: u_click spawns
// a burst at the cursor.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
// Ring buffer of cursor bursts: x, y in [0,1] (y up), z = launch time (-1 = empty)
uniform vec3 u_clicks[8];
// Text column rect in uv space (x0, x1, y0, y1) — sparks dim behind it.
uniform vec4 u_text;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Vivid party palette: lime, violet, hot pink, gold, cyan, silver.
vec3 pal(float r) {
  int idx = int(r * 5.999);
  if (idx == 0) return vec3(0.55, 0.95, 0.35);
  if (idx == 1) return vec3(0.72, 0.42, 1.00);
  if (idx == 2) return vec3(1.00, 0.40, 0.65);
  if (idx == 3) return vec3(1.00, 0.80, 0.30);
  if (idx == 4) return vec3(0.40, 0.85, 1.00);
  return vec3(0.88, 0.88, 0.95);
}

// One expanding glitter shell: polar-gridded twinkling stars, rim-heavy,
// with an ignition flash and gravity droop.
vec3 burst(vec2 p, vec2 center, float prog, vec2 seed, float fi, float gen, float t) {
  vec3 acc = vec3(0.0);
  float ease = 1.0 - pow(1.0 - prog, 4.5);
  float maxR = 0.36 + 0.34 * hash21(seed + 3.3);
  float radius = maxR * (0.10 + 0.90 * ease);
  float fade = smoothstep(1.0, 0.5, prog);

  vec2 rel = p - center;
  float d = length(rel);

  float flash = exp(-d * d / (maxR * maxR * 0.012)) * smoothstep(0.14, 0.0, prog);
  acc += vec3(1.0, 0.97, 0.9) * flash * 0.6;

  if (d > radius * 1.05) return acc;

  const float SPOKES = 56.0;
  const float LAYERS = 11.0;
  float a01 = fract(atan(rel.y, rel.x) * 0.15915494 + 1.0);
  float q = d / max(radius, 1e-4);

  float cellA = floor(a01 * SPOKES);
  float cellQ = floor(q * LAYERS);
  vec2 cellId = vec2(cellA + fi * 61.0, cellQ + gen * 13.0);
  float rnd = hash21(cellId);

  float qc = (cellQ + 0.5) / LAYERS;
  float exists = step(rnd, 0.12 + 0.88 * smoothstep(0.35, 0.95, qc));

  if (exists > 0.5) {
    float ja = (hash21(cellId + 5.5) - 0.5) * 0.8;
    float jq = (hash21(cellId + 8.8) - 0.5) * 0.8;
    float starAng = ((cellA + 0.5 + ja) / SPOKES) * 6.2831853;
    float starQ = (cellQ + 0.5 + jq) / LAYERS;
    vec2 starPos = center + vec2(cos(starAng), sin(starAng)) * starQ * radius;
    starPos.y -= prog * prog * 0.07 * (0.5 + rnd);

    vec2 toStar = p - starPos;
    float size = 16000.0 + 26000.0 * hash21(cellId + 2.7);
    float spark = exp(-dot(toStar, toStar) * size);

    float rnd2 = hash21(cellId + 47.0);
    float twinkle = 0.2 + 0.8 *
      pow(0.5 + 0.5 * sin(t * (3.0 + 6.0 * rnd2) + rnd2 * 40.0), 3.0);

    vec3 sparkCol = rnd2 > 0.72 ? pal(hash21(seed + 6.6)) : pal(hash21(seed + 4.4));
    sparkCol = mix(sparkCol, vec3(1.0), step(0.95, rnd2) * 0.7);

    float rimBoost = 0.45 + 0.85 * smoothstep(0.4, 1.0, starQ);
    acc += sparkCol * spark * twinkle * fade * rimBoost * 2.4;
  }
  return acc;
}

void main() {
  float t = u_time;
  // Zoom the coordinate space instead of touching burst parameters:
  // every shell keeps the original proportions, at half the size.
  float zoom = 2.6;
  float aspect = u_res.x / u_res.y * zoom;
  vec2 uv = gl_FragCoord.xy / u_res;
  // x in [0, aspect], y in [0, zoom] — square units so bursts stay round.
  vec2 p = vec2(uv.x * aspect, uv.y * zoom);

  // Transparent canvas — only the sparks emit light.
  vec3 col = vec3(0.0);

  // Six launchers on offset clocks.
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float period = (2.9 + 1.7 * fract(fi * 0.6180339)) * 1.5;
    float clock = t / period + fract(fi * 0.7548776);
    float prog = fract(clock);
    float gen = floor(clock);

    vec2 seed = vec2(gen * 1.93 + fi * 17.0, fi * 7.31 - gen * 0.71);

    // Most cycles stay dark — calmer than the original card.
    if (hash21(seed + 9.9) > 0.35) continue;

    // Anywhere across the width (side clipping looks natural), but the
    // whole shell stays above the canvas bottom edge.
    float mR = 0.36 + 0.34 * hash21(seed + 3.3);
    vec2 center = vec2(
      hash21(seed + 1.1) * aspect,
      max(mix(0.10, 0.90, hash21(seed + 2.2)) * zoom, mR * 1.1)
    );
    col += burst(p, center, prog, seed, fi, gen, t);
  }

  // Cursor bursts: every recent click gets its own launcher; old bursts
  // keep playing out while new ones ignite.
  for (int i = 0; i < 8; i++) {
    vec3 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float cprog = (t - c.z) / 1.6;
    if (cprog < 0.0 || cprog >= 1.0) continue;
    float gen = floor(c.z * 7.3) + float(i) * 5.0;
    vec2 seed = vec2(gen * 3.17 + 99.0, 51.0 - gen * 1.3);
    float mR = 0.36 + 0.34 * hash21(seed + 3.3);
    vec2 center = vec2(c.x * aspect, max(c.y * zoom, mR * 1.1));
    col += burst(p, center, cprog, seed, 7.0 + float(i), gen, t);
  }

  // Dim sparks behind the text column so the bio stays readable.
  float e = 0.03;
  float inX = smoothstep(u_text.x - e, u_text.x + e, uv.x) *
    (1.0 - smoothstep(u_text.y - e, u_text.y + e, uv.x));
  float inY = smoothstep(u_text.z - e, u_text.z + e, uv.y) *
    (1.0 - smoothstep(u_text.w - e, u_text.w + e, uv.y));
  col *= 1.0 - 0.7 * inX * inY;

  // Gentle ceiling so nearby text always wins.
  col = col / (1.0 + col * 0.45);
  col = clamp(col, 0.0, 1.0);
  // Premultiplied alpha: brightness is the coverage.
  float a = max(col.r, max(col.g, col.b));
  gl_FragColor = vec4(col, a);
}
`;

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile failed: ${info}`);
    }
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

const MAX_CLICKS = 8;

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clicks = useRef<{ data: Float32Array; next: number } | null>(null);

  useEffect(() => {
    if (!clicks.current) {
      const data = new Float32Array(MAX_CLICKS * 3);
      for (let i = 0; i < MAX_CLICKS; i++) data[i * 3 + 2] = -1;
      clicks.current = { data, next: 0 };
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      alpha: true,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      program = createProgram(gl);
    } catch (e) {
      console.error(e);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uClicks =
      gl.getUniformLocation(program, "u_clicks") ??
      gl.getUniformLocation(program, "u_clicks[0]");
    const uText = gl.getUniformLocation(program, "u_text");

    // uv rect of the hero text (the section's flow content) — the canvas is
    // an absolutely positioned sibling, so the section rect IS the text.
    const textRect = new Float32Array([9, 9, 9, 9]); // offscreen = no dimming
    const measureText = () => {
      const section = canvas.closest("section");
      if (!section) return;
      const sr = section.getBoundingClientRect();
      const cr = canvas.getBoundingClientRect();
      if (cr.width === 0 || cr.height === 0) return;
      textRect[0] = (sr.left - cr.left) / cr.width;
      textRect[1] = (sr.right - cr.left) / cr.width;
      textRect[2] = 1 - (sr.bottom - cr.top) / cr.height;
      textRect[3] = 1 - (sr.top - cr.top) / cr.height;
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      measureText();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const state = clicks.current!;
      const i = state.next * 3;
      state.data[i] = (e.clientX - rect.left) / rect.width;
      state.data[i + 1] = 1 - (e.clientY - rect.top) / rect.height;
      state.data[i + 2] = now();
      state.next = (state.next + 1) % MAX_CLICKS;
    };
    canvas.addEventListener("pointerdown", onPointerDown);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;
    const frame = () => {
      const t = reduceMotion ? 0 : now();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform3fv(uClicks, clicks.current!.data);
      gl.uniform4fv(uText, textRect);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-label="Fireworks shader — click to launch a burst"
    />
  );
}
