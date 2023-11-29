import { ObjectId } from "mongodb"
import clientPromise from "../../lib/mongodb"
import { NextResponse } from "next/server"
const sanitizeHtml = require("sanitize-html")
const nodemailer = require("nodemailer")

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {}
}

export async function POST(request) {
  const incoming = await request.json()

  console.log(incoming)
  // borrow code from express version etc...
  if (incoming.answer.toUpperCase() !== "PUPPY") {
    return NextResponse.json({ message: "Sorry" })
  }

  const ourObject = {
    name: sanitizeHtml(incoming.name, sanitizeOptions),
    email: sanitizeHtml(incoming.email, sanitizeOptions),
    comment: sanitizeHtml(incoming.comment, sanitizeOptions)
  }

  if (!ObjectId.isValid(incoming.petId)) {
    return NextResponse.json({ message: "Bad id" })
  }

  ourObject.petId = new ObjectId(incoming.petId)
  const client = await clientPromise
  const doesPetExist = await client
    .db()
    .collection("pets")
    .findOne({ _id: new ObjectId(ourObject.petId) })

  if (doesPetExist) {
    await client.db().collection("contacts").insertOne(ourObject)

    // send mailtrap emails here
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAPUSERNAME,
        pass: process.env.MAILTRAPPASSWORD
      }
    })

    transport.sendMail({
      to: ourObject.email,
      from: "admin@localhost",
      subject: `Thank you for your interest in ${doesPetExist.name}`,
      html: `<h3 style="color: #475aff; font-size: 30px; font-weight: normal;">Thank you!</h3><p>We appreciate your interest in ${doesPetExist.name} and one of our staff members will reach out to you shortly! Below is a copy of the message you sent us for your personal recrods:</p><p><em>${ourObject.comment}</em></p>`
    })

    transport.sendMail({
      to: "adoptioncenter@localhost",
      from: "admin@localhost",
      subject: `Someone is interested in ${doesPetExist.name}`,
      html: `<h3 style="color: #475aff; font-size: 30px; font-weight: normal;">New Contact!</h3><p>
      Name: ${ourObject.name} <br>
      Pet Interested In: ${doesPetExist.name}<br>
      Email: ${ourObject.email}<br>
      Message: ${ourObject.comment}
      </p>`
    })

    console.log("email sent")

    return NextResponse.json({ message: "Success" })
  }

  res.json({ message: "No way" })

  // check for puppy as the answer etc...

  // build an object and sanitize it.

  // const client = await clientPromise
  // client.db().collection("pets").insertOne(ourObject)
  return NextResponse.json({ message: "No way" })
}
