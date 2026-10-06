import * as THREE from 'three';

/**
 * Процедурные текстуры: рисуем на canvas, без внешних файлов.
 * Каждая создаётся один раз и переиспользуется всеми экземплярами.
 */

/** Детерминированный хеш: один и тот же рисунок при каждой загрузке. */
function hash2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Значенческий шум: плавная интерполяция по решётке. */
function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = smooth(xf);
  const v = smooth(yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

/** Сумма октав: даёт «природную» неровность. */
export function fbm(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return sum;
}

function makeCanvas(size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return { canvas, ctx: canvas.getContext('2d')! };
}

function finish(canvas: HTMLCanvasElement, repeat = 1): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

let marbleCache: THREE.CanvasTexture | null = null;

/**
 * Мраморный нефрит: шум плюс тонкие светлые прожилки.
 * Прожилки получаются из синуса, сбитого шумом (классический «мрамор»).
 */
export function marbleTexture(): THREE.CanvasTexture {
  if (marbleCache) return marbleCache;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const img = ctx.createImageData(size, size);
  const base = new THREE.Color('#8FC9A4');
  const light = new THREE.Color('#BFE3CF');
  const vein = new THREE.Color('#EAF6EE');
  const c = new THREE.Color();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 4;
      const ny = (y / size) * 4;
      const turbulence = fbm(nx, ny, 4);
      // Пятна нефрита
      c.copy(base).lerp(light, turbulence);
      // Прожилки: узкие светлые полосы
      const marble = Math.abs(Math.sin((nx + turbulence * 2.6) * Math.PI));
      const veinStrength = Math.pow(1 - marble, 14);
      c.lerp(vein, veinStrength * 0.85);

      const i = (y * size + x) * 4;
      img.data[i] = c.r * 255;
      img.data[i + 1] = c.g * 255;
      img.data[i + 2] = c.b * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  marbleCache = finish(canvas);
  return marbleCache;
}

let moxaCache: { map: THREE.CanvasTexture; rough: THREE.CanvasTexture } | null =
  null;

/**
 * Полынь: волокнистая поверхность. Шум вытянут вдоль стика,
 * поэтому волокна читаются как скрутка сухой травы.
 */
export function moxaTextures() {
  if (moxaCache) return moxaCache;
  const size = 256;
  const colorCanvas = makeCanvas(size);
  const roughCanvas = makeCanvas(size);
  const colorImg = colorCanvas.ctx.createImageData(size, size);
  const roughImg = roughCanvas.ctx.createImageData(size, size);

  const base = new THREE.Color('#CFCCA6');
  const dark = new THREE.Color('#9FAD80');
  const c = new THREE.Color();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Растянуто по одной оси: получаются продольные волокна
      const n = fbm((x / size) * 26, (y / size) * 2.5, 4);
      const fiber = fbm((x / size) * 60, (y / size) * 1.2, 2);
      const t = Math.min(1, Math.max(0, n * 0.75 + fiber * 0.45));
      c.copy(dark).lerp(base, t);

      const i = (y * size + x) * 4;
      colorImg.data[i] = c.r * 255;
      colorImg.data[i + 1] = c.g * 255;
      colorImg.data[i + 2] = c.b * 255;
      colorImg.data[i + 3] = 255;

      // Шероховатость: там, где волокна плотнее, поверхность матовее
      const r = 190 + t * 60;
      roughImg.data[i] = r;
      roughImg.data[i + 1] = r;
      roughImg.data[i + 2] = r;
      roughImg.data[i + 3] = 255;
    }
  }
  colorCanvas.ctx.putImageData(colorImg, 0, 0);
  roughCanvas.ctx.putImageData(roughImg, 0, 0);

  const map = finish(colorCanvas.canvas);
  const rough = new THREE.CanvasTexture(roughCanvas.canvas);
  rough.wrapS = THREE.RepeatWrapping;
  rough.wrapT = THREE.RepeatWrapping;

  moxaCache = { map, rough };
  return moxaCache;
}

let smokeCache: THREE.CanvasTexture | null = null;

/**
 * Мягкое пятно для частиц дыма.
 *
 * Спад считаем по гауссу попиксельно, а не через градиент с несколькими
 * стопами: на большом масштабе стопы читались видимыми кольцами. Лёгкий
 * шум сбивает идеальную окружность, чтобы клубы не выглядели шариками.
 */
export function smokeTexture(): THREE.CanvasTexture {
  if (smokeCache) return smokeCache;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const img = ctx.createImageData(size, size);
  const half = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - half) / half;
      const dy = (y - half) / half;
      const r = Math.sqrt(dx * dx + dy * dy);
      // Неровная кромка: клуб дыма, а не круг
      const wobble = 0.82 + fbm(dx * 2.2 + 11, dy * 2.2 + 7, 3) * 0.42;
      const falloff = Math.exp(-Math.pow(r / wobble, 2) * 3.4);
      const alpha = r > 1 ? 0 : falloff;

      const i = (y * size + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = Math.max(0, Math.min(255, alpha * 255));
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  smokeCache = tex;
  return smokeCache;
}

/** Смещение вершин шумом: превращает сферу в речную гальку. */
export function displaceGeometry(
  geometry: THREE.BufferGeometry,
  amplitude: number,
  seed = 0,
) {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      fbm(v.x * 1.6 + seed, v.y * 1.6 + v.z * 1.1 + seed, 3) - 0.5;
    const scale = 1 + n * amplitude * 2;
    v.multiplyScalar(scale);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
