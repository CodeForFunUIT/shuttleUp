import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameType } from '../../common/constants/enums';

export class SubmitMatchDto {
  @ApiProperty({ enum: GameType, description: 'Game type for this match' })
  @IsEnum(GameType)
  gameType: GameType;

  @ApiProperty({
    example: ['userId1'],
    description: '1 player (singles) or 2 players (doubles/mixed)',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teamA: string[];

  @ApiProperty({
    example: ['userId2'],
    description: '1 player (singles) or 2 players (doubles/mixed)',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  teamB: string[];

  @ApiProperty({
    example: 'A',
    enum: ['A', 'B'],
    description: 'Winning team',
  })
  @IsIn(['A', 'B'])
  winner: 'A' | 'B';

  @ApiPropertyOptional({
    description: 'ISO datetime when match was played (defaults to now)',
  })
  @IsOptional()
  @IsDateString()
  playedAt?: string;
}
