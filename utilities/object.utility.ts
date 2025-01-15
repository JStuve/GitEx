export const ObjectUtility = {
  firstValue<T>(value: any): T | null {
    const keys: string[] = Object.keys(value)

    if ((keys?.length ?? 0) === 0) {
      return null
    }

    return value[keys[0]] as T
  }
}
