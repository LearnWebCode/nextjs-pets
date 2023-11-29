import { NextResponse } from "next/server"
const Pusher = require("pusher")
const sanitizeHtml = require("sanitize-html")

const fresh = "yes"

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {}
}

export async function POST(request) {
  const incoming = await request.json()
  const cleanMessage = sanitizeHtml(incoming.message.trim(), sanitizeOptions)

  if (cleanMessage) {
    const pusher = new Pusher({
      appId: process.env.PUSHERID,
      key: process.env.PUSHERKEY,
      secret: process.env.PUSHERSECRET,
      cluster: "us3",
      useTLS: true
    })

    await pusher.trigger(
      "private-petchat",
      "message",
      {
        message: cleanMessage
      },
      { socket_id: incoming.socket_id }
    )

    return NextResponse.json({ message: "Message sent" }, { status: 200 })
  }

  return NextResponse.json({ message: "Message not sent" })
}
