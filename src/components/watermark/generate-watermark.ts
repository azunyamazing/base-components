import { createMutationObserverHandler, noop } from "./observer";
import { getImageSize, getTextSize } from "./size";

// 单个水印配置
export interface WatermarkConfig {
  text: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  gapX?: number;
  gapY?: number;
  color?: string;
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

  // 进行初始化属性配置操作
  const completedConfig: GenerateWatermarkContainerConfig = Object.assign({
    fontSize: '16px',
    fontFamily: 'Inter',
    fontWeight: 400,
    color: 'rgba(29, 33, 41, 0.07)',
    text: 'eriri',
    gapX: 0,
    gapY: 0,
    position
  }, config)

  let stop = noop;

  const run = () => {
    const element = generateWatermarkContainer(completedConfig);
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
  const [textWidth, textHeight] = getTextSize(watermarkConfig.text, watermarkConfig.fontSize);
  const [imageWidth, imageHeight] = getImageSize(textWidth * 1.2, -45);

  const watermarkImage = generateWatermarkImage({ ...watermarkConfig, textWidth, textHeight, imageWidth, imageHeight });
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
    backgroundSize: `${imageWidth}px ${imageHeight}px`,
    zIndex,
    pointerEvents: 'none'
  });

  return container;
}

// 生成水印图片配置
export type GenerateWatermarkImageConfig = WatermarkConfig & {
  textWidth: number;
  textHeight: number;
  imageWidth: number;
  imageHeight: number;
}

export function generateWatermarkImage(config: GenerateWatermarkImageConfig) {
  const { textHeight, imageWidth, imageHeight, fontSize, fontFamily, fontWeight, color, text, gapX, gapY } = config

  const canvas = document.createElement('canvas');
  canvas.width = imageWidth + textHeight + gapX;
  canvas.height = imageHeight + textHeight + gapY;

  const ctx = canvas.getContext('2d');
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
  ctx.fillStyle = color;

  ctx.translate(0, imageHeight);
  ctx.rotate((-45 * Math.PI) / 180);
  ctx.fillText(text, textHeight, textHeight);

  return canvas.toDataURL();
}
