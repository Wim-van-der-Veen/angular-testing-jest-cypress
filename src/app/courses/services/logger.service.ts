import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class LoggerService {

    // eslint-disable-next-line class-methods-use-this
    log(message: string): void {
        // eslint-disable-next-line no-console
        console.log(message);
    }

}
