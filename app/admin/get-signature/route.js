import { NextResponse } from "next/server"
const cloudinary = require("cloudinary").v2

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDNAME,
  api_key: process.env.PUBLIC_CLOUDINARYKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})

export async function GET(request) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp
    },
    cloudinaryConfig.api_secret
  )

  return NextResponse.json({ timestamp, signature })
}
