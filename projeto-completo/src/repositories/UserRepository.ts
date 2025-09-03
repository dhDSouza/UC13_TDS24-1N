import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import { Repository } from 'typeorm';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      order: { id: 'ASC' }
    });
  }

  async findAllWithPosts(): Promise<User[]> {
    return this.repository.find({
      relations: ['posts'],
      order: { id: 'ASC' }
    });
  }

  async findByIdWithPosts(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['posts']
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async createAndSave(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async removeUser(user: User): Promise<User> {
    return this.repository.remove(user);
  }
}
