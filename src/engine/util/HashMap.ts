export type Hashable = {
  hashCode: () => number;
  equals: (_other: unknown) => boolean;
};

export type MapEntry<K, V> = {
  key: K;
  value: V;
};

export default class HashMap<K extends Hashable, V> {
  _map = new Map<number, MapEntry<K, V>[]>();

  set(key: K, value: V) {
    const hash = key.hashCode();
    let list = this._map.get(hash);
    if (!list) {
      list = [];
      this._map.set(hash, list);
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].key.equals(key)) {
        list[i].value = value;
        return;
      }
    }
    list.push({ key, value });
  }

  get(key: K) {
    const hash = key.hashCode();
    const list = this._map.get(hash);
    if (!list) return null;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key.equals(key)) {
        return list[i].value;
      }
    }
    return null;
  }
}
