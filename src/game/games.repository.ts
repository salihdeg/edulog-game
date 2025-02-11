import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameSession } from './game-session.entity';
import { User } from '../auth/user.entity';
import { LeaderboardQueryDto } from '../leaderboard/dto/leaderboard-query.dto';
import { LeaderBoardResponseDto } from '../leaderboard/dto/leaderboard-response.dto';

@Injectable()
export class GamesRepository extends Repository<GameSession> {
  constructor(private dataSource: DataSource) {
    super(GameSession, dataSource.createEntityManager());
  }

  async startGame(user: User): Promise<GameSession> {
    const gameSession = this.create({ user });
    return await this.save(gameSession);
  }

  async getLeaderboard(
    pageDto: LeaderboardQueryDto,
  ): Promise<LeaderBoardResponseDto> {
    const { page, limit } = pageDto;
    if (page && limit) {
      const queryBuilder = this.createQueryBuilder('gameSession')
        .leftJoinAndSelect('gameSession.user', 'user')
        .orderBy('gameSession.score', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      const [result, total] = await queryBuilder.getManyAndCount();
      const data = result.map((session) => ({
        id: session.id,
        score: session.score,
        createdAt: session.createdAt,
        userId: session.user.id,
        username: session.user.username,
      }));
      return {
        data,
        page: page || 1,
        limit: limit || total,
        pageCount: Math.ceil(total / limit),
        total,
      };
    }

    const result = await this.find({
      order: { score: 'DESC' },
      relations: ['user'],
    });
    const data = result.map((session) => ({
      id: session.id,
      score: session.score,
      createdAt: session.createdAt,
      userId: session.user.id,
      username: session.user.username,
    }));

    return {
      data,
      page: page || 0,
      limit: limit || 0,
      pageCount: 1,
      total: result.length,
    };
  }
}
