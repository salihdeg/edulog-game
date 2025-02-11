import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../auth/user.entity';
import { SaveScoreDto } from './dto/save-score.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('start')
  @UseGuards(AuthGuard())
  async startGame(@GetUser() user: User) {
    return await this.gameService.startGame(user);
  }

  @Post('score')
  @UseGuards(AuthGuard())
  async saveScore(@GetUser() user: User, @Body() scoreDto: SaveScoreDto) {
    return await this.gameService.saveScore(user, scoreDto);
  }
}
