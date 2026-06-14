/**
 * Wraps a value with SQL LIKE wildcards for case-insensitive substring matching.
 *
 * @param value - Value to surround with wildcards.
 * @returns Value wrapped as a `%value%` LIKE pattern.
 */
const wrapLikePattern = (value: string): string => `%${value}%`

export default wrapLikePattern
