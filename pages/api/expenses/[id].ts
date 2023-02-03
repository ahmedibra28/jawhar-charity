import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import { accounts } from '../../../utils/accounts'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { id } = req.query
      const { account, amount, date, description } = req.body

      const object = await Transaction.findById(id)
      if (!object)
        return res.status(400).json({ error: `Transaction not found` })

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

      if (
        Number(totalCredit) - Number(totalDebit) + Number(object.amount) <
        Number(amount)
      )
        return res
          .status(400)
          .json({ error: `un-sufficient funds for ${account} account` })

      object.date = date
      object.description = description
      object.account = account
      object.amount = amount
      object.updatedBy = req.user._id
      await object.save()

      res.status(200).json(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { id } = req.query
      const object = await Transaction.findById(id)
      if (!object)
        return res.status(400).json({ error: `Transaction not found` })

      await object.remove()
      res.status(200).json({ message: `Transaction removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
