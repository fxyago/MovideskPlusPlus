type Iteratee<T, K extends PropertyKey> = ((value: T) => K) | (keyof T & K);

export const groupBy = <T, K extends PropertyKey>(
  collection: T[],
  iteratee: Iteratee<T, K>
): Record<K, T[]> => {
  const result: Record<K, T[]> = {} as Record<K, T[]>;

  for (const item of collection) {
    let key: K;

    if (typeof iteratee === 'function') {
      key = iteratee(item);
    } else {
      key = item[iteratee] as K;
    }

    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
};

type MaxByIteratee<T> = ((value: T) => number | BigInt) | keyof T;

export const maxBy = <T>(
  collection: T[],
  iteratee: MaxByIteratee<T>
): T | undefined => {
  if (collection.length === 0) {
    return undefined;
  }

  let maxItem: T = collection[0];
  let maxValue: number | BigInt;

  if (typeof iteratee === 'function') {
    maxValue = iteratee(maxItem);
  } else {
    const value = maxItem[iteratee];
    if (typeof value === 'number' || typeof value === 'bigint') {
      maxValue = value;
    } else {
      maxValue = Number(value);
    }
  }

  for (let i = 1; i < collection.length; i++) {
    const currentItem = collection[i];
    let currentValue: number | BigInt;

    if (typeof iteratee === 'function') {
      currentValue = iteratee(currentItem);
    } else {
      const value = currentItem[iteratee];
      if (typeof value === 'number' || typeof value === 'bigint') {
        currentValue = value;
      } else {
        currentValue = Number(value); // Coerce for comparison
      }
    }

    if (
      !isNaN(Number(currentValue)) &&
      Number(currentValue) > Number(maxValue)
    ) {
      maxValue = currentValue;
      maxItem = currentItem;
    }
  }

  return maxItem;
};
