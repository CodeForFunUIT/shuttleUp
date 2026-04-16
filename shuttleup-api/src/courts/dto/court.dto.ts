import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateCourtDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
