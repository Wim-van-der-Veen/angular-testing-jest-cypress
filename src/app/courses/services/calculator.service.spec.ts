import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

// xdescribe(...)  -- don't
// fdescribe(...)  -- focus
describe('CalculatorService', () => {

    let loggerSpy: LoggerService;

    let calculator: CalculatorService;

    beforeEach(() => {
        loggerSpy = { log: jest.fn() };
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {
                    provide:  LoggerService,
                    useValue: loggerSpy,
                },
            ],
        });
        calculator = TestBed.inject(CalculatorService);
    });

    it('should add two numbers', () => {
        const result = calculator.add(2, 3);
        expect(result).toBe(5);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    // xit(...)
    // fit(...)
    it('should subtract two numbers', () => {
        const result = calculator.subtract(2, 3);
        expect(result).toBe(-1);
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

});
