import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: '2026-06-03T00:00:00.000Z' })
  createDate: Date;
}

export class AuthTokensDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Bearer token for Authorization header',
  })
  accessToken: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'Registration successful' })
  message: string;

  @ApiProperty({ type: AuthUserDto })
  data: AuthUserDto;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({
    type: AuthTokensDto,
    description: 'Use accessToken as: Authorization: Bearer <token>',
  })
  data: AuthTokensDto;
}

export class MeResponseDto {
  @ApiProperty({ example: 'Profile retrieved' })
  message: string;

  @ApiProperty({ type: AuthUserDto })
  data: AuthUserDto;
}
