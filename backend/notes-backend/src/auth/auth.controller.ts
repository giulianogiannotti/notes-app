import {
  Controller,
  Get,
  UseGuards,
  Request,
  ConflictException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get('login')
  @UseGuards(AuthGuard('jwt'))
  async login(@Request() req) {
    const { userId, email, name } = req.user;

    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['notes'],
    });

    if (!user) {
      user = this.userRepository.create({
        id: userId,
        email,
        name,
        notes: [],
      });

      try {
        await this.userRepository.save(user);
      } catch (error) {
        if (error.code === '23505') {
          user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['notes'],
          });
          if (!user) {
            throw error;
          }
        } else {
          throw error;
        }
      }
    }

    return { user, notes: user.notes || [] };
  }
}
