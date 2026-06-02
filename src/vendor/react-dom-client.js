import { StrictMode, __renderWithHooks } from './react.js';

const eventName = (prop) => prop.slice(2).toLowerCase();

const appendChild = (element, child) => {
  if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(element, nestedChild));
    return;
  }
  if (child === null || child === undefined || child === false) return;
  element.appendChild(typeof child === 'object' ? renderNode(child) : document.createTextNode(String(child)));
};

const applyProps = (element, props = {}) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'children' || value === null || value === undefined || value === false) return;
    if (key === 'className') {
      element.setAttribute('class', value);
      return;
    }
    if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(eventName(key), value);
      return;
    }
    if (key === 'disabled' && value === true) {
      element.setAttribute('disabled', '');
      return;
    }
    element.setAttribute(key, value);
  });
};

const renderNode = (node) => {
  if (node.type === StrictMode) return renderNode(node.props.children[0]);
  if (typeof node.type === 'function') return renderNode(node.type(node.props));
  const element = document.createElement(node.type);
  applyProps(element, node.props);
  node.props.children?.forEach((child) => appendChild(element, child));
  return element;
};

export const createRoot = (container) => {
  const renderState = {
    hookIndex: 0,
    hooks: [],
    pendingEffects: [],
    scheduleRender: () => queueMicrotask(runRender),
  };
  let rootElement = null;
  let isRenderQueued = false;

  const runEffects = () => {
    renderState.pendingEffects.forEach(({ hookIndex, effect, dependencies }) => {
      renderState.hooks[hookIndex]?.cleanup?.();
      const cleanup = effect();
      renderState.hooks[hookIndex] = { dependencies, cleanup };
    });
  };

  const runRender = () => {
    if (isRenderQueued) return;
    isRenderQueued = true;
    queueMicrotask(() => {
      isRenderQueued = false;
      const tree = rootElement.type === StrictMode
        ? __renderWithHooks(renderState, rootElement.props.children[0].type, rootElement.props.children[0].props)
        : __renderWithHooks(renderState, rootElement.type, rootElement.props);
      container.replaceChildren(renderNode(tree));
      runEffects();
    });
  };

  return {
    render(element) {
      rootElement = element;
      runRender();
    },
  };
};
