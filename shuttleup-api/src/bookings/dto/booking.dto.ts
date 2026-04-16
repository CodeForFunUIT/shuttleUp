import { IsString, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;
}
