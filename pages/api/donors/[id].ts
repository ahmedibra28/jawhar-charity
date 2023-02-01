import nc from 'next-connect'
import { isAuth } from '../../../utils/auth'
import Donor from '../../../models/Donor'

const handler = nc()

handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    try {
      const { id } = req.query
      const { name, gender, status, country, mobile } = req.body

      const object = await Donor.findById(id)
      if (!object) return res.status(400).json({ error: `Donor not found` })

      const exist = await Donor.findOne({
        $or: [
          {
            mobile,
            _id: { $ne: id },
          },
          {
            name: { $regex: `^${name?.trim()}$`, $options: 'i' },
            _id: { $ne: id },
          },
        ],
      })

      if (exist)
        return res.status(400).json({ error: 'Duplicate donors detected' })

      object.name = name
      object.status = status
      object.gender = gender
      object.country = country
      object.mobile = mobile
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
      const object = await Donor.findById(id)
      if (!object) return res.status(400).json({ error: `Donor not found` })

      await object.remove()
      res.status(200).json({ message: `Donor removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
