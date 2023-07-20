export interface ObserverConfig {
  onNodeRemove?(): void;
  onNodeStyleChange?(changes: Record<string, string>): void;
  styleFilter?: Array<keyof CSSStyleDeclaration>;
}

export const noop = () => { };

export function createMutationObserverHandler(target: HTMLElement, config?: ObserverConfig) {
  let observers: MutationObserver[] = [];

  const observe = () => {
    observers = [
      createNodeRemoveObserver(target, () => {
        unobserve();
        config?.onNodeRemove?.();
      }),
      createNodeStyleObserver(target, config?.onNodeStyleChange, config?.styleFilter)
    ]
  }

  const unobserve = () => {
    observers.forEach(observer => {
      observer.disconnect();
    })
    observers = [];
  }

  return {
    observe,
    unobserve
  }
}

// 监听元素的被删除操作
export function createNodeRemoveObserver(target: HTMLElement, callback: ObserverConfig['onNodeRemove'] = noop) {
  const observer = new MutationObserver((mutations) => {
    const mutation = mutations.find(m => m.type === 'childList');
    if (mutation) {
      for (let i = 0; i < mutation.removedNodes.length; i++) {
        if (mutation.removedNodes[i] === target) {
          callback();
          break;
        }
      }
    }
  });

  const parentNode = target.parentElement;
  observer.observe(parentNode, {
    childList: true,
  });
  return observer;
}

// 监听元素的样式改变
export function createNodeStyleObserver(target: HTMLElement, callback: ObserverConfig['onNodeStyleChange'] = noop, styleFilter: ObserverConfig['styleFilter'] = []) {
  const targetClone = target.cloneNode() as HTMLElement;

  const observer = new MutationObserver((mutations) => {
    const mutation = mutations.find(m => m.type === 'attributes');
    if (mutation) {
      const changes: Record<string, string> = {};
      if (styleFilter.length) {
        styleFilter.forEach(key => {
          if (target.style[key] !== targetClone.style[key]) {
            Object.assign(changes, { [key]: target.style[key] })
          }
        })
      } else {
        // TODO: diff style and clone style
      }

      callback(changes);
    }
  })

  observer.observe(target, {
    attributeFilter: ['style'],
    attributeOldValue: true
  })
  return observer;
}

