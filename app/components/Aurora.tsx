'use client';

import { useEffect, useRef } from 'react';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import './Aurora.css';

type AuroraProps = {
  colorStops?: [string, string, string];
  blend?: number;
  amplitude?: number;
  speed?: number;
  className?: string;
};

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m *= m;
  m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 rampColor = uv.x < 0.5
    ? mix(uColorStops[0], uColorStops[1], uv.x * 2.0)
    : mix(uColorStops[1], uColorStops[2], (uv.x - 0.5) * 2.0);
  float height = exp(snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude);
  float intensity = 0.6 * (uv.y * 2.0 - height + 0.2);
  float auroraAlpha = smoothstep(0.20 - uBlend * 0.5, 0.20 + uBlend * 0.5, intensity);
  fragColor = vec4(intensity * rampColor * auroraAlpha, auroraAlpha);
}
`;

const rgb = (hex: string) => {
  const color = new Color(hex);
  return [color.r, color.g, color.b];
};

export default function Aurora({
  colorStops = ['#2e8079', '#004b48', '#003232'],
  blend = 0.46,
  amplitude = 1,
  speed = 0.9,
  className = ''
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStops.map(rgb) },
        uResolution: { value: [1, 1] },
        uBlend: { value: blend }
      }
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(width)), Math.max(1, Math.floor(height)));
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      renderer.render({ scene: mesh });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    const draw = (now: number) => {
      frame = 0;
      if (lastTime) elapsed += (now - lastTime) * 0.001;
      lastTime = now;
      program.uniforms.uTime.value = elapsed * speed;
      renderer.render({ scene: mesh });
      if (!document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
    };
    const updateMotion = () => {
      if (document.hidden || motion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
        return;
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };
    document.addEventListener('visibilitychange', updateMotion);
    motion.addEventListener('change', updateMotion);
    updateMotion();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateMotion);
      motion.removeEventListener('change', updateMotion);
      canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, colorStops, speed]);

  return <div ref={containerRef} className={`aurora-container ${className}`.trim()} aria-hidden="true" />;
}
