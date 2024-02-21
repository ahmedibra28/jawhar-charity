import { NextResponse } from 'next/server'
import { getEnvVariable, getErrorResponse, s3Client } from '@/lib/helpers'
import { exec } from 'child_process'
import { promisify } from 'util'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'

const uploadObject = async (data: any, bucket: string) => {
  const params = {
    Bucket: 'sahalbook',
    Key: bucket,
    Body: data,
    ACL: 'public-read',
    Metadata: {
      'x-amz-meta-my-key': 'your-value',
    },
  }

  try {
    // @ts-ignore
    const data = await s3Client.send(new PutObjectCommand(params))

    return data
  } catch (err: any) {
    console.log('Error', err?.message)
    throw {
      message: err?.message,
      status: 500,
    }
  }
}

const execAsync = promisify(exec)

export async function POST(req: NextApiRequestExtended) {
  try {
    const currentDate = new Date().toISOString().slice(0, 10)
    const currentHour = new Date().getHours().toString().padStart(2, '0')
    // const currentMinute = new Date().getMinutes().toString().padStart(2, '0')

    const backupDir =
      getEnvVariable('NODE_ENV') === 'production'
        ? `/root/db/${currentDate}_${currentHour}`
        : `/Users/ahmed/Desktop/Dev/sahalbook/db/${currentDate}_${currentHour}`

    // Create the backup directory if it does not exist
    await execAsync(`mkdir -p ${backupDir}`)

    const DB_USER = getEnvVariable('DB_USER')
    const DB_PASS = getEnvVariable('DB_PASS')

    const execute = (dbName: string) =>
      `PGPASSWORD=${DB_PASS} pg_dump -U ${DB_USER} -h localhost -p 5432 -F d -j 4 ${dbName} -f "${backupDir}/${dbName}"`

    const databases = ['charity']

    await Promise.all(
      databases.map(async (dbName) => await execAsync(execute(dbName)))
    )

    const files = await fs.readdirSync(backupDir)

    const dirs = files
      ?.map((dir) => {
        console.log(dir)
        const file = fs.readdirSync(backupDir + '/' + dir)
        return file.map((f) => {
          const fullPath = backupDir + '/' + dir + '/' + f
          return fullPath
        })
      })
      ?.flat()

    await Promise.all(
      dirs.map(async (file) => {
        const data = await fs.createReadStream(file)
        return await uploadObject(data, `db/${file.split('/db/').pop()}`)
      })
    )

    return NextResponse.json({
      message: `Database backup successfully created and uploaded ${dirs.length} files`,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
