### Selecto

```vue

const data = [
  { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
  { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
  { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
  { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
];

const dataset = {
  // referer: https://echarts.apache.org/handbook/en/concepts/dataset/#define-data-in-dataset
  // try to use the "array of classes" format:
  dimensions: ['product', '2015', '2016', '2017'],
  source: data
}

const options = {
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
      smooth: true,
    },
    {
      type: 'line',
    },
    {
      type: 'line',
    }
  ]
}

<Selecto>
  <SelectoChart />
  <SelectoChart />
  <SelectoChart />
</Selecto>

```




echart id / data item id 不包含 @