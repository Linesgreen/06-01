import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OutputBlogType } from '../types/output';
import { BlogUpdateType } from '../types/input';

@Schema()
export class Blog {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({
    required: true,
  })
  isMembership: boolean;

  toDto(): OutputBlogType {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      isMembership: this.isMembership,
    };
  }
  updateBlog(params: BlogUpdateType) {
    this.name = params.name;
    this.description = params.description;
    this.websiteUrl = params.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogsDocument = HydratedDocument<Blog>;
