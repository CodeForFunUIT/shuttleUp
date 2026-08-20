import { IsInt, Min, Max, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OnboardingAnswersDto {
  @ApiProperty({
    description: 'Playing experience (0-4)',
    minimum: 0,
    maximum: 4,
  })
  @IsInt()
  @Min(0)
  @Max(4)
  experience: number;

  @ApiProperty({ description: 'Play frequency (0-3)', minimum: 0, maximum: 3 })
  @IsInt()
  @Min(0)
  @Max(3)
  frequency: number;

  @ApiProperty({
    description: 'Tournament experience (0-3)',
    minimum: 0,
    maximum: 3,
  })
  @IsInt()
  @Min(0)
  @Max(3)
  tournament: number;

  @ApiProperty({ description: 'Game style (0-2)', minimum: 0, maximum: 2 })
  @IsInt()
  @Min(0)
  @Max(2)
  gameStyle: number;

  @ApiProperty({
    description: 'Technique consistency (0-3)',
    minimum: 0,
    maximum: 3,
  })
  @IsInt()
  @Min(0)
  @Max(3)
  technique: number;

  @ApiProperty({
    description: 'Training background (0-3)',
    minimum: 0,
    maximum: 3,
  })
  @IsInt()
  @Min(0)
  @Max(3)
  training: number;

  @ApiProperty({ description: 'Self rating (0-4)', minimum: 0, maximum: 4 })
  @IsInt()
  @Min(0)
  @Max(4)
  selfRating: number;
}

export class SubmitOnboardingDto {
  @ApiProperty({ type: OnboardingAnswersDto })
  @ValidateNested()
  @IsObject()
  @Type(() => OnboardingAnswersDto)
  answers: OnboardingAnswersDto;
}
