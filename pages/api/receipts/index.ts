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
      const q = req.query.q

      const searchDonor = async (q: string) => {
        const donor = await Donor.find({
          name: { $regex: q, $options: 'i' },
        })

        return donor
      }

      const donor = q ? await searchDonor(q) : []

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

      let result = await query

      result = result?.map((trans) => ({
        ...trans,
        duration: Math.round(trans?.totalAmount / trans.amount) || undefined,
      }))

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
      const { donor, account, totalAmount, date, description, isPaid } =
        req.body
      let duration = req.body.duration || 1

      if (!['Orphans', 'Education'].includes(account)) {
        duration = 1
      }

      const reference = uuidv4()

      if (Number(totalAmount) < 1 || Number(duration) < 1)
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

      const promiseCheck = Promise.all(
        Array(Number(duration))
          .fill(Number(totalAmount) / Number(duration))
          .map(async (amount, i: number) => {
            const startDate = moment(date).add(i, 'months').startOf('month')
            const endDate = moment(date).add(i, 'months').endOf('month')

            const newReceipt = await Transaction.findOne({
              date: { $gte: startDate, $lte: endDate },
              donor: checkDonor._id,
              account,
            })

            if (newReceipt)
              return res
                .status(400)
                .json({ error: `Donor has already donated on ${date} date` })

            return 'ok'
          })
      )

      const v = await promiseCheck
      if (v.includes(undefined)) return

      const createData = []

      await Promise.all(
        Array(Number(duration))
          .fill(Number(totalAmount) / Number(duration))
          .map(async (amount, i: number) => {
            const newAmount = duration > 0 && i === 0 ? totalAmount : undefined

            createData.push({
              donor: checkDonor._id,
              account,
              description:
                description ||
                `$${amount.toFixed(2)} from ${
                  checkDonor.name
                } to ${account} at ${date}`,
              amount,
              totalAmount: Number(newAmount) || undefined,
              transactionType: 'credit',
              date: moment(date || Date.now()).add(i, 'months'),
              reference,
              isPaid,
              createdBy: req.user._id,
            })
          })
      )

      const create = await Transaction.insertMany(createData)
      if (!create)
        return res.status(400).json({ error: 'Error transaction creating' })

      res.send(create)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
