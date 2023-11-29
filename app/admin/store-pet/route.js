import clientPromise from "../../../lib/mongodb"
import { NextResponse } from "next/server"
const cloudinary = require("cloudinary").v2
const sanitizeHtml = require("sanitize-html")

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDNAME,
  api_key: process.env.PUBLIC_CLOUDINARYKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
})

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {}
}

export async function POST(request) {
  const incoming = await request.json()

  let ourObject = { name: sanitizeHtml(incoming.name, sanitizeOptions), birthYear: new Date().getFullYear(), species: sanitizeHtml(incoming.species, sanitizeOptions), description: sanitizeHtml(incoming.description, sanitizeOptions) }

  if (incoming.birthYear > 999 && incoming.birthYear < 9999) {
    ourObject.birthYear = incoming.birthYear
  }

  if (ourObject.species != "cat" && ourObject.species != "dog") {
    ourObject.species = "dog"
  }

  const expectedSignature = cloudinary.utils.api_sign_request({ public_id: incoming.public_id, version: incoming.version }, cloudinaryConfig.api_secret)
  if (expectedSignature === incoming.signature) {
    ourObject.photo = incoming.public_id
  }

  const client = await clientPromise
  client.db().collection("pets").insertOne(ourObject)
  return NextResponse.json({ message: "Success" })
}
