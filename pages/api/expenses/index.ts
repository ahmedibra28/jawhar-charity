import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { accounts } from '../../../utils/accounts'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const q = req.query && req.query.q

      let query = Transaction.find(
        q
          ? { account: { $regex: q, $options: 'i' }, transactionType: 'debit' }
          : { transactionType: 'debit' }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Transaction.countDocuments(
        q
          ? { account: { $regex: q, $options: 'i' }, transactionType: 'debit' }
          : { transactionType: 'debit' }
      )

      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize).sort({ date: -1 }).lean()

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { account, amount, date, description } = req.body
      const reference = uuidv4()

      if (Number(amount) < 1)
        return res
          .status(400)
          .json({ error: `Amount can't be a negative or zero.` })

      if (!accounts.map((acc) => acc.name).includes(account))
        return res.status(400).json({ error: 'Account is not found!' })

      const creditTransactions = await Transaction.aggregate([
        {
          $match: {
            transactionType: 'credit',
            isPaid: true,
          },
        },
        {
          $group: {
            _id: '$account',
            amount: {
              $sum: '$amount',
            },
          },
        },
        {
          $match: {
            _id: account,
          },
        },
      ])

      const debitTransactions = await Transaction.aggregate([
        {
          $match: {
            transactionType: 'debit',
          },
        },
        {
          $group: {
            _id: '$account',
            amount: {
              $sum: '$amount',
            },
          },
        },
        {
          $match: {
            _id: account,
          },
        },
      ])

      const totalDebit = debitTransactions?.[0]?.amount || 0
      const totalCredit = creditTransactions?.[0]?.amount || 0

      if (Number(totalCredit) - Number(totalDebit) < Number(amount))
        return res
          .status(400)
          .json({ error: `un-sufficient funds for ${account} account` })

      const obj = await Transaction.create({
        account,
        description:
          description ||
          `$${Number(amount).toFixed(2)} from ${account} at ${date}`,
        amount,
        transactionType: 'debit',
        date: moment(date || Date.now()).format(),
        reference,
        createdBy: req.user._id,
      })

      if (!obj) return res.status(404).json({ error: 'Error expense creating' })

      res.json(obj)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
