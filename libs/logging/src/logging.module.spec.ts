import { Injectable } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { LoggingModule, ApplicationLoggerService } from "@neoma/logging"

@Injectable()
class TestService {
  public constructor(public logger: ApplicationLoggerService) {}
}

describe("LoggingModule", () => {
  let m: TestingModule
  it("should compile the module", async () => {
    m = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [TestService],
    }).compile()
  })

  it("It should export ApplicationLoggerService", async () => {
    expect(m.get(TestService).logger).toBeInstanceOf(ApplicationLoggerService)
  })
})
