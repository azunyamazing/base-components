<template>
  <Selecto @select="onSelect" class="liner-group">
    <div class="liner-item">
      <SelectoChart id="chart1" :options="options" class="line-chart" />
    </div>
    <div class="liner-item">
      <SelectoChart id="chart2" :options="options" class="line-chart" />
    </div>
    <div class="liner-item">
      <SelectoChart id="chart3" :options="options" class="line-chart" />
    </div>
  </Selecto>
</template>

<script setup lang="ts">
import { Selecto, SelectoChart } from '../../src/components/chart';

type SelectoProps = InstanceType<typeof Selecto>['$props'];

type SelectoChartProps = InstanceType<typeof SelectoChart>['$props'];

const dataset1 = {
  dimensions: ['product', '2015'],
  source: [
    { product: 'Matcha Latte1', '2015': 43.3 },
    { product: 'Milk Tea1', '2015': 83.1 },
    { product: 'Cheese Cocoa1', '2015': 86.4 },
    { product: 'Walnut Brownie1', '2015': 72.4 },
    { product: 'Matcha Latte2', '2015': 43.3 },
    { product: 'Milk Tea2', '2015': 83.1 },
    { product: 'Cheese Cocoa2', '2015': 86.4 },
    { product: 'Walnut Brownie2', '2015': 72.4 },
    { product: 'Matcha Latte3', '2015': 43.3 },
    { product: 'Milk Tea3', '2015': 83.1 },
    { product: 'Cheese Cocoa3', '2015': 86.4 },
    { product: 'Walnut Brownie3', '2015': 72.4 },
    { product: 'Matcha Latte4', '2015': 43.3 },
    { product: 'Milk Tea4', '2015': 83.1 },
    { product: 'Cheese Cocoa4', '2015': 86.4 },
    { product: 'Walnut Brownie4', '2015': 72.4 },
    { product: 'Matcha Latte5', '2015': 43.3 },
    { product: 'Milk Tea5', '2015': 83.1 },
    { product: 'Cheese Cocoa5', '2015': 86.4 },
    { product: 'Walnut Brownie5', '2015': 72.4 },
  ]
};

const maxVal = Math.max(...dataset1.source.map(d => d['2015']));

const options: SelectoChartProps['options'] = {
  xAxis: {
    type: 'category',
    axisLine: {
      onZero: true,
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    min: 'dataMin',
    max: 'dataMax',
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false
    }
  },
  grid: {
    top: 5,
    left: -20,
    right: -20,
    height: 20
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff',
        color: (params) => {
          const d = params.data as Record<string, string | number>;
          const yName = params.dimensionNames[1];
          if (typeof d[yName] === 'number' && d[yName] === maxVal) {
            return 'rgba(250, 140, 21, 1)'
          }
          return 'rgba(0, 133, 255, 1)'
        }
      },
      symbolSize: 7,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 133, 255, 1)' },
            { offset: 1, color: 'rgba(255, 255, 255, 1)' }
          ]
        }
      }
      // symbolSize: symbolSize, // 为了方便拖拽，把 symbolSize 尺寸设大了。
      // emphasis: {
      //   itemStyle: {
      //     color: 'red',
      //     borderColor: '#000'
      //   },
      //   scale: 1.5
      // },
      // silent: true,
      // clip: false
    },

  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'rgba(0, 133, 255, 1)'
      }
    },
    renderMode: 'html',
    appendToBody: true,
  },
  dataset: dataset1
}

const onSelect: SelectoProps['onSelect'] = (e) => {
  console.log(e);
}

</script>

<style lang="less">
.liner-group {
  width: 922px;
  border: 1px solid rgb(230, 230, 230);

  .liner-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52px;
    background: pink;
  }

  .line-chart {
    position: relative;
    width: 858px;
    height: 32px;
    border-bottom: 1px solid rgb(230, 230, 230);
    background: #fff;

    &::after {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 0;
      border-top: 1px dashed rgba(101, 120, 155, 1);
    }
  }
}
</style>