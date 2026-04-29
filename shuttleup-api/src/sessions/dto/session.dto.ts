import {
  IsString,
  IsInt,
  IsDateString,
  IsEnum,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GameType } from '../../common/constants/enums';

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

  @ApiPropertyOptional({
    enum: GameType,
    description: 'Game type for ELO tracking',
  })
  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType;
}
