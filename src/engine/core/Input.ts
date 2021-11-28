const downKeys = new Set();

export function isKeyDown(key: string) {
  return downKeys.has(key);
}

export function onKeyDown(e: KeyboardEvent) {
  downKeys.add(e.code);
}

export function onKeyUp(e: KeyboardEvent) {
  downKeys.delete(e.code);
}

export default {
  isKeyDown,
  onKeyDown,
  onKeyUp,
};
