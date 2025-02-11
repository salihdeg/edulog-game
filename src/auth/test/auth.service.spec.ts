import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

const mockUsersRepository = () => ({
  register: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should call usersRepository.register with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
      };
      await authService.register(createUserDto);
      expect(usersRepository.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return accessToken if credentials are valid', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      const user = { username: 'test', password: 'hashedPassword' };
      usersRepository.findOne.mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwtService.sign.mockResolvedValue('accessToken');

      const result = await authService.login(loginDto);
      expect(result).toEqual({ accessToken: 'accessToken' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      usersRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      const user = { username: 'test', password: 'hashedPassword' };
      usersRepository.findOne.mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
