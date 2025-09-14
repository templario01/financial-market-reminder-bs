/**
 * Enum representing common cache expiration times in milliseconds.
 *
 * This enum provides predefined time-to-live (TTL) values for caching mechanisms,
 * making it easier to select appropriate cache durations for different use cases.
 *
 * @remarks
 * The values are specified in seconds.
 *
 * @example
 * ```typescript
 * // Set cache TTL to 10 seconds
 * const ttl = CacheTime.TEN_SECONDS;
 * ```
 */
export enum CacheTime {
  FIVE_SECONDS = 5,
  TEN_SECONDS = 10,
  THIRTY_SECONDS = 30,
  ONE_MINUTE = 60,
  FIVE_MINUTES = 300,
  TEN_MINUTES = 600,
  THIRTY_MINUTES = 1800,
  ONE_HOUR = 3600,
  SIX_HOURS = 21600,
  TWELVE_HOURS = 43200,
  ONE_DAY = 86400,
}
