import { Schema, model, models } from 'mongoose'
import User from './User'
import Donor from './Donor'

export interface ITransaction {
  _id: Schema.Types.ObjectId
  donor?: Schema.Types.ObjectId
  account: string
  amount: number
  date: Date
  reference: string
  description: string
  transactionType: string

  createdAt: Date
  createdBy: Schema.Types.ObjectId
  updatedBy: Schema.Types.ObjectId
}

const transactionSchema = new Schema<ITransaction>(
  {
    donor: { type: Schema.Types.ObjectId, ref: Donor },
    account: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: new Date() },
    description: String,
    transactionType: {
      type: String,
      enum: ['credit', 'debit'],
      default: 'credit',
    },
    reference: { type: String, required: true },

    createdBy: { type: Schema.Types.ObjectId, ref: User, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: User },
  },
  { timestamps: true }
)

const Transaction =
  models.Transaction || model('Transaction', transactionSchema)

export default Transaction
