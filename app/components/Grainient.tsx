'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

type GrainientProps = {
  color1?: string; color2?: string; color3?: string; timeSpeed?: number;
  warpStrength?: number; warpFrequency?: number; warpSpeed?: number;
  grainAmount?: number; grainScale?: number; contrast?: number;
  saturation?: number; zoom?: number; className?: string;
};

const toRgb = (hex: string) => {
  const value = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return value ? [parseInt(value[1], 16) / 255, parseInt(value[2], 16) / 255, parseInt(value[3], 16) / 255] : [1, 1, 1];
};

const vertex = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution; uniform float iTime; uniform float uTimeSpeed;
uniform float uWarpStrength; uniform float uWarpFrequency; uniform float uWarpSpeed;
uniform float uGrainAmount; uniform float uGrainScale; uniform float uContrast;
uniform float uSaturation; uniform float uZoom; uniform vec3 uColor1; uniform vec3 uColor2; uniform vec3 uColor3;
out vec4 fragColor;
mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution.xy-.5; uv.x*=iResolution.x/iResolution.y; uv/=max(uZoom,.001);
  float t=iTime*uTimeSpeed; float w=max(uWarpStrength,.001);
  uv+=vec2(sin(uv.y*uWarpFrequency+t*uWarpSpeed),cos(uv.x*uWarpFrequency*1.4+t*uWarpSpeed*.8))*.075*w;
  uv=rot(sin(t*.12)*.18)*uv;
  float a=smoothstep(-.58,.25,uv.x); float b=smoothstep(.62,-.34,uv.y+sin(uv.x*2.3+t*.3)*.1);
  vec3 col=mix(uColor3,uColor2,a); col=mix(col,uColor1,b);
  float grain=noise(floor(gl_FragCoord.xy/max(uGrainScale,.1))+t*.04)-.5;
  col+=(grain*uGrainAmount); col=(col-.5)*uContrast+.5;
  float l=dot(col,vec3(.2126,.7152,.0722)); col=mix(vec3(l),col,uSaturation);
  fragColor=vec4(clamp(col,0.,1.),1.);
}`;

export default function Grainient({
  color1='#121d4b', color2='#571d57', color3='#05060d', timeSpeed=.18,
  warpStrength=.7, warpFrequency=3.8, warpSpeed=.7, grainAmount=.08,
  grainScale=1.5, contrast=1.35, saturation=.85, zoom=1, className=''
}: GrainientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iResolution:{ value:new Float32Array([1,1]) }, iTime:{ value:0 }, uTimeSpeed:{ value:timeSpeed },
      uWarpStrength:{ value:warpStrength }, uWarpFrequency:{ value:warpFrequency }, uWarpSpeed:{ value:warpSpeed },
      uGrainAmount:{ value:grainAmount }, uGrainScale:{ value:grainScale }, uContrast:{ value:contrast },
      uSaturation:{ value:saturation }, uZoom:{ value:zoom }, uColor1:{ value:new Float32Array(toRgb(color1)) },
      uColor2:{ value:new Float32Array(toRgb(color2)) }, uColor3:{ value:new Float32Array(toRgb(color3)) }
    }});
    const mesh = new Mesh(gl, { geometry:new Triangle(gl), program });
    const canvas = gl.canvas; canvas.className = 'grainient-canvas'; container.appendChild(canvas);
    const resize = () => { const rect=container.getBoundingClientRect(); renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height)); program.uniforms.iResolution.value.set([gl.drawingBufferWidth,gl.drawingBufferHeight]); };
    const observer = new ResizeObserver(resize); observer.observe(container); resize();
    let visible = true; let frame = 0; const started = performance.now();
    const intersection = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; }, { threshold:0 }); intersection.observe(container);
    const draw = (now: number) => { if (visible && !document.hidden) { program.uniforms.iTime.value=(now-started)/1000; renderer.render({ scene:mesh }); } frame=requestAnimationFrame(draw); };
    frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); canvas.remove(); };
  }, [color1,color2,color3,timeSpeed,warpStrength,warpFrequency,warpSpeed,grainAmount,grainScale,contrast,saturation,zoom]);

  return <div ref={ref} className={`grainient-container ${className}`.trim()} />;
}
