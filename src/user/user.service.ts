import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createDate: true,
} as const;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  create(data: { name: string; email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.passwordHash,
      },
      select: publicUserSelect,
    });
  }
}
