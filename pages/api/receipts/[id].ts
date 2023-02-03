import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import { accounts } from '../../../utils/accounts'
import moment from 'moment'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { id } = req.query
      const { account, totalAmount, date, description, isPaid } = req.body

      if (Number(totalAmount) < 1)
        return res
          .status(400)
          .json({ error: `Amount can't be a negative or zero.` })

      const object = await Transaction.findById(id)
      if (!object)
        return res.status(400).json({ error: `Transaction not found` })

      if (!accounts.map((acc) => acc.name).includes(account))
        return res.status(400).json({ error: 'Account is not found!' })

      const startDate = moment(date).startOf('month')
      const endDate = moment(date).endOf('month')

      const newReceipt = await Transaction.findOne({
        date: { $gte: startDate, $lte: endDate },
        donor: object.donor,
        account,
        _id: { $ne: id },
      })

      if (newReceipt)
        return res
          .status(400)
          .json({ error: `Donor has already donated on ${date} date` })

      object.date = date
      object.description = description
      object.account = account
      object.amount = totalAmount
      object.isPaid = isPaid
      object.updatedBy = req.user._id

      await object.save()

      res.status(200).json({ message: `Donor updated` })
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
