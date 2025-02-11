import { ApiProperty } from '@nestjs/swagger';
import { GameSession } from '../../game/game-session.entity';

export class LeaderBoardResponseDto {
  @ApiProperty({
    type: [GameSession],
    description: 'Leaderboard data',
  })
  data: {
    id: number;
    score: number;
    createdAt: Date;
    userId: number;
    username: string;
  }[];
  @ApiProperty({
    type: Number,
    description: 'Page number',
  })
  page: number;
  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
  })
  limit: number;

  @ApiProperty({
    type: Number,
    description: 'Total number of pages',
  })
  pageCount: number;
  @ApiProperty({
    type: Number,
    description: 'Total number of items',
  })
  total: number;
}
