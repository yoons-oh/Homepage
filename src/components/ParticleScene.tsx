import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { SHAPES } from '../lib/shapes'

type Props = {
  active: boolean
  reducedMotion: boolean
  narrow: boolean
  /** index the user asked for (changes trigger a morph) */
  requested: { index: number; nonce: number }
  onShape: (index: number) => void
}

const HOLD = 3.4 // seconds a shape stays formed
const MORPH = 1.9 // seconds a morph takes

/* ---------- shape sampling ---------- */

const rand = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** draw a 2D silhouette, then sample `count` points from it; `depth` gives each point a z */
function sampleCanvas(
  count: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  depth: (x: number, y: number, r: () => number) => number,
  seed: number,
) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  draw(ctx)
  const data = ctx.getImageData(0, 0, size, size).data
  const pixels: number[] = []
  for (let i = 0; i < size * size; i++) if (data[i * 4 + 3] > 128) pixels.push(i)
  const r = rand(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const p = pixels[Math.floor(r() * pixels.length)] ?? 0
    const x = ((p % size) + r() - 0.5) / size - 0.5
    const y = 0.5 - (Math.floor(p / size) + r() - 0.5) / size
    out[i * 3] = x * 4.8
    out[i * 3 + 1] = y * 4.8
    out[i * 3 + 2] = depth(x, y, r)
  }
  return out
}

function buildShapes(count: number) {
  const identity = sampleCanvas(
    count,
    (ctx) => {
      ctx.font = '900 250px "Arial Black", Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Y', 128, 140)
    },
    (_x, _y, r) => (r() - 0.5) * 0.7,
    11,
  )

  // AI core: a sphere shell with an orbit ring
  const r = rand(23)
  const think = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const shell = Math.floor(count * 0.72)
  for (let i = 0; i < count; i++) {
    if (i < shell) {
      const y = 1 - (i / (shell - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = golden * i
      const rr = 1.75 + (r() - 0.5) * 0.08
      think[i * 3] = Math.cos(theta) * radius * rr
      think[i * 3 + 1] = y * rr
      think[i * 3 + 2] = Math.sin(theta) * radius * rr
    } else {
      const a = r() * Math.PI * 2
      const rr = 2.3 + (r() - 0.5) * 0.1
      const x = Math.cos(a) * rr
      const z = Math.sin(a) * rr
      // tilt the ring
      think[i * 3] = x
      think[i * 3 + 1] = z * 0.32 + (r() - 0.5) * 0.04
      think[i * 3 + 2] = z * 0.95
    }
  }

  const apps = sampleCanvas(
    count,
    (ctx) => {
      ctx.lineWidth = 9
      ctx.beginPath()
      ctx.roundRect(74, 14, 108, 228, 22)
      ctx.stroke()
      ctx.fillRect(110, 26, 36, 7)
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
          ctx.beginPath()
          ctx.roundRect(90 + col * 27, 52 + row * 34, 20, 20, 6)
          ctx.fill()
        }
      }
      ctx.beginPath()
      ctx.roundRect(98, 202, 60, 18, 9)
      ctx.fill()
    },
    (_x, _y, rr) => (rr() - 0.5) * 0.25,
    37,
  )

  const video = sampleCanvas(
    count,
    (ctx) => {
      ctx.lineWidth = 11
      ctx.beginPath()
      ctx.roundRect(22, 56, 212, 144, 30)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(108, 94)
      ctx.lineTo(108, 162)
      ctx.lineTo(166, 128)
      ctx.closePath()
      ctx.fill()
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(40, 222)
      ctx.lineTo(216, 222)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(120, 222, 9, 0, Math.PI * 2)
      ctx.fill()
    },
    (_x, _y, rr) => (rr() - 0.5) * 0.3,
    51,
  )

  const write = sampleCanvas(
    count,
    (ctx) => {
      ctx.lineWidth = 8
      for (const side of [-1, 1]) {
        ctx.beginPath()
        ctx.moveTo(128, 82)
        ctx.quadraticCurveTo(128 + side * 50, 58, 128 + side * 104, 70)
        ctx.lineTo(128 + side * 104, 196)
        ctx.quadraticCurveTo(128 + side * 50, 184, 128, 208)
        ctx.closePath()
        ctx.stroke()
        ctx.lineWidth = 5
        for (let line = 0; line < 5; line++) {
          const y = 100 + line * 18
          ctx.beginPath()
          ctx.moveTo(128 + side * 18, y + 4)
          ctx.quadraticCurveTo(128 + side * 50, y - 6, 128 + side * 86, y)
          ctx.stroke()
        }
        ctx.lineWidth = 8
      }
    },
    // pages curl up towards the reader
    (x, _y, rr) => Math.abs(x) * 1.6 - 0.4 + (rr() - 0.5) * 0.12,
    67,
  )

  return [identity, think, apps, video, write]
}

