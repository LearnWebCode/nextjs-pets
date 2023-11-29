"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

const CreatePage = () => {
  const router = useRouter()
  const [isFormLocked, setIsFormLocked] = useState(false)
  const [initialSignature, setInitialSignature] = useState()
  const [timestamp, setTimestamp] = useState()
  const [public_id, setPublic_id] = useState()
  const [version, setVersion] = useState()
  const [signature, setSignature] = useState()
  const [previewSrc, setPreviewSrc] = useState("/images/fallback.jpg")

  useEffect(() => {
    async function go() {
      const infoPromise = await fetch("/admin/get-signature")
      const infoData = await infoPromise.json()
      setInitialSignature(infoData.signature)
      setTimestamp(infoData.timestamp)
    }
    go()
  }, [])

  async function handleFileChange(e) {
    const data = new FormData()
    data.append("file", e.target.files[0])
    data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARYKEY)
    data.append("signature", initialSignature)
    data.append("timestamp", timestamp)

    setIsFormLocked(true)

    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/auto/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: function (e) {
        console.log(e.loaded / e.total)
      }
    })
    console.log(cloudinaryResponse.data)
    setPublic_id(cloudinaryResponse.data.public_id)
    setVersion(cloudinaryResponse.data.version)
    setSignature(cloudinaryResponse.data.signature)
    setPreviewSrc(`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload/w_190,h_190,c_fill/${cloudinaryResponse.data.public_id}.jpg`)

    setIsFormLocked(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isFormLocked) {
      setIsFormLocked(true)

      const data = {
        name: event.target.name.value,
        species: event.target.species.value,
        description: event.target.description.value,
        birthYear: event.target.birthYear.value
      }

      if (public_id) {
        data.public_id = public_id
        data.version = version
        data.signature = signature
      }

      const response = await fetch("/admin/store-pet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()

      // call router refresh so that when we get redirected to admin homepage it actually fetches the newest updated data
      router.replace("/admin")
      router.refresh()
    }
  }

  return (
    <>
      <div className="page-section">
        <div className="page-section-inner">
          <Link href="/admin" className="small-link">
            &laquo; Back to admin dashboard
          </Link>

          <h1 className="page-section-title mb-big">Add New Pet</h1>
          <form onSubmit={handleSubmit} id="manage-pet-form" action="/admin/store-pet" method="POST">
            <input className="form-field" type="text" name="name" autoComplete="off" placeholder="name" />
            <input className="form-field" type="text" name="birthYear" autoComplete="off" placeholder="Year born (e.g. 2019)" />
            <select className="form-field" name="species">
              <option>dog</option>
              <option>cat</option>
            </select>
            <textarea className="form-field" name="description" placeholder="Description..."></textarea>

            <input className="form-field" id="file-field" type="file" onChange={handleFileChange} />

            <div className="photo-preview">
              <img src={previewSrc} />
            </div>

            <input id="public_id" type="hidden" name="public_id" />
            <input id="version" type="hidden" name="version" />
            <input id="signature" type="hidden" name="signature" />
            <button style={{ opacity: isFormLocked ? ".1" : "1" }} id="submit-btn" className="our-btn">
              Add New Pet
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreatePage
