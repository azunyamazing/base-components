import { shallowRef } from "vue"

export const useId = () => {
  const currentCount = shallowRef(0);

  const getId = () => {
    currentCount.value += 1;
    return currentCount.value.toString();
  }

  return {
    getId
  }
}