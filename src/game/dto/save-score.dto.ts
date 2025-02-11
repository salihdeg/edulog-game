import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SaveScoreDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the game session',
  })
  @IsNumber()
  gameSessionId: number;

  @ApiProperty({
    example: 100,
    description: 'Score of the user',
  })
  @IsNumber()
  score: number;
}
