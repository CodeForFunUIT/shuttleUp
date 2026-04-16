import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO'])
  skillLevel?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  eloScore?: number;
}
