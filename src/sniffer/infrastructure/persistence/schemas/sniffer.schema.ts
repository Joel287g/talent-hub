//? Imports de codigo
import { METHODS } from 'http';

import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//? Imports de usuario
import { Collections } from '@common/domain/enums';

@Schema({
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: false, getters: false },
  collection: Collections.SNIFFER,
})
export class Sniffer extends Document {
  @Prop({ required: false, type: String })
  auth?: string;

  @Prop({ required: false, type: Types.ObjectId })
  userId?: Types.ObjectId;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  ip: string;

  //* Opcional: una petición sin cuerpo (ej. POST vacío u OPTIONS) llega con `undefined`
  @Prop({ required: false, type: Object })
  request?: any;

  @Prop({ required: false, type: Object })
  response?: any;

  @Prop({ required: true, type: Object })
  headers: any;

  //* Cualquier método que acepte el servidor HTTP de Node: los no habituales (ej. TRACE) son justo los que interesa auditar
  @Prop({ required: true, type: String, enum: METHODS })
  method: string;

  //* Rango HTTP completo: el enum `HttpStatus` no incluye todos los códigos (ej. 431)
  @Prop({ required: true, type: Number, min: 100, max: 599 })
  statusCode: number;

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
