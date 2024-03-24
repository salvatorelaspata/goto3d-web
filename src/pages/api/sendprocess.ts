// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendToQueue } from '@/utils/amqpClient'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    id: number
    ok: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method === 'POST') {
    const { id } = req.body
    try {
        await sendToQueue(id)
        res.status(200).json({ id, ok: true })
    } catch (error) {
        res.status(500).json({ id, ok: false })
    }
  }
}
