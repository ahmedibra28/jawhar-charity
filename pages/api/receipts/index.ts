import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import Donor from '../../../models/Donor'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { accounts } from '../../../utils/accounts'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const q = req.query && req.query.q
      let donor = []

      if (q) {
        donor = await Donor.find({
          $or: [{ name: { $regex: q, $options: 'i' }, mobile: q }],
        })
      }

      let query = Transaction.find(
        donor?.length > 0
          ? {
              donor: { $in: [donor?.map((d) => d._id)] },
              transactionType: 'credit',
            }
          : { transactionType: 'credit' }
      )

      const page = parseInt(req.query.page) || 1
      const pageSize = parseInt(req.query.limit) || 25
      const skip = (page - 1) * pageSize
      const total = await Transaction.countDocuments(
        donor?.length > 0
          ? {
              donor: { $in: [donor?.map((d) => d._id)] },
              transactionType: 'credit',
            }
          : { transactionType: 'credit' }
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ date: -1 })
        .lean()
        .populate('donor', ['name'])

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
      const { donor, account, totalAmount, date, description } = req.body
      const duration = req.body.duration || 1

      const reference = uuidv4()

      if (
        Number(totalAmount) < 1 ||
        Number(duration) < 1 ||
        Number(totalAmount) === Number(duration)
      )
        return res
          .status(400)
          .json({ error: `Amount can't be a negative or zero.` })

      const checkDonor = await Donor.findOne({
        name: donor,
        status: 'active',
      })

      if (!checkDonor)
        return res.status(400).json({ error: 'Donor is not found!' })

      if (!accounts.map((acc) => acc.name).includes(account))
        return res.status(400).json({ error: 'Account is not found!' })

      Promise.all(
        Array(Number(duration))
          .fill(Number(totalAmount) / Number(duration))
          .map(async (amount, i: number) => {
            await Transaction.create({
              donor: checkDonor._id,
              account,
              description:
                description ||
                `$${amount.toFixed(2)} from ${
                  checkDonor.name
                } to ${account} at ${date}`,
              amount,
              transactionType: 'credit',
              date: moment(date || Date.now()).add(i, 'months'),
              reference,
              createdBy: req.user._id,
            })
          })
      )
        .then(() => res.send('success'))
        .catch(() => res.status(400).json({ error: 'Transaction error' }))
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
