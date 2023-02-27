import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type DataType<D> = Array<D & {
  key: string | number;
  value: any;
  style?: Record<string, any>;
  render?(item: D): ReactNode;
} & Record<string, any>>;

export interface VirtualListProps<D = any> {
  count: number;
  data: DataType<D>;
  width: number;
  itemHeight: number;
  style?: Record<string, any>;
  [key: string]: any;
}

export const VirtualList = <D extends any>(props: VirtualListProps<D>) => {
  const { count, width, itemHeight, data, style = {}, ...rest } = props;
  const max = data.length;
  const renderCount = count + 5;

  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [indexRange, setIndexRange] = useState([0, Math.min(renderCount, max)]);

  useEffect(() => {
    const ob = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const [start, end] = indexRange;

      let newStart = start;
      let newEnd = end;

      if (entry.isIntersecting && entry.target.id === 'top') {
        newStart = Math.max(start - count, 0);
        newEnd = Math.min(start + renderCount, max - 1);
      }

      if (entry.isIntersecting && entry.target.id === 'bottom') {
        newStart = Math.max(end - count, 0);
        newEnd = Math.min(end + renderCount, max - 1);
      }

      if (newStart !== start || newEnd !== end) {
        setIndexRange([newStart, newEnd]);
      }
    })

    topRef.current && ob.observe(topRef.current);
    bottomRef.current && ob.observe(bottomRef.current);

    return () => {
      topRef.current && ob.unobserve(topRef.current);
      bottomRef.current && ob.unobserve(bottomRef.current);
      ob.disconnect();
    }
  }, [indexRange]);

  const [start, end] = indexRange;
  const listData = data.slice(start, end + 1);
  const dataLength = listData.length;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'scroll',
        width,
        height: `${itemHeight * count}px`,
        ...style
      }}
      {...rest}
      id="wrap"
    >
      {listData.map((d, i) => {
        const { key, value, render, style = {}, ...rest } = d;
        const ref = i === 0 ? topRef : i === dataLength - 1 ? bottomRef : null;
        const id = i === 0 ? 'top' : i === dataLength - 1 ? 'bottom' : '';
        const top = (start + i) * itemHeight + 'px';

        return (
          <div key={d.key} ref={ref} id={id} style={{ position: 'absolute', backgroundColor: 'pink', width: '100%', height: itemHeight, top }} {...rest}>{value ?? render?.(d)}</div>
        )
      })}
    </div>
  )
}