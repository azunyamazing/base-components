import { createRoot } from 'react-dom/client';
import { createApp } from 'vue';
import { routes } from 'virtual:file-routes'

const reactApp = createRoot(document.getElementById('component'));

const isReact = (file: string | undefined) => {
  return !!file && file.endsWith('.tsx');
}

const isVue = (file: string | undefined) => {
  return !!file && file.endsWith('vue');
}

// 渲染 react 组件
const renderReactComponent = async (filePath: string) => {
  const { App } = await import(/* @vite-ignore */filePath)
  reactApp.render(App());
}

// 渲染 Vue 组件
const renderVueComponent = async (filePath: string) => {
  const { default: Component } = await import(/* @vite-ignore */filePath);
  createApp(Component).mount('#component');
}

// 路由改变时, 动态引入组件进行渲染
const onHistoryChange = (path: string) => {
  const filePath = routes[path];

  if (isReact(filePath)) {
    renderReactComponent(filePath);
  }

  if (isVue(filePath)) {
    renderVueComponent(filePath);
  }
}

const pushState = (path: string) => {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new CustomEvent('historychange', {
    detail: {
      path
    }
  }),);
}

export const bootstrapRouter = () => {
  window.addEventListener('historychange', (e: CustomEventInit) => {
    onHistoryChange(e.detail.path);
  })
}

export const useRouter = () => {
  return {
    pushState
  }
}