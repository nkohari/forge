import Dependency from './Dependency';

export const HINT_PROPERTY = '__FORGE_DEPENDENCY_HINTS__';

function inject<T = any>(hints: { [name: string]: string | Partial<Dependency> }) {
  return (target: T) => {
    const normalized = {};

    for (const name in hints) {
      if (typeof hints[name] === 'string') {
        normalized[name] = { name: hints[name] };
      } else {
        normalized[name] = { name, ...(hints[name] as any) };
      }
    }

    (target as any)[HINT_PROPERTY] = normalized;

    return target;
  };
}

export default inject;
