import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  password: string;
}
