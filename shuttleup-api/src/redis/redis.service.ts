import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  acquireLock(_key: string, _ttlSeconds: number = 10): Promise<boolean> {
    // 🚧 Tạm thời trả về true để bypass Redis ở dev môi trường
    this.logger.debug(`[OFFLINE MODE] Bypassed lock`);
    return Promise.resolve(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async releaseLock(_key: string): Promise<void> {
    // 🚧 Chế độ Dev: không làm gì
  }
}
