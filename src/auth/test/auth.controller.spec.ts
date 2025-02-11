import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should call AuthService.register with the correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        password: 'test',
      };
      await authController.register(createUserDto);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with the correct parameters and return an access token', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      const result = { accessToken: 'testToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
