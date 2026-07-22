'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const vertxShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fluidShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec4 iMouse;
      uniform float iFrame;
      uniform sampler2D iPreviousFrame;
      uniform float uBrushSize;
      uniform float uBrushStrength;
      uniform float uFluidDecay;
      uniform float uTrailLength;
      uniform float uStopDecay;
      varying vec2 vUv;

      vec2 ur, U;

      float ln(vec2 p, vec2 a, vec2 b) {
        return length(p - a - (b - a) * clamp(dot(p - a, b - a) / dot(b - a, b - a), 0.0, 1.0));
      }

      vec4 t(vec2 v, int a, int b) {
        return texture2D(iPreviousFrame, fract((v + vec2(float(a), float(b))) / ur));
      }

      vec4 t(vec2 v) {
        return texture2D(iPreviousFrame, fract(v / ur));
      }

      float area(vec2 a, vec2 b, vec2 c) {
        float A = length(b - c), B = length(c - a), C = length(a - b), s = (A + B + C) * 0.5;
        return sqrt(max(0.0, s * (s - A) * (s - B) * (s - C)));
      }

      void main() {
        U = vUv * iResolution;
        ur = iResolution.xy;
        
        if (iFrame < 1.0) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
          vec2 v = U;
          vec2 A = v + vec2(1.0, 1.0);
          vec2 B = v + vec2(1.0, -1.0);
          vec2 C = v + vec2(-1.0, 1.0);
          vec2 D = v + vec2(-1.0, -1.0);

          for (int i = 0; i < 8; i++) {
            v -= t(v).xy;
            A -= t(A).xy;
            B -= t(B).xy;
            C -= t(C).xy;
            D -= t(D).xy;
          }
          
          vec4 me = t(v);
          vec4 n = t(v, 0, 1);
          vec4 e = t(v, 1, 0);
          vec4 s = t(v, 0, -1);
          vec4 w = t(v, -1, 0);
          vec4 ne = 0.25 * (n + e + s + w);
          me = mix(t(v), ne, vec4(0.15, 0.15, 0.95, 0.0));
          me.z = me.z - 0.01 * ((area(A, B, C) + area(B, C, D)) - 4.0);
          vec4 pr = vec4(e.z, w.z, n.z, s.z);
          me.xy = me.xy + 100.0 * vec2(pr.x - pr.y, pr.z - pr.w) / ur;
          me.xy *= uFluidDecay;
          me.z *= uTrailLength;
          
          if (iMouse.z > 0.0) {
            vec2 mousePos = iMouse.xy;
            vec2 mousePrev = iMouse.zw;
            vec2 mouseVel = mousePos - mousePrev;
            float velMagnitude = length(mouseVel);
            float q = ln(U, mousePos, mousePrev);
            vec2 m = mousePos - mousePrev;
            float l = length(m);
            if (l > 0.0) m = min(l, 10.0) * m / l;
            float brushSizeFactor = 1e-4 / uBrushSize;
            float strengthFactor = 0.03 * uBrushStrength;
            float falloff = exp(-brushSizeFactor * q * q * q);
            falloff = pow(falloff, 0.5);
            me.xyw += strengthFactor * falloff * vec3(m, 10.0);
            
            if (velMagnitude < 2.0) {
              float distToCursor = length(U - mousePos);
              float influence = exp(-distToCursor * 0.1);
              float cursorDecay = mix(1.0, uStopDecay, influence);
              me.xy *= cursorDecay;
              me.z *= cursorDecay;
            }
          }
          gl_FragColor = clamp(me, -0.4, 0.4);
        }
      }
    `;

    const displayShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      uniform sampler2D iFluid;
      uniform float uDistortionAmount;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform float uColorIntensity;
      uniform float uSoftness;
      varying vec2 vUv;

      void main() {
        vec2 fragCoord = vUv * iResolution;
        vec4 fluid = texture2D(iFluid, vUv);
        vec2 fluidVel = fluid.xy;
        float mr = min(iResolution.x, iResolution.y);
        vec2 uv = (fragCoord * 2.0 - iResolution.xy) / mr;
        uv += fluidVel * (0.5 * uDistortionAmount);
        
        float d = -iTime * 0.5;
        float a = 0.0;
        for (float i = 0.0; i < 8.0; i++) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += iTime * 0.5;
        
        float mixer1 = cos(uv.x * d) * 0.5 + 0.5;
        float mixer2 = cos(uv.y * a) * 0.5 + 0.5;
        float mixer3 = cos(d + a) * 0.5 + 0.5;
        
        float smoothAmount = clamp(uSoftness, 0.1, 0.9);
        mixer1 = mix(mixer1, 0.5, smoothAmount);
        mixer2 = mix(mixer2, 0.5, smoothAmount);
        mixer3 = mix(mixer3, 0.5, smoothAmount);
        
        vec3 col = mix(uColor1, uColor2, mixer1);
        col = mix(col, uColor3, mixer2);
        col = mix(col, uColor4, mixer3 * 0.4);
        col *= uColorIntensity;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const config = {
      brushSize: 15.0,
      brushStrength: 1.5,
      distortionAmount: 4.5,
      fluidDecay: 0.96,
      trailLength: 0.92,
      stopDecay: 0.75,
      color1: '#b8fff7',
      color2: '#6e3466',
      color3: '#0133ff',
      color4: '#66d1fe',
      colorIntensity: 1.3,
      softness: 0.3,
    };

    const hexToRgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    };

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const fluidTarget1 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    const fluidTarget2 = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: config.brushSize },
        uBrushStrength: { value: config.brushStrength },
        uFluidDecay: { value: config.fluidDecay },
        uTrailLength: { value: config.trailLength },
        uStopDecay: { value: config.stopDecay },
      },
      vertexShader: vertxShader,
      fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iFluid: { value: null },
        uDistortionAmount: { value: config.distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgb(config.color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgb(config.color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgb(config.color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgb(config.color4)) },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
      },
      vertexShader: vertxShader,
      fragmentShader: displayShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidScene = new THREE.Scene();
    const displayScene = new THREE.Scene();
    const fluidQuad = new THREE.Mesh(geometry, fluidMaterial);
    const displayQuad = new THREE.Mesh(geometry, displayMaterial);
    fluidScene.add(fluidQuad);
    displayScene.add(displayQuad);

    let mouseX = 0,
      mouseY = 0;
    let prevMouseX = 0,
      prevMouseY = 0;
    let lastMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX - rect.left;
      mouseY = rect.height - (e.clientY - rect.top);
      lastMoveTime = performance.now();
      fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
    };

    const handleMouseLeave = () => {
      fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = touch.clientX - rect.left;
      mouseY = rect.height - (touch.clientY - rect.top);
      lastMoveTime = performance.now();
      fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      fluidMaterial.uniforms.iTime.value = time;
      fluidMaterial.uniforms.iFrame.value = frameCount;
      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;

      if (performance.now() - lastMoveTime > 100) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
      }

      // Render fluid simulation
      renderer.setRenderTarget(currentFluidTarget);
      renderer.render(fluidScene, camera);

      // Render display
      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
      displayMaterial.uniforms.iTime.value = time;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, camera);

      // Swap targets
      const temp = currentFluidTarget;
      currentFluidTarget = previousFluidTarget;
      previousFluidTarget = temp;
      frameCount++;
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      fluidMaterial.uniforms.iResolution.value.set(width, height);
      displayMaterial.uniforms.iResolution.value.set(width, height);
      fluidTarget1.setSize(width, height);
      fluidTarget2.setSize(width, height);
      frameCount = 0;
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      fluidTarget1.dispose();
      fluidTarget2.dispose();
      geometry.dispose();
      fluidMaterial.dispose();
      displayMaterial.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default FluidAnimation;