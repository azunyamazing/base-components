import { useEffect, useRef, type ReactNode } from "react"
import { generateWatermark, type GenerateWatermarkConfig } from "./generate-watermark";

export type WatermarkProps = GenerateWatermarkConfig & {
  children?: ReactNode;
};

export const Watermark = (props: WatermarkProps) => {
  const { children, ...config } = props;

  const ref = useRef<HTMLDivElement>();

  const watermarkRef = useRef<Function>()

  useEffect(() => {
    watermarkRef.current = generateWatermark(ref.current, config)
  }, []);

  const onClick = () => {
    watermarkRef.current();
  }

  return (
    <div ref={ref}>
      <button onClick={onClick}>click me</button>
      {children}
    </div>
  )
}