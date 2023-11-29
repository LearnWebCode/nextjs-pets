import { NextResponse } from "next/server"

export async function POST(request) {
  const incoming = await request.json()

  if (incoming.username == process.env.ADMINUSERNAME && incoming.password == process.env.ADMINPASSWORD) {
    const response = NextResponse.json({ message: "Success" })
    response.cookies.set({
      name: "petadoption",
      value: process.env.SESSIONCOOKIEVALUE,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 365
    })

    return response
  } else {
    return NextResponse.json({ message: "Failed" })
  }
}
