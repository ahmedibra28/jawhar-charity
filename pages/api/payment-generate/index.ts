import nc from 'next-connect'
// import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import Donor from '../../../models/Donor'

const handler = nc()
// handler.use(isAuth)

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const today = moment().format()
      const accounts = ['Orphans', 'Education']
      const donors = await Donor.find({ status: 'active' }, { _id: 1 }).lean()

      const startMonth = moment(today).startOf('month')
      const endMonth = moment(today).endOf('month')

      const transactions = await Transaction.find(
        {
          account: { $in: accounts },
          transactionType: 'credit',
          date: { $gte: startMonth, $lte: endMonth },
        },
        { donor: 1, account: 1 }
      ).lean()

      let transactionsArray = transactions.map((trans) => ({
        donor: trans?.donor?.toString(),
        account: trans?.account,
      }))

      const donors1 = donors.map((donor) => ({
        donor: donor?._id?.toString(),
        account: 'Orphans',
      }))
      const donors2 = donors.map((donor) => ({
        donor: donor?._id?.toString(),
        account: 'Education',
      }))

      let donorsArray = [...donors1, ...donors2]

      transactionsArray = transactionsArray?.map(
        (value) => `${value.donor}-${value.account}`
      )
      donorsArray = donorsArray?.map(
        (value) => `${value.donor}-${value.account}`
      )

      const newValue = []
      const result = []

      donorsArray?.forEach((value) => {
        if (!transactionsArray?.includes(value)) {
          newValue.push(value)
          result.push({
            donor: value?.split('-')[0],
            account: value?.split('-')[1],
          })
        }
      })

      const save = []
      await Promise.all(
        result?.map(async (value) => {
          save.push({
            donor: value?.donor,
            account: value?.account,
            description: `Payment on ${value?.account} Account`,
            amount: 0,
            totalAmount: 0,
            transactionType: 'credit',
            date: moment().format(),
            reference: uuidv4(),
            isPaid: false,
            createdBy: '5063114bd386d8fadbd6b00a',
          })
        })
      )

      const create = await Transaction.insertMany(save)

      if (!create) return res.status(400).json({ error: 'Error creating' })

      res.send('success')
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
