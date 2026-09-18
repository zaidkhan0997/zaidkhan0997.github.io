import React, { useEffect, useRef } from 'react';

export interface InteractiveNeuralVortexProps {
  children?: React.ReactNode;
  className?: string;
}

export const InteractiveNeuralVortex: React.FC<InteractiveNeuralVortexProps> = ({
  children,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    // Initialize pointer to center of viewport
    pointer.current = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      tX: window.innerWidth * 0.5,
      tY: window.innerHeight * 0.5,
    };

    // Initialize WebGL context with optimal settings for speed & smooth alpha
    const gl = (canvasEl.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
    }) ||
      canvasEl.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Shader sources with highp float precision support to prevent float truncation
    const vsSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }
      
      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = u_time;
        vec3 color = vec3(0.5, 0.15, 0.65);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        color = mix(color, vec3(0.02, 0.7, 0.9), 0.48);
        color += vec3(0.15, 0.0, 0.6);
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    // Shader compilation
    const compileShader = (
      glContext: WebGLRenderingContext,
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Program setup
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Geometry
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRatio = gl.getUniformLocation(program, 'u_ratio');
    const uPointerPosition = gl.getUniformLocation(program, 'u_pointer_position');
    const uScrollProgress = gl.getUniformLocation(program, 'u_scroll_progress');

    // Resize handler (capped at 1.5x DPR for silky 60+ FPS on all displays)
    const resizeCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = Math.floor(w * devicePixelRatio);
      canvasEl.height = Math.floor(h * devicePixelRatio);
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      if (uRatio) {
        gl.uniform1f(uRatio, canvasEl.width / (canvasEl.height || 1));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const startTime = performance.now();
    // Wrap time at 200*PI (~628.32s = 10.47min).
    // Because neuro_shape is strictly 2*PI periodic, wrapping at an exact multiple of 2*PI
    // is mathematically continuous and seamless, preventing floating point overflow/freezing forever.
    const TIME_CYCLE = Math.PI * 200.0;

    const render = () => {
      if (gl.isContextLost()) return;

      const currentTime = performance.now();
      const elapsedSec = ((currentTime - startTime) * 0.001) % TIME_CYCLE;

      // Smooth pointer movement
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;

      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const scrollY = window.pageYOffset || window.scrollY || 0;

      if (uTime) gl.uniform1f(uTime, elapsedSec);
      if (uPointerPosition) {
        gl.uniform2f(
          uPointerPosition,
          pointer.current.x / w,
          1 - pointer.current.y / h
        );
      }
      if (uScrollProgress) {
        gl.uniform1f(uScrollProgress, scrollY / (2 * h));
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Event listeners
    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        pointer.current.tX = e.touches[0].clientX;
        pointer.current.tY = e.touches[0].clientY;
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  return (
    <div
      className={`relative min-h-screen w-full bg-[#02040a] overflow-x-hidden text-white ${className}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #050a1c 0%, #02040a 60%, #010206 100%)',
      }}
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        id="neuro"
        className="fixed inset-0 w-full h-full pointer-events-none opacity-95 z-0"
      />

      {/* Content Layer */}
      {children && <div className="relative z-10 w-full">{children}</div>}
    </div>
  );
};

export default InteractiveNeuralVortex;
