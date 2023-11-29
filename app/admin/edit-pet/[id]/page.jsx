import EditForm from "./edit-form"
import Link from "next/link"
import clientPromise from "../../../../lib/mongodb"
const { ObjectId } = require("mongodb")

export const metadata = {
  title: "Edit Existing Pet"
}

async function fetchPet(id) {
  const client = await clientPromise

  if (ObjectId.isValid(id)) {
    const pet = client
      .db()
      .collection("pets")
      .findOne({ _id: new ObjectId(id) })
    return pet
  }

  return undefined
}

const EditPage = async ({ params }) => {
  const pet = await fetchPet(params.id)

  if (!pet) {
    return (
      <div className="page-section">
        <div className="page-section-inner">
          <Link href="/admin" className="small-link">
            &laquo; Back to admin dashboard
          </Link>

          <h1 className="page-section-title mb-big">Not Found!</h1>
        </div>
      </div>
    )
  }

  pet._id = pet._id.toString()

  return (
    <>
      <div className="page-section">
        <div className="page-section-inner">
          <Link href="/admin" className="small-link">
            &laquo; Back to admin dashboard
          </Link>

          <h1 className="page-section-title mb-big">Update a Pet</h1>
          <EditForm pet={pet} />
        </div>
      </div>
    </>
  )
}

export default EditPage
