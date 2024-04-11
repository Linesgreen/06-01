import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Blog_Orm } from '../../blogs/entites/orm_blogs';
import { Comment_Orm } from '../../comments/entites/orm_comment';
import { Comment_like_Orm } from '../../comments/entites/orm_comment_like';
import { Post_Orm } from '../../posts/entites/orm_post';
import { Post_like_Orm } from '../../posts/entites/orm_post.likes';
import { Session_Orm } from '../../security/entites/orm_session';
import { User_Orm } from '../../users/entites/user.orm.entities';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(User_Orm) protected userRepository: Repository<User_Orm>,
    @InjectRepository(Session_Orm) protected sessionRepository: Repository<Session_Orm>,
    @InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>,
    @InjectRepository(Blog_Orm) protected blogRepository: Repository<Blog_Orm>,
    @InjectRepository(Comment_Orm) protected commentRepository: Repository<Comment_Orm>,
    @InjectRepository(Comment_like_Orm) protected commentLikeOrmRepository: Repository<Comment_like_Orm>,
    @InjectRepository(Post_like_Orm) protected postLikeOrmRepository: Repository<Post_like_Orm>,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async clearBd(): Promise<void> {
    await this.commentLikeOrmRepository.delete({});
    await this.postLikeOrmRepository.delete({});
    await this.sessionRepository.delete({});
    await this.commentRepository.delete({});
    await this.postRepository.delete({});
    await this.blogRepository.delete({});
    await this.userRepository.delete({});

    await this.dataSource.query(`DELETE  FROM public.sessions CASCADE`);
    await this.dataSource.query(`DELETE  FROM public.post_likes CASCADE`);
    await this.dataSource.query(`DELETE  FROM public.comments_likes CASCADE`);
    await this.dataSource.query(`DELETE  FROM public.comments CASCADE`);
    await this.dataSource.query(`DELETE FROM public.users CASCADE`);
    await this.dataSource.query(`DELETE FROM public.posts CASCADE`);
    await this.dataSource.query(`DELETE FROM public.blogs CASCADE`);

    return;
  }
}
