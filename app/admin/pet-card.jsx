"use client"

import Link from "next/link"
import { useState } from "react"

export default function PetCard(props) {
  const [isDeleted, setIsDeleted] = useState(false)
  const pet = props.pet

  async function handleDeleteClick() {
    // send fetch request to backend route using pet._id
    const deletePromise = await fetch("/admin/delete-pet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ _id: pet._id })
    })

    // delete from dom
    setIsDeleted(true)

    const deleteInfo = await deletePromise.json()
    console.log(deleteInfo)
  }

  function petPhoto(photo) {
    if (pet.photo) {
      return <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload/w_660,h_784,c_fill/${pet.photo}.jpg`} alt={`A ${pet.species} named ${pet.name}`} />
    } else {
      return <img src="/images/fallback.jpg" alt={`A ${pet.species} named ${pet.name}`} />
    }
  }

  if (isDeleted) {
    return <></>
  }

  return (
    <div key={pet._id} className="pet-card" data-species="<%= pet.species %>">
      <div className="pet-card-text">
        <h3>{pet.name}</h3>
        <p className="pet-description">{pet.description}</p>
        <div className="action-buttons">
          <Link href={`/admin/edit-pet/${pet._id}`} className="action-btn">
            Edit
          </Link>
          <Link href={`/admin/view-pet-contacts/${pet._id}`} className="action-btn">
            View Contacts
          </Link>
          <button className="action-btn" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
      <div className="pet-card-photo">{petPhoto(pet.photo)}</div>
    </div>
  )
}
