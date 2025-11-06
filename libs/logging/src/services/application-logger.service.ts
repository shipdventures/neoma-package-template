/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Inject,
  Injectable,
  LoggerService,
  LogLevel,
  Optional,
} from "@nestjs/common"
import { LOGGING_MODULE_OPTIONS } from "../symbols"
import pino, { Level } from "pino"

/**
 * Configuration options for the LoggingModule
 */
export interface LoggingConfiguration {
  /**
   * The minimum log level to capture
   * @default 'log'
   */
  logLevel?: "verbose" | "debug" | "log" | "warn" | "error" | "fatal"

  /**
   * Custom destination for log output (for testing or custom streams)
   */
  logDestination?: any
}

/**
 * Maps NestJS log levels to Pino log levels
 */
const LEVEL_MAP = {
  verbose: "trace",
  debug: "debug",
  log: "info",
  warn: "warn",
  error: "error",
  fatal: "fatal",
}

@Injectable()
export class ApplicationLoggerService implements LoggerService {
  private readonly pino: pino.Logger

  public constructor(
    @Inject(LOGGING_MODULE_OPTIONS)
    @Optional()
    { logDestination = null, logLevel = "log" }: LoggingConfiguration = {
      logLevel: "log",
      logDestination: null,
    },
  ) {
    const pinoOptions = {
      level: LEVEL_MAP[logLevel] || "info",
    }

    this.pino = pino(pinoOptions, logDestination)
  }

  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  public log(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("info", message, ...optionalParams)
  }

  public error(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("error", message, ...optionalParams)
  }

  public warn(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("warn", message, ...optionalParams)
  }

  public debug?(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("debug", message, ...optionalParams)
  }

  public verbose?(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("trace", message, ...optionalParams)
  }

  public fatal?(message: any, ...optionalParams: any[]): void {
    this.logAtLevel("fatal", message, ...optionalParams)
  }
  /* eslint-enable @typescript-eslint/no-unsafe-argument */

  public setLogLevels?(_levels: LogLevel[]): void {}

  private logAtLevel(
    level: Level,
    message: any,
    ...optionalParams: any[]
  ): void {
    if (optionalParams.length === 1 && typeof optionalParams[0] === "object") {
      this.pino[level](optionalParams[0], message)
    } else if (optionalParams.length > 0) {
      this.pino[level]({ context: optionalParams }, message)
    } else {
      this.pino[level](message)
    }
  }
}
