import { Injectable } from '@nestjs/common';

// test ci/cd

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
