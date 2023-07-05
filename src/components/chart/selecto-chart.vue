<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { init as initEchart, } from "echarts";
import { computed, inject, onMounted, onUnmounted, ref, shallowRef, watchEffect } from "vue";
import { useId } from "./hooks/useId";

import type { ECharts, EChartsOption } from "echarts";
import type { GetInstanceId, RegisterSelecto, UnregisterSelecto } from "./selecto.vue";

export type ArrayItem<T> = T extends Array<infer E> ? E : never;
export type OverrideType<T, Key, NewType> = {
  [K in keyof T]: K extends Key ? NewType : T[K];
};

export type Coordinate = ArrayItem<Parameters<ECharts['convertToPixel']>[1]>;

export interface SelectoChartProps {
  id?: string;
  options: OverrideType<EChartsOption, 'dataset', ArrayItem<EChartsOption['dataset']>>; // echarts options
  initOptions?: Omit<Parameters<typeof initEchart>[2], 'renderer'>; // echarts init options
}

const getInstanceId = inject<GetInstanceId>('getInstanceId')!;
const instanceId = shallowRef(getInstanceId());

const { options, initOptions = {}, id: echartId = instanceId.value } = defineProps<SelectoChartProps>();
const { dataset } = options;

const registerSelecto = inject<RegisterSelecto>('registerSelecto')!;
const unregisterSelecto = inject<UnregisterSelecto>('unregisterSelecto')!;

// echart container dom
const containerRef = ref<HTMLDivElement | null>(null);
// echart instance
const echartInstance = shallowRef<ECharts | null>(null);

const { getId } = useId();

// 坐标集合
const dataCoordinateMap = computed(() => {
  const coordinateMap = new Map<string, [[xName: string, xVal: string | number], [yName: string, yVal: string | number]]>();
  if (!dataset) {
    return coordinateMap;
  }

  const { dimensions, source } = dataset;
  if (!dimensions || !source || !Array.isArray(source)) {
    console.error('[selecto chart]: make sure dataset has attrs: dimensions, source');
    return coordinateMap;
  }

  // 收集每一点的值坐标
  // dimensions: 第一个是 x 轴 key, 后面是 y 轴 key
  const [xName, ...yNames] = dimensions as string[];
  for (const item of (source as Array<Record<string, any>>)) {
    if (xName in item) {
      const x = item[xName];
      yNames.forEach(yName => {
        if (yName in item) {
          const id = getId();
          coordinateMap.set(id, [[xName, x], [yName, item[yName]]]);
        }
      })
    }
  }

  return coordinateMap;
})

// 数据集合更新需要重新计算位置信息 / 注册信息...
watchEffect(() => {
  if (echartInstance.value) {
    echartInstance.value.setOption({
      ...options,
      dataset
    });

    if (dataCoordinateMap.value) {
      const graphic: Array<ArrayItem<EChartsOption['graphic']>> = [];
      for (const [dataId, [[, xVal], [, yVal]]] of dataCoordinateMap.value) {
        const [x, y] = echartInstance.value.convertToPixel('grid', [xVal, yVal]);
        graphic.push({
          type: 'text',
          x,
          y,
          style: {
            text: `vueselecto:${echartId}@${dataId}`,
            fontSize: '0.01px',
            opacity: 0,
          }
        })
      }
      echartInstance.value.setOption({ graphic });
    }

    // 数据集更新重新注册
    registerSelecto({
      echartId,
      echartIntance: echartInstance.value,
      onSelect(ids: Array<string>) {
        const result: Array<Record<string, string | number>> = [];
        if (dataCoordinateMap.value) {
          for (const id of ids) {
            if (dataCoordinateMap.value.has(id)) {
              const [[xName, xValue], [yName, yValue]] = dataCoordinateMap.value.get(id)!;
              result.push({
                [xName]: xValue,
                [yName]: yValue
              })
            }
          }
        }
        return result;
      }
    });
  }
});

onMounted(() => {
  echartInstance.value = initEchart(containerRef.value!, undefined, {
    ...initOptions,
    renderer: 'svg'
  });
})

onUnmounted(() => {
  unregisterSelecto(echartId);
})

defineExpose({ echartInstance });
</script>
