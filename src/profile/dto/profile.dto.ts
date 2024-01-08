import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class profileResponse {
  Message: string;
  Status: number;
  Payload: any;
}

// dto for update after register
export class profileUpdateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  birthday: string;

  @IsNumber()
  @IsNotEmpty()
  height: number;
  
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsString()
  @IsNotEmpty()
  heightUnit: string;
}

export class horoscopeDto {
  horoscope: string;
  err: boolean;
}

export interface ZodiacSign {
  start: Date;
  end: Date;
  sign: string;
}

export class interestsDto {
  @IsString()
  @IsNotEmpty()
  interets: string;
}
