import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GamesRepository } from './games.repository';
import { User } from '../auth/user.entity';
import { GameSession } from './game-session.entity';
import { SaveScoreDto } from './dto/save-score.dto';
import { LeaderboardQueryDto } from '../leaderboard/dto/leaderboard-query.dto';
import { UsersRepository } from '../auth/users.repository';
import { LeaderBoardResponseDto } from '../leaderboard/dto/leaderboard-response.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GamesRepository) private gamesRepository: GamesRepository,
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getGameSessionById(id: number, user: User): Promise<GameSession> {
    const userId = user.id;
    const session = await this.gamesRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!session) {
      throw new NotFoundException('Game session not found');
    }
    return session;
  }

  async startGame(user: User): Promise<GameSession> {
    return await this.gamesRepository.startGame(user);
  }

  async saveScore(user: User, scoreDto: SaveScoreDto): Promise<GameSession> {
    const { gameSessionId, score } = scoreDto;
    const gameSession = await this.getGameSessionById(gameSessionId, user);
    gameSession.score = score;
    await this.gamesRepository.save(gameSession);

    if (!user.highScore || score > user.highScore) {
      await this.updateHighScore(user, score);
    }

    return gameSession;
  }

  private async updateHighScore(user: User, score: number): Promise<void> {
    user.highScore = score;
    await this.usersRepository.save(user);
  }

  async getLeaderboard(
    pageDto: LeaderboardQueryDto,
  ): Promise<LeaderBoardResponseDto> {
    return await this.gamesRepository.getLeaderboard(pageDto);
  }
}
