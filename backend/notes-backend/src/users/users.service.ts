import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findOrCreateFromAuth0(payload: any) {
    const id = payload.sub;
    let user = await this.findById(id);
    if (!user) {
      user = this.usersRepo.create({
        id,
        email: payload.email,
        name: payload.name,
      });
      user = await this.usersRepo.save(user);
    }
    return user;
  }
}
