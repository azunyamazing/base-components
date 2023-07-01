import { VirtualList } from "../../src/components/list/virtual-list"
import type { DataType } from "../../src/components/list/virtual-list"

interface Data {
  title: number;
}

const data: DataType<Data> = [];

for (let i = 0; i < 999; i++) {
  data.push({ title: i, key: i, value: i })
}

export const App = () => {
  return <VirtualList data={data} count={5} itemHeight={100} width={200}  />
}