/* ---------- shader ---------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uPointerStrength;
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = clamp((uMorph - aSeed * 0.45) / 0.55, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aFrom, aTo, t);

    // particles scatter outward mid-flight, like data being re-assembled
    float burst = sin(t * 3.14159);
    vec3 dir = normalize(vec3(sin(aSeed * 91.3), cos(aSeed * 47.7), sin(aSeed * 13.1 + 1.7)) + 1e-4);
    p += dir * burst * (0.9 + aSeed * 1.4);

    // idle shimmer
    p += 0.025 * vec3(
      sin(uTime * 1.3 + aSeed * 40.0),
      cos(uTime * 1.1 + aSeed * 57.0),
      sin(uTime * 0.9 + aSeed * 23.0)
    );

    vec4 world = modelMatrix * vec4(p, 1.0);

    // pointer pushes particles away
    vec2 d = world.xy - uPointer.xy;
    float dist = length(d);
    float push = smoothstep(1.3, 0.0, dist) * uPointerStrength;
    world.xy += normalize(d + 1e-4) * push * 0.75;
    world.z += push * 0.6;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) / -mv.z;

    // cool spectrum: cyan -> electric blue -> violet, drifting over time
    vec3 c1 = vec3(0.24, 0.91, 1.0);
    vec3 c2 = vec3(0.31, 0.45, 1.0);
    vec3 c3 = vec3(0.66, 0.38, 1.0);
    float k = fract(aSeed * 2.7 + p.y * 0.12 + uTime * 0.04);
    vec3 color = mix(mix(c1, c2, smoothstep(0.0, 0.5, k)), c3, smoothstep(0.5, 1.0, k));
    float sparkle = step(0.985, fract(aSeed * 113.0 + uTime * 0.35)) * 2.5;
    vColor = color * (0.72 + burst * 1.5 + push * 2.0 + sparkle);
    vAlpha = 0.75 + aSeed * 0.25;
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    gl_FragColor = vec4(vColor * a, a * vAlpha);
  }
`

function Particles({ reducedMotion, narrow, requested, onShape }: Omit<Props, 'active'>) {
  const points = useRef<THREE.Points>(null)
  const group = useRef<THREE.Group>(null)
  const { camera, viewport, gl } = useThree()
  const count = narrow ? 9000 : 22000
  const shapes = useMemo(() => buildShapes(count), [count])
  const state = useRef({ current: 0, next: 0, morph: 0, hold: 0, queued: -1, lastMove: 0 })
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const r = rand(5)
    const from = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // start as a wide cloud that assembles into the first shape
      const a = r() * Math.PI * 2
      const b = Math.acos(2 * r() - 1)
      const rr = 5 + r() * 6
      from[i * 3] = Math.sin(b) * Math.cos(a) * rr
      from[i * 3 + 1] = Math.sin(b) * Math.sin(a) * rr
      from[i * 3 + 2] = Math.cos(b) * rr
      seeds[i] = r()
    }
    g.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3))
    g.setAttribute('aFrom', new THREE.BufferAttribute(from, 3))
    g.setAttribute('aTo', new THREE.BufferAttribute(shapes[0].slice(), 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uSize: { value: narrow ? 46 : 58 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
        uPointer: { value: new THREE.Vector3(99, 99, 0) },
        uPointerStrength: { value: 0 },
      },
    })
    return { geometry: g, material: m }
  }, [count, shapes, narrow, gl])

  useEffect(() => {
    const onMove = () => {
      state.current.lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (requested.nonce > 0) state.current.queued = requested.index
  }, [requested])

  const startMorph = (to: number) => {
    const s = state.current
    const aFrom = geometry.getAttribute('aFrom') as THREE.BufferAttribute
    const aTo = geometry.getAttribute('aTo') as THREE.BufferAttribute
    ;(aFrom.array as Float32Array).set(shapes[s.current])
    ;(aTo.array as Float32Array).set(shapes[to])
    aFrom.needsUpdate = true
    aTo.needsUpdate = true
    s.next = to
    s.morph = 0
    s.hold = 0
    onShape(to)
  }

  useFrame((frame, delta) => {
    const s = state.current
    const u = material.uniforms
    u.uTime.value += delta

    if (s.morph < 1) {
      s.morph = Math.min(1, s.morph + delta / MORPH)
      if (s.morph >= 1) s.current = s.next
    } else {
      s.hold += delta
      const wanted = s.queued >= 0 && s.queued !== s.current ? s.queued : -1
      if (wanted >= 0) {
        s.queued = -1
        startMorph(wanted)
      } else if (!reducedMotion && s.hold > HOLD) {
        startMorph((s.current + 1) % SHAPES.length)
      }
    }
    u.uMorph.value = s.morph

    // pointer in world space on the z=0 plane
    raycaster.setFromCamera(frame.pointer, camera)
    if (raycaster.ray.intersectPlane(plane, hit)) u.uPointer.value.copy(hit)
    const pointerActive = performance.now() - s.lastMove < 1800
    u.uPointerStrength.value = THREE.MathUtils.damp(u.uPointerStrength.value, pointerActive ? 1 : 0, 4, delta)

    if (group.current) {
      const spin = reducedMotion ? 0 : Math.sin(u.uTime.value * 0.25) * 0.45
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, spin + frame.pointer.x * 0.35, 2.5, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -frame.pointer.y * 0.2, 2.5, delta)
      const scale = narrow ? THREE.MathUtils.clamp(viewport.width / 6.6, 0.45, 0.8) : THREE.MathUtils.clamp(viewport.height / 7.4, 0.75, 1.05)
      group.current.scale.setScalar(scale)
      group.current.position.set(narrow ? 0 : viewport.width * 0.08, narrow ? viewport.height * 0.2 : viewport.height * 0.06, 0)
    }
  })

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} />
    </group>
  )
}

function Dust({ narrow }: { narrow: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const n = narrow ? 300 : 700
    const r = rand(99)
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (r() - 0.5) * 30
      arr[i * 3 + 1] = (r() - 0.5) * 18
      arr[i * 3 + 2] = -r() * 12
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [narrow])
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.004
  })
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.035} color="#8fa2ff" transparent opacity={0.45} depthWrite={false} />
    </points>
  )
}

export default function ParticleScene({ active, ...props }: Props) {
  return (
    <Canvas
      className="px-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 38 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#04050c']} />
      <Dust narrow={props.narrow} />
      <Particles {...props} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.35} luminanceSmoothing={0.25} intensity={1.25} radius={0.7} />
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  )
}
