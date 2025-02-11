import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from './game-session.entity';
import { GamesRepository } from './games.repository';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([GameSession])],
  providers: [GameService, GamesRepository, UsersRepository],
  controllers: [GameController],
})
export class GameModule {}
