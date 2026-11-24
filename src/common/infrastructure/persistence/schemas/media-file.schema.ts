//? Imports de codigo
import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { MediaExtension, MediaMimeType } from '@common/domain/enums';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
})
export class MediaFile {
  @Prop({
    required: true,
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  url: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
  })
  key: string;

  @Prop({
    required: false,
    type: String,
    trim: true,
  })
  thumbnailUrl?: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 255,
  })
  originalName: string;

  @Prop({
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    enum: MediaExtension,
  })
  extension: MediaExtension;

  @Prop({
    required: true,
    type: String,
    lowercase: true,
    trim: true,
    enum: MediaMimeType,
  })
  mimeType: MediaMimeType;

  @Prop({
    required: true,
    type: Number,
    min: 1,
  })
  size: number;

  @Prop({
    required: false,
    type: Number,
    min: 1,
  })
  duration?: number;

  //? Campos de auditoría
  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);
