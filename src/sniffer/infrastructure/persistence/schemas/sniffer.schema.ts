//? Imports de codigo
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { Collections, MethodsHttp } from '@common/infrastructure/enums';
import { HttpStatus } from '@nestjs/common';

@Schema({
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
  collection: Collections.SNIFFER,
})
export class Sniffer extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: false, type: String })
  auth?: string;

  @Prop({ required: false, type: Types.ObjectId })
  userId?: Types.ObjectId;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  ip: string;

  @Prop({ required: true, type: Object })
  request: any;

  @Prop({ required: false, type: Object })
  response?: any;

  @Prop({ required: false, type: Object })
  headers?: any;

  @Prop({ required: true, type: String, enum: MethodsHttp })
  method: MethodsHttp;

  @Prop({ required: true, type: Number, enum: HttpStatus })
  statusCode: HttpStatus;

  @Prop({ required: true, type: Number })
  processingTime: number;

  @Prop({ required: false, type: String })
  userAgent?: string;

  @Prop({ required: false, type: String })
  referer?: string;

  @Prop({ required: true, type: String })
  appVersion: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: Date })
  updatedAt: Date;
}

export const SnifferSchema = SchemaFactory.createForClass(Sniffer);
