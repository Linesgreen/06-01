/* eslint-disable no-underscore-dangle,@typescript-eslint/explicit-function-return-type */

import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ErrorStatus, Result } from '../../../../infrastructure/object-result/objcet-result';
import { QueryPaginationResult } from '../../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../../../infrastructure/utils/createPagination';
import { PostQueryRepository } from '../../../posts/repositories/post/post.query.repository';
import { OutputPostType } from '../../../posts/types/output';
import { BlogsRepository } from '../../repositories/blog.repository';

export class GetPostForBlogCommand {
  constructor(
    public userId: number | null,
    public blogId: number,
    public sortData: QueryPaginationResult,
  ) {}
}

@CommandHandler(GetPostForBlogCommand)
export class GetPostForBlogUseCase implements ICommandHandler<GetPostForBlogCommand> {
  constructor(
    protected postQueryRepository: PostQueryRepository,
    protected blogRepository: BlogsRepository,
  ) {}

  async execute(command: GetPostForBlogCommand): Promise<Result<string | PaginationWithItems<OutputPostType>>> {
    const { userId, sortData, blogId } = command;

    await this.checkBlogExist(blogId);

    const posts = await this.findPostsForBlog(blogId, sortData, userId);
    await this.postQueryRepository.getPostsForBlog(sortData, userId, blogId);
    if (!posts) return Result.Err(ErrorStatus.NOT_FOUND, 'Posts not found');
    return Result.Ok(posts);
  }

  private async checkBlogExist(blogId: number) {
    const post = await this.blogRepository.getById(blogId);
    if (!post) throw new NotFoundException(`Blog ${blogId} not found`);
  }

  private async findPostsForBlog(blogId: number, sortData: QueryPaginationResult, userId: number | null) {
    const posts = await this.postQueryRepository.getPostsForBlog(sortData, userId, blogId);
    if (!posts?.items?.length) {
      return null;
    }
    return posts;
  }
}
