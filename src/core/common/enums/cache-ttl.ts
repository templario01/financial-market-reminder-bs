/**
 * Enum representing common cache expiration times in milliseconds.
 *
 * This enum provides predefined time-to-live (TTL) values for caching mechanisms,
 * making it easier to select appropriate cache durations for different use cases.
 *
 * @remarks
 * The values are specified in milliseconds.
 *
 * @example
 * ```typescript
 * // Set cache TTL to 10 seconds
 * const ttl = CacheTime.TEN_SECONDS;
 * ```
 */
export enum CacheTime {
  FIVE_SECONDS = 5000,
  TEN_SECONDS = 10000,
  THIRTY_SECONDS = 30000,
  ONE_MINUTE = 60000,
  FIVE_MINUTES = 300000,
  TEN_MINUTES = 600000,
  THIRTY_MINUTES = 1800000,
  ONE_HOUR = 3600000,
}
