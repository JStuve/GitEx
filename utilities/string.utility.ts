export const StringUtility = {
  hasValue (value: string | undefined | null): boolean {
    if (value === null || value === undefined || value === '') {
      return false
    };

    return true
  },

  isString (value: unknown): boolean {
    return typeof value === 'string'
  },

  replaceWithSpace (value: string, replaceWith: string): string {
    return StringUtility.replaceAll(value, ' ', replaceWith)
  },

  replaceAll (value: string, match: string, replaceWith: string): string {
    return value.split(match).join(replaceWith)
  },

  toCurrency (value: number | string): string {
    const stringValue: string = (value === undefined || value === null) ? '0' : value.toString()
    const formattedNumber: number = parseFloat(stringValue)
    if (isNaN(formattedNumber)) {
      return '$0.00'
    }
    return `$${formattedNumber.toFixed(2)}`
  }
}
