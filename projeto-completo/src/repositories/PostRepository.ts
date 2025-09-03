import { AppDataSource } from '../config/data-source';
import { Post } from '../models/Post';
import { Repository } from 'typeorm';

export class PostRepository {
  private repository: Repository<Post>;

  constructor() {
    this.repository = AppDataSource.getRepository(Post);
  }

  async findAllWithUser(): Promise<Post[]> {
    return this.repository.find({
      relations: ['user'],
      order: { id: 'ASC' }
    });
  }

  async findByIdWithUser(id: number): Promise<Post | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.repository.findOneBy({ id });
  }

  async createAndSave(data: Partial<Post>): Promise<Post> {
    const post = this.repository.create(data);
    return this.repository.save(post);
  }

  async save(post: Post): Promise<Post> {
    return this.repository.save(post);
  }

  async removePost(post: Post): Promise<Post> {
    return this.repository.remove(post);
  }
}
