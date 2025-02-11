import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    return this.usersRepository.register(createUserDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }

  async findById(id: number) {
    const found = await this.usersRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return found;
  }
}
