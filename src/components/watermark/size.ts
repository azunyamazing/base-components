// 根据文字内容来获取在页面时的尺寸
export function getTextSize(text: string, fontSize: string) {
  const span = document.createElement('span');
  span.textContent = text

  Object.assign(span.style, {
    position: 'fixed',
    visibility: 'hidden',
    opacity: '0',
    fontSize,
  })

  document.body.appendChild(span);
  const r = [span.offsetWidth, span.offsetHeight];
  document.body.removeChild(span);
  return r;
}


/**
 * 初始为下面的图片尺寸大小  根据文字角度去计算出最小的利用空间
 *   - - - - - - - - -
 *  |                |
 *  |                |
 *  |        xxxxxxxx|
 *  |                |
 *  |                |
 *   - - - - - - - - -
 *
 * 如果是逆时针 45 deg, 宽度和高度应该为 sin45° & cos45°, 即:右上角
 *  - - - - -
 *  |    x  |
 *  |  x    |
 *  |x      |
 *  - - - - -
 */

export function getImageSize(textWidth: number, angle: number) {
  const angleValue = (Math.abs(angle) % 90) * Math.PI / 180;
  const width = Math.cos(angleValue) * textWidth;
  const height = Math.sin(angleValue) * textWidth;
  return [width, height];
}
