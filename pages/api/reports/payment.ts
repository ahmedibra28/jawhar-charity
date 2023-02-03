import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { startDate, endDate, status } = req.body

      if (!startDate || !endDate || !status)
        return res.status(400).json({ error: 'Filter fields are required' })

      let start: any = ''
      let end: any = ''

      if (startDate && endDate && status) {
        start = moment(startDate).startOf('day')
        end = moment(endDate).endOf('day')

        if (start > end)
          return res
            .status(400)
            .json({ error: 'Start date must be before end date' })

        const days = moment.duration(end.diff(start)).asDays()

        if (days > 366)
          return res
            .status(400)
            .json({ error: 'Date range exceeded with 365 days ' })
      }

      start = moment(startDate).startOf('month')
      end = moment(endDate).endOf('month')

      let query = await Transaction.find({
        date: { $gte: start, $lte: end },
        transactionType: 'credit',
        isPaid: status === 'unpaid' ? false : true,
      })
        .sort({ date: -1 })
        .lean()
        .populate('donor', ['name'])

      query = query?.map((trans) => ({
        ...trans,
        duration: Math.round(trans?.totalAmount / trans.amount) || undefined,
      }))

      res.status(200).json(query)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
