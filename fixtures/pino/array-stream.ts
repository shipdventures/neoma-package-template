/**
 * A simple writable stream implementation that stores log entries in an array.
 * Designed for testing Pino logger output by capturing logged objects in memory.
 *
 * @example
 * ```typescript
 * // Direct Pino usage
 * const stream = new ArrayStream()
 * const logger = pino({}, stream)
 * logger.info('test message')
 *
 * expect(stream.logs[0]).toMatchObject({
 *   level: 30,
 *   msg: 'test message'
 * })
 *
 * // With LoggingModule in tests
 * const stream = new ArrayStream()
 * const module = await Test.createTestingModule({
 *   imports: [LoggingModule.forRoot({ destination: stream })]
 * }).compile()
 *
 * const logger = module.get(ApplicationLoggerService)
 * logger.info('test message')
 * expect(stream.logs[0]).toMatchObject({ level: 30, msg: 'test message' })
 * ```
 */
export class ArrayStream {
  /**
   * Creates a new ArrayStream instance.
   *
   * @param arr - Optional initial array to store log entries. Defaults to empty array.
   */
  public constructor(public readonly arr: Array<any> = []) {}

  /**
   * Writes a log entry to the internal array.
   * Called by Pino when logging messages.
   *
   * @param chunk - The log object to store
   */
  public write(chunk: string): void {
    this.arr.push(JSON.parse(chunk))
  }

  /**
   * Returns a copy of all logged entries.
   * Provides a snapshot of logged data for test assertions.
   *
   * @returns A copy of the internal log array
   */
  public get logs(): Array<any> {
    return [...this.arr]
  }
}
