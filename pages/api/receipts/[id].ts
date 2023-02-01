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
      const { account, totalAmount, date, description } = req.body

      if (Number(totalAmount) < 1)
        return res
          .status(400)
          .json({ error: `Amount can't be a negative or zero.` })

      const object = await Transaction.findById(id)
      if (!object)
        return res.status(400).json({ error: `Transaction not found` })

      if (!accounts.map((acc) => acc.name).includes(account))
        return res.status(400).json({ error: 'Account is not found!' })

      object.date = date
      object.description = description
      object.account = account
      object.amount = totalAmount
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
