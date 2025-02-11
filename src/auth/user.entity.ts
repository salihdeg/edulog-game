import { GameSession } from '../game/game-session.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  highScore: number;

  @OneToMany((_type) => GameSession, (gameSession) => gameSession.user, {
    eager: true,
  })
  gameSessions: GameSession[];
}
