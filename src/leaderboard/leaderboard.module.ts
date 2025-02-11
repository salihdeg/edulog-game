import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { GameModule } from '../game/game.module';
import { GameService } from '../game/game.service';
import { GamesRepository } from '../game/games.repository';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [GameModule],
  controllers: [LeaderboardController],
  providers: [GameService, GamesRepository, UsersRepository],
})
export class LeaderboardModule {}
