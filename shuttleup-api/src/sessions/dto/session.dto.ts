import { IsString, IsInt, IsDateString, IsEnum, Min, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  courtId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  @Min(1)
  totalSlots: number;

  @IsInt()
  @Min(0)
  pricePerSlot: number;

  @IsOptional()
  @IsEnum(['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  skillRequired?: string;
}
