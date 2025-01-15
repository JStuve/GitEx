export const ArrayUtility = {
  hasEntries<T>(array: T[] | undefined): boolean {
    return (array?.length ?? 0) !== 0
  },

  safeGetFirst<T>(list: T[] | undefined): T | null {
    return list !== undefined && ArrayUtility.hasEntries(list)
      ? list[0]
      : null
  },

  safeGetLast<T>(list: T[] | undefined): T | null {
    return list !== undefined && ArrayUtility.hasEntries(list)
      ? list[list.length - 1]
      : null
  },

  /**
     * Get the value in an array at a given index.
     */
  safeGetNth<T>(list: T[] | undefined, index: number): T | null {
    return list !== undefined &&
            ArrayUtility.hasEntries(list) &&
            list.length >= index
      ? list[index]
      : null
  },

  /**
     * Get a sequential list of numbers given a start and end range.
     * @param start
     * @param end
     * @returns
     */
  range (start: number, end: number): number[] {
    if (start > end) {
      throw new Error('Start cannot be greater than end.')
    }

    const numberList: number[] = []
    while (start <= end) {
      numberList.push(start++)
    }
    return numberList
  },

  groupBy<T, TKey>(
    array: T[],
    keySelector: (val: T) => TKey
  ): Map<TKey, T[]> {
    if (!this.hasEntries(array)) {
      return new Map<TKey, T[]>()
    }

    return array.reduce((acc: Map<TKey, T[]>, entity: T) => {
      const key: TKey = keySelector(entity)
      if (acc.has(key)) {
        acc.get(key)?.push(entity)
      } else {
        acc.set(key, [entity])
      }
      return acc
    }, new Map<TKey, T[]>())
  },

  /** Sorts the array by a projector after copying it's reference to prevent manipulating the original array */
  sortBy<T, R>(
    array: T[],
    projector: (entry: T) => R,
    descending?: boolean
  ): T[] {
    if (!this.hasEntries(array)) {
      return []
    }
    const sign: number = descending === true ? 1 : -1
    const sortFn: (a: T, b: T) => number = function (a: T, b: T): number {
      const aR: R = projector(a)
      const bR: R = projector(b)
      const values: number = aR === bR ? 0 : aR < bR ? 1 : -1
      return values * sign
    }
    return [...array].sort(sortFn)
  },

  /** Sorts an array by its entries either ascending or descending */
  sort<T>(array: T[], descending?: boolean): T[] {
    return this.sortBy(array, (r) => r, descending)
  },

  /**
     * Replace an value in an array given the index.
     */
  replace<T>(array: T[], newValue: T, index: number): T[] {
    array.splice(index, 1, newValue)
    return array
  },

  /**
     * Find a value in an array and replace it with a new value. If it does not exist,
     * add the new value.
     */
  findAndReplace<T>(
    array: T[] | null | undefined,
    predicate: (v: T) => boolean,
    newValue: T
  ): T[] {
    let validArray: T[] = (array === undefined || array === null) ? [] : array
    const index = validArray.findIndex(predicate)
    if (index >= 0) {
      validArray.splice(index, 1, newValue)
    } else {
      if (ArrayUtility.hasEntries(validArray)) {
        validArray.push(newValue)
      } else {
        validArray = [newValue]
      }
    }
    return validArray
  },

  /**
     * Adds a value in an array if it does not exist.
     */
  addIfMissing<T>(
    array: T[],
    predicate: (v: T) => boolean,
    newValue: T
  ): T[] {
    const index = array.findIndex(predicate)
    if (index >= 0) {
      return array
    } else {
      if (ArrayUtility.hasEntries(array)) {
        array.push(newValue)
      } else {
        array = [newValue]
      }
    }
    return array
  },

  /**
     * Retrieve a random item in a given array. Will return null if the array is empty.
     * @param array
     * @returns
     */
  getRandomItem<T>(array: T[]): T | null {
    if (!ArrayUtility.hasEntries(array)) {
      return null
    }

    const randomIndex: number = Math.floor(Math.random() * array.length)
    return array[randomIndex]
  },

  sum<T>(
    array: T[] | null | undefined,
    predicate: (v: T) => number
  ): number {
    if (array === null || array === undefined || array?.length === 0) {
      return 0
    }

    let sum = 0
    for (const item of array) {
      sum += predicate(item)
    }
    return sum
  },

  first<T>(array: T[] | undefined): T | null {
    if (array === undefined) {
      return null
    }

    if (array.length > 0) {
      return array[0]
    } else {
      return null
    }
  },

  last<T>(array: T[] | undefined): T | null {
    if (array === undefined) {
      return null
    }

    if (array.length > 0) {
      return array[array.length - 1]
    } else {
      return null
    }
  }
}
