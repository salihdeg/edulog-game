import { Body, Controller, Get, Query } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { LeaderboardQueryDto } from '../leaderboard/dto/leaderboard-query.dto';
import { GameSession } from '../game/game-session.entity';
import { LeaderBoardResponseDto } from './dto/leaderboard-response.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private gameService: GameService) {}

  @ApiOkResponse({ type: LeaderBoardResponseDto })
  @Get()
  async getLeaderboard(
    @Query() pageDto: LeaderboardQueryDto,
  ): Promise<LeaderBoardResponseDto> {
    return await this.gameService.getLeaderboard(pageDto);
  }
}
