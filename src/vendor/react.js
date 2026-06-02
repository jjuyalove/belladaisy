let currentRender = null;

export const StrictMode = Symbol('StrictMode');

export const createElement = (type, props, ...children) => ({
  type,
  props: {
    ...(props || {}),
    children: children.flat().filter((child) => child !== null && child !== undefined && child !== false),
  },
});

export const useState = (initialValue) => {
  if (!currentRender) throw new Error('useState must be called while rendering a component.');
  const renderState = currentRender;
  const hookIndex = renderState.hookIndex;
  renderState.hooks[hookIndex] ??= typeof initialValue === 'function' ? initialValue() : initialValue;

  const setState = (nextValue) => {
    const value = typeof nextValue === 'function' ? nextValue(renderState.hooks[hookIndex]) : nextValue;
    renderState.hooks[hookIndex] = value;
    renderState.scheduleRender();
  };

  renderState.hookIndex += 1;
  return [renderState.hooks[hookIndex], setState];
};

export const useRef = (initialValue) => {
  if (!currentRender) throw new Error('useRef must be called while rendering a component.');
  const renderState = currentRender;
  const hookIndex = renderState.hookIndex;
  renderState.hooks[hookIndex] ??= { current: initialValue };
  renderState.hookIndex += 1;
  return renderState.hooks[hookIndex];
};

const dependenciesChanged = (previousDependencies, nextDependencies) => {
  if (!previousDependencies || !nextDependencies) return true;
  return nextDependencies.some((dependency, index) => !Object.is(dependency, previousDependencies[index]));
};

export const useEffect = (effect, dependencies) => {
  if (!currentRender) throw new Error('useEffect must be called while rendering a component.');
  const renderState = currentRender;
  const hookIndex = renderState.hookIndex;
  const previous = renderState.hooks[hookIndex];

  if (dependenciesChanged(previous?.dependencies, dependencies)) {
    renderState.pendingEffects.push({ hookIndex, effect, dependencies });
  }

  renderState.hookIndex += 1;
};

export const __renderWithHooks = (renderState, component, props) => {
  currentRender = renderState;
  renderState.hookIndex = 0;
  renderState.pendingEffects = [];
  const tree = component(props || {});
  currentRender = null;
  return tree;
};

const React = { createElement, StrictMode, useEffect, useRef, useState };
export default React;
