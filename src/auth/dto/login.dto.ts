import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
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
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password too weak',
  // }) // Büyük harf, küçük harf, özel karakter ve sayı içermelidir için entity tarafında kullanılabilir, frontend tarafında genel uyarı yapılabilir
  password: string;
}
