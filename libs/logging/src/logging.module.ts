import { DynamicModule, Module } from "@nestjs/common"
import {
  ApplicationLoggerService,
  LoggingConfiguration,
} from "./services/application-logger.service"
import { LOGGING_MODULE_OPTIONS } from "./symbols"

/**
 *  LoggingModule is a NestJS module that provides logging capabilities
 *  to the application through the ApplicationLoggerService and
 *  RequestsLoggerService.
 *
 *  @remarks Uses Pino logger internally.
 */
@Module({
  providers: [
    ApplicationLoggerService,
    { provide: LOGGING_MODULE_OPTIONS, useValue: {} },
  ],
  exports: [ApplicationLoggerService],
})
export class LoggingModule {
  /**
   * Configure the LoggingModule with custom options
   *
   * @param options - Configuration options for logging
   * @returns DynamicModule for use in imports
   */
  public static forRoot(options: LoggingConfiguration = {}): DynamicModule {
    return {
      module: LoggingModule,
      providers: [
        {
          provide: LOGGING_MODULE_OPTIONS,
          useValue: options,
        },
        ApplicationLoggerService,
      ],
      exports: [ApplicationLoggerService],
    }
  }
}
