import Link from "next/link"
import clientPromise from "../../lib/mongodb"
import PetCard from "./pet-card"

async function fetchPets() {
  const client = await clientPromise
  let pets = await client.db().collection("pets").find().toArray()
  console.log("========== db hit =============")

  // return the pets object
  pets = pets.map(pet => {
    pet._id = pet._id.toString()
    return pet
  })

  return pets
}

export default async function Dashboard() {
  const pets = await fetchPets()

  return (
    <>
      <div className="page-section">
        <div className="page-section-inner">

          <Link href="/" className="small-link">
            &laquo; Back to homepage
          </Link>

          <h1 className="page-section-title mb-big">Manage Pets</h1>
          <div>
            <Link href="/admin/create-pet" className="add-pet-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
              </svg>
              Add New Pet
            </Link>
          </div>

          <div className="list-of-pets" style={{ paddingTop: "30px" }}>
            {pets.map(pet => {
              pet._id = pet._id.toString()
              return <PetCard key={pet._id} pet={pet} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}
