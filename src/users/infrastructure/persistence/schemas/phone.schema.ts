//? Imports de codigo
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class Phone {
  @Prop({ required: true, type: String, trim: true, minlength: 2, maxlength: 2 })
  cca2: string;

  @Prop({ required: true, type: String, trim: true, minlength: 1, maxlength: 5 })
  code: string;

  @Prop({ required: true, type: String, trim: true, minlength: 7, maxlength: 15 })
  number: string;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
