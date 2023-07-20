import { createMutationObserverHandler, noop } from "./observer";

// 单个水印配置
export interface WatermarkConfig {
  width: number;
  height: number;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  gapX?: number;
  gapY?: number;
  color?: string;
  text?: string;
}

// 入口函数配置
export type GenderateWatermarkConfig = WatermarkConfig & {
  className?: string;
  zIndex?: number;
}

export type WatermarkCleaner = () => void;
export type GenerateWatermark = (target: HTMLElement, config: GenderateWatermarkConfig) => WatermarkCleaner;

// 生成水印入口函数
export const generateWatermark: GenerateWatermark = (target, config) => {
  const position = target === document.body ? 'fixed' : 'absolute';
  if (position === 'absolute' && window.getComputedStyle(target).position === 'static') {
    target.style.position = 'relative';
  }

  let stop = noop;

  const run = () => {
    const element = generateWatermarkContainer({ ...config, position });
    target.appendChild(element);

    stop = () => {
      unobserve();
      element.parentNode.removeChild(element);
    }

    const { observe, unobserve } = createMutationObserverHandler(element, {
      onNodeRemove() {
        // 被删除后只需要卸载监听器后 restart
        unobserve();
        stop = run();
      },
      onNodeStyleChange() {
        // 样式改变直接 restart
        stop();
        stop = run();
      }
    });

    observe();
    return stop;
  }

  run();
  return () => {
    stop();
  };
}

export type GenerateWatermarkContainerConfig = GenderateWatermarkConfig & {
  position: string;
}

// 生成水印元素
export function generateWatermarkContainer(config: GenerateWatermarkContainerConfig): HTMLDivElement {
  const { position, zIndex = 10000, className = '', ...watermarkConfig } = config;
  const { width, height } = watermarkConfig;

  const watermarkImage = generateWatermarkImage(watermarkConfig);
  const container = document.createElement('div');

  className && container.classList.add(className);
  Object.assign(container.style, {
    position,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${watermarkImage})`,
    backgroundRepeat: 'repeat',
    backgroundSize: `${width}px ${height}px`,
    zIndex,
    pointerEvents: 'none'
  });

  return container;
}

// 生成水印图片
export function generateWatermarkImage(config: WatermarkConfig) {
  const { width, height, fontSize = '14px', fontFamily = 'Inter', fontWeight = 400, color = 'rgba(29, 33, 41, 0.07)', text = 'eriri', gapX = 0, gapY = 0 } = config

  const canvas = document.createElement('canvas');
  canvas.width = width + gapX;
  canvas.height = height + gapY;

  const ctx = canvas.getContext('2d');
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  ctx.fillStyle = color;

  ctx.translate(width / 10, height * 0.8);
  ctx.rotate((-40 * Math.PI) / 180);
  ctx.fillText(text, 0, 0);

  return canvas.toDataURL();
}
