import { Test, TestingModule } from "@nestjs/testing"
import {
  ApplicationLoggerService,
  LOGGING_MODULE_OPTIONS,
  LoggingConfiguration,
  LoggingModule,
} from "@neoma/logging"
import { faker } from "@faker-js/faker"
import { ArrayStream } from "fixtures/pino/array-stream"
import { LoggerService } from "@nestjs/common"

const TRACE = 10
const DEBUG = 20
const INFO = 30
const WARN = 40
const ERROR = 50
const FATAL = 60

describe("ApplicationLoggerService", () => {
  const message = faker.hacker.phrase()
  const context = { ctx: faker.lorem.word() }
  const params = [faker.lorem.word(), faker.lorem.word()]

  let service: LoggerService
  let logOptions: LoggingConfiguration

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
    })
      .overrideProvider(LOGGING_MODULE_OPTIONS)
      .useValue({ logDestination: new ArrayStream(), logLevel: "verbose" })
      .compile()

    service = module.get(ApplicationLoggerService)
    logOptions = module.get(LOGGING_MODULE_OPTIONS)
  })

  describe("Default Configuration", () => {
    it("should default to 'log' level when using plain LoggingModule import", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [LoggingModule],
      })
        .overrideProvider(LOGGING_MODULE_OPTIONS)
        .useValue({ logDestination: new ArrayStream(logs) })
        .compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(4)
      expect(logs[0]).toMatchObject({ level: INFO, msg: message })
      expect(logs[1]).toMatchObject({ level: WARN, msg: message })
      expect(logs[2]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[3]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should default to 'log' level when using forRoot() with no logLevel", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({ logDestination: new ArrayStream(logs) }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(4)
      expect(logs[0]).toMatchObject({ level: INFO, msg: message })
      expect(logs[1]).toMatchObject({ level: WARN, msg: message })
      expect(logs[2]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[3]).toMatchObject({ level: FATAL, msg: message })
    })
  })

  describe("Logging Methods", () => {
    const methodTestCases = [
      { method: "verbose", level: TRACE, levelName: "trace" },
      { method: "debug", level: DEBUG, levelName: "debug" },
      { method: "log", level: INFO, levelName: "information" },
      { method: "warn", level: WARN, levelName: "warning" },
      { method: "error", level: ERROR, levelName: "error" },
      { method: "fatal", level: FATAL, levelName: "fatal" },
    ]

    methodTestCases.forEach(({ method, level, levelName }) => {
      describe(method, () => {
        describe("When it's called with just a message", () => {
          it(`It should log the message at the ${levelName} level`, () => {
            service[method](message)
            expect(logOptions.logDestination.logs).toContainEqual(
              expect.objectContaining({
                level,
                msg: message,
              }),
            )
          })
        })

        describe("When it's called with a message and a single context parameter that is an object", () => {
          it(`It should log the message and merge the context's properties into the log entry at the ${levelName} level`, () => {
            service[method](message, context)
            expect(logOptions.logDestination.logs).toContainEqual(
              expect.objectContaining({
                level,
                msg: message,
                ...context,
              }),
            )
          })
        })

        describe("When it's called with a message and a single context parameter that is a primitive (e.g. string)", () => {
          it(`It should log the message and wrap the single context parameter under a 'context' key at the ${levelName} level`, () => {
            service[method](message, params[0])
            expect(logOptions.logDestination.logs).toContainEqual(
              expect.objectContaining({
                level,
                msg: message,
                context: [params[0]],
              }),
            )
          })
        })

        describe("When it's called with a message and multiple context parameters", () => {
          it(`It should log the message and wrap all the context parameters in a 'context' array at the ${levelName} level`, () => {
            service[method](message, ...params)
            expect(logOptions.logDestination.logs).toContainEqual(
              expect.objectContaining({
                level,
                msg: message,
                context: params,
              }),
            )
          })
        })
      })
    })
  })

  describe("Log Level Filtering", () => {
    it("should log at 'verbose' level and above when logLevel is 'verbose'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "verbose",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(6)
      expect(logs[0]).toMatchObject({ level: TRACE, msg: message })
      expect(logs[1]).toMatchObject({ level: DEBUG, msg: message })
      expect(logs[2]).toMatchObject({ level: INFO, msg: message })
      expect(logs[3]).toMatchObject({ level: WARN, msg: message })
      expect(logs[4]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[5]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should log at 'debug' level and above when logLevel is 'debug'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "debug",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(5)
      expect(logs[0]).toMatchObject({ level: DEBUG, msg: message })
      expect(logs[1]).toMatchObject({ level: INFO, msg: message })
      expect(logs[2]).toMatchObject({ level: WARN, msg: message })
      expect(logs[3]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[4]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should log at 'log' level and above when logLevel is 'log'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "log",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(4)
      expect(logs[0]).toMatchObject({ level: INFO, msg: message })
      expect(logs[1]).toMatchObject({ level: WARN, msg: message })
      expect(logs[2]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[3]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should log at 'warn' level and above when logLevel is 'warn'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "warn",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(3)
      expect(logs[0]).toMatchObject({ level: WARN, msg: message })
      expect(logs[1]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[2]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should log at 'error' level and above when logLevel is 'error'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "error",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(2)
      expect(logs[0]).toMatchObject({ level: ERROR, msg: message })
      expect(logs[1]).toMatchObject({ level: FATAL, msg: message })
    })

    it("should log at 'fatal' level and above when logLevel is 'fatal'", async () => {
      const logs: any[] = []
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          LoggingModule.forRoot({
            logDestination: new ArrayStream(logs),
            logLevel: "fatal",
          }),
        ],
      }).compile()

      const service = module.get(ApplicationLoggerService)

      service.verbose!(message)
      service.debug!(message)
      service.log(message)
      service.warn(message)
      service.error(message)
      service.fatal!(message)

      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({ level: FATAL, msg: message })
    })
  })
})
