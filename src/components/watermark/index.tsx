import { useEffect, useRef, type ReactNode } from "react"
import { generateWatermark, type GenderateWatermarkConfig } from "./generate-watermark";

export type WatermarkProps = GenderateWatermarkConfig & {
  children?: ReactNode;
};

export const Watermark = (props: WatermarkProps) => {
  const { children, ...config } = props;

  const ref = useRef<HTMLDivElement>();

  const clickref = useRef<Function>()

  useEffect(() => {
    clickref.current = generateWatermark(ref.current, config)

  }, []);

  const onClick = () => {
    clickref.current();
  }

  return (
    <div ref={ref}>
      <button onClick={onClick}>click me</button>
      {children}
    </div>
  )
}