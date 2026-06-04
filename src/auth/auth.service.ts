import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { promisify } from 'util';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const hashPassword = promisify(hash);
const comparePassword = promisify(compare);

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const name = dto.name?.trim();
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password;

    if (!name) {
      throw new BadRequestException('name is required');
    }
    if (!email) {
      throw new BadRequestException('email is required');
    }
    if (!password || password.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }

    const existing = await this.userService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = (await hashPassword(
      password,
      this.saltRounds,
    )) as string;
    return this.userService.create({ name, email, passwordHash });
  }

  async login(dto: LoginDto) {
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password;

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = (await comparePassword(password, user.password)) as boolean;
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
