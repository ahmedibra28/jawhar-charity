import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import moment from 'moment'
import { accounts } from '../../../utils/accounts'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { account, startDate, endDate, transactionType } = req.body

      const start = moment(startDate).startOf('day')
      const end = moment(endDate).endOf('day')

      const days = moment.duration(end.diff(start)).asDays()

      if (days > 366)
        return res
          .status(400)
          .json({ error: 'Date range exceeded with 365 days ' })

      if (start > end)
        return res
          .status(400)
          .json({ error: 'Start date must be before end date' })

      if (!accounts.map((acc) => acc.name).includes(account))
        return res.status(400).json({ error: 'Account is not found!' })

      const transactions = await Transaction.find(
        {
          account,
          transactionType,
          date: { $gte: start, $lte: end },
        },
        {
          amount: 1,
          account: 1,
          date: 1,
          description: 1,
          transactionType: 1,
          donor: 1,
        }
      )
        .lean()
        .sort({ date: -1 })
        .populate('donor', ['name'])

      res.json(transactions)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
