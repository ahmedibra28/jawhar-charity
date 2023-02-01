import { Schema, model, models } from 'mongoose'
import User from './User'

export interface IDonor {
  _id: Schema.Types.ObjectId
  name: string
  gender: string
  status: string
  country: string
  mobile: number
  createdAt: Date
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const donorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ['Male', 'Female'] },
    country: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true },

    status: { type: String, required: true, enum: ['active', 'disabled'] },
    createdBy: { type: Schema.Types.ObjectId, ref: User, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

const Donor = models.Donor || model('Donor', donorSchema)

export default Donor
