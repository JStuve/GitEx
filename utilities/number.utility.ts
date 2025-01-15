export const NumberUtility = {
  isNumber (value: unknown): boolean {
    const numberValue: number = +(value as any)
    return !isNaN(numberValue)
  }
}
