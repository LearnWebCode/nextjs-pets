const { ObjectId } = require("mongodb")
import clientPromise from "../../../lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request) {
  const incoming = await request.json()

  // check if it's a valid object id
  if (ObjectId.isValid(incoming._id)) {
    const client = await clientPromise
    client
      .db()
      .collection("pets")
      .deleteOne({ _id: new ObjectId(incoming._id) })
    return NextResponse.json({ message: "Success" })
  }

  return NextResponse.json({ message: "Failed" })
}
