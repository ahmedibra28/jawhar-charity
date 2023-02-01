import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import Donor from '../../../models/Donor'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { donor, startDate, endDate } = req.body

      const start = moment(startDate).startOf('day')
      const end = moment(endDate).endOf('day')

      if (start > end)
        return res
          .status(400)
          .json({ error: 'Start date must be before end date' })

      const days = moment.duration(end.diff(start)).asDays()

      if (days > 366)
        return res
          .status(400)
          .json({ error: 'Date range exceeded with 365 days ' })

      const donorObj = await Donor.findOne({ name: donor })
      if (!donorObj) return res.status(404).json({ error: 'Donor not found' })

      const transactions = await Transaction.find(
        {
          donor: donorObj._id,
          date: { $gte: start, $lte: end },
        },
        {
          donor: 1,
          amount: 1,
          account: 1,
          date: 1,
          description: 1,
        }
      )
        .lean()
        .populate('donor', ['name', 'mobile'])

      res.json(transactions)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
