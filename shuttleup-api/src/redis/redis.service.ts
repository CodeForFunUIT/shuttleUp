import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  async acquireLock(key: string, ttlSeconds: number = 10): Promise<boolean> {
    // 🚧 Tạm thời trả về true để bypass Redis ở dev môi trường
    this.logger.debug(`[OFFLINE MODE] Bypassed lock for: ${key}`);
    return true;
  }

  async releaseLock(key: string): Promise<void> {
    // 🚧 Chế độ Dev: không làm gì
  }
}
