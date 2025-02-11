import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'salih',
    description: 'Name of the user',
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    example: '12345',
    description: 'Password of the user',
  })
  @IsString()
  @MinLength(5)
  password: string;
}
