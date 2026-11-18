//? Imports de codigo
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  versionKey: false,
  timestamps: false,
})
export class Address {
  @Prop({ required: true, type: String, trim: true })
  country: string;

  @Prop({ required: true, type: String, trim: true })
  city: string;

  @Prop({ required: true, type: String, trim: true })
  postalCode: string;

  @Prop({ required: true, type: String, trim: true })
  street: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
