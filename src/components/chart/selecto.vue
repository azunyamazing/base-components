<template>
  <VueSelecto v-bind="selectoConfig" @select="onSelectoSelect" class="selecto-default" />
  <div class="vueselecto-chart-list" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, shallowRef } from "vue";
import { VueSelecto } from "vue3-selecto";
import { useId } from "./hooks/useId";

import type { ECharts } from "echarts";

export type VueSelectoProps = InstanceType<typeof VueSelecto>['$props'];
export type SelectionsValue = Record<string, unknown>;
export interface Selections {
  [echartId: string]: Array<SelectionsValue>;
}
export type OnSelect = (selections: Selections) => void;
export interface SelectoOptions {
  selectoOptions?: VueSelecto;
  selectoStyles?: string;
  onSelect?: OnSelect;
}

export interface RegisteredEchartValue {
  echartId: string;
  echartIntance: ECharts;
  onSelect(ids: Array<string>): Array<SelectionsValue>;
}

// 约定格式: vueselecto:[echartsId]@[dataItemId]
const textRegexp = /^vueselecto:(.*)$/;

const { selectoOptions = {}, onSelect } = defineProps<SelectoOptions>();

// 拖选框配置
const selectoConfig = computed(() => {
  return {
    container: document.body,
    dragContainer: window,
    selectByClick: true,
    selectFromInside: false,
    continueSelect: false,
    hitRate: 1,
    ...selectoOptions,
    selectableTargets: ['.vueselecto-chart-list text[fill-opacity="0"]'],
  }
})

// echart 实例注册集合
const echartInstanceMap = shallowRef(new Map<string, RegisteredEchartValue>());

// 拖选框 onselect 回调
const onSelectoSelect: VueSelectoProps['onSelect'] = (e) => {
  if (!e.selected.length || !onSelect) {
    return;
  }

  // chartId: [dataId, dataId, ...]
  const idMap = new Map<string, Array<string>>();

  // 这轮只收集数据项 id
  e.selected.forEach(({ textContent }) => {
    if (textContent && textRegexp.test(textContent)) {
      const [chartId, dataId] = textContent.replace(textRegexp, '$1').split('@');
      const dataIdArr = idMap.get(chartId) || [];
      dataIdArr.push(dataId);
      idMap.set(chartId, dataIdArr);
    }
  })

  const result: Selections = {};
  // 这里统一找出哪些数据项被选中
  for (const [echartId, dataIdArr] of idMap) {
    if (echartInstanceMap.value.has(echartId)) {
      const values = echartInstanceMap.value.get(echartId)!;
      const dataItems = values.onSelect(dataIdArr)
      Object.assign(result, { [echartId]: dataItems });
    }
  }

  onSelect(result);
}

// 注册拖选
const registerSelecto = (props: RegisteredEchartValue) => {
  echartInstanceMap.value.set(props.echartId, props);
}

// 注销
const unregisterSelecto = (id: string) => {
  const registeredValue = echartInstanceMap.value.get(id);
  if (registeredValue) {
    registeredValue.echartIntance.dispose();
    echartInstanceMap.value.delete(id);
  }
}

//  默认 echart 实例 id
const { getId: getInstanceId } = useId();

provide('registerSelecto', registerSelecto);
provide('unregisterSelecto', unregisterSelecto);
provide('getInstanceId', getInstanceId);

export type RegisterSelecto = typeof registerSelecto;
export type UnregisterSelecto = typeof unregisterSelecto;
export type GetInstanceId = typeof getInstanceId;
</script>

<style scoped>
.selecto-default {
  background: rgba(0, 133, 255, 0.1);
  border-color: rgba(0, 133, 255, 1);
}
</style>