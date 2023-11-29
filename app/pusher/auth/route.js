import { cookies } from "next/headers"
import { NextResponse } from "next/server"
const Pusher = require("pusher")

export async function POST(request) {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get("petadoption") ? cookieStore.get("petadoption").value : ""

  if (adminCookie == process.env.SESSIONCOOKIEVALUE) {
    const pusher = new Pusher({
      appId: process.env.PUSHERID,
      key: process.env.PUSHERKEY,
      secret: process.env.PUSHERSECRET,
      cluster: "us3",
      useTLS: true
    })

    const ourData = await request.formData()
    const theSocketId = ourData.get("socket_id")
    const authResponse = pusher.authorizeChannel(theSocketId, "private-petchat")
    return NextResponse.json(authResponse)
  }

  return NextResponse.json({ message: "Message sent" })
}
