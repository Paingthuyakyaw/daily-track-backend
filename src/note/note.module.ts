import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GrammarService } from './grammar.service';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [AuthModule],
  controllers: [NoteController],
  providers: [NoteService, GrammarService],
})
export class NoteModule {}
