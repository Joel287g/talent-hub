//? Imports de codigo
import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { LoggerLevel, LoggerMessage, LoggerMessages, LoggerTypes } from '@logger/domain/enums';

@Schema({
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
  collection: 'logger',
})
export class Logger extends Document {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(LoggerMessages).flatMap((value) =>
      Object.values(value).map((value) => value),
    ),
  })
  message: LoggerMessage;

  @Prop({ required: true, type: String, enum: LoggerLevel })
  level: LoggerLevel;

  @Prop({ required: true, type: String, enum: LoggerTypes })
  type: LoggerTypes;

  @Prop({ required: true, type: {} })
  data: Record<string, unknown>;
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
