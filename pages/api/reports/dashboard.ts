import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Transaction from '../../../models/Transaction'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const runningMonth = moment().subtract(0, 'months').format()
      const sixMonthsAgo = moment().subtract(12, 'months').format()
      const startOfMonth = moment(sixMonthsAgo).startOf('month').format()
      const endOfMonth = moment(runningMonth).endOf('month').format()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const emptyArray = [...Array(12).keys()]

      const transactions = await Transaction.find(
        { date: { $gte: startOfMonth, $lte: endOfMonth } },
        { amount: 1, account: 1, transactionType: 1, date: 1 }
      ).lean()

      const lastYear = () => {
        const months: any[] = []
        moment().startOf('month')

        const arr = emptyArray

        arr.forEach((i) => {
          months.push(
            moment().startOf('month').subtract(i, 'month').format('MMMM YYYY')
          )
        })

        return months.reverse()
      }

      const month = (index: number, account: string) => {
        const mth: any = []
        transactions
          ?.filter(
            (trans) =>
              moment(trans.date).format('MMMM YYYY') ===
              lastYear().reverse()[index]
          )
          ?.map((m) => mth.push(m))

        return (
          Number(
            mth.reduce(
              (acc: any, curr: any) =>
                acc +
                Number(
                  curr &&
                    curr.account === account &&
                    curr.transactionType === 'credit' &&
                    curr.amount
                ),
              0
            )
          ) -
          Number(
            mth.reduce(
              (acc: any, curr: any) =>
                acc +
                Number(
                  curr &&
                    curr.account === account &&
                    curr.transactionType === 'debit' &&
                    curr.amount
                ),
              0
            )
          )
        )
      }

      const chartData = {
        ramadan: emptyArray.map((n) => month(n, 'Ramadan'))?.reverse(),
        eid: emptyArray.map((n) => month(n, 'Eid'))?.reverse(),
        orphans: emptyArray.map((n) => month(n, 'Orphans'))?.reverse(),

        lastYear: lastYear(),
      }

      const totalAccounts = async (account: string) => {
        const creditTransactions = await Transaction.aggregate([
          {
            $match: {
              transactionType: 'credit',
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

        return totalCredit - totalDebit
      }

      const currentBalanceOnEidAcc = await totalAccounts('Eid')
      const currentBalanceOnRamadanAcc = await totalAccounts('Ramadan')
      const currentBalanceOnOrphansAcc = await totalAccounts('Orphans')

      res.json({
        chartData,
        balance: {
          currentBalanceOnEidAcc,
          currentBalanceOnRamadanAcc,
          currentBalanceOnOrphansAcc,
        },
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
