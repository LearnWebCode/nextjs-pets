"use client"

import { useState, useEffect } from "react"

export default function PetsListSection(props) {
  const [petInQuestion, setPetInQuestion] = useState({ name: "Placeholder", species: "placeholder", photo: "", _id: "abc123" })
  const [styleObject, setStyleObject] = useState({ display: "none" })
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [formWasJustSent, setFormWasJustSent] = useState(false)
  const [currentFilter, setCurrentFilter] = useState("all")
  const pets = props.pets

  async function contactSubmit(e) {
    e.preventDefault()

    const ourObject = {
      name: e.target.name.value,
      email: e.target.email.value,
      answer: e.target.answer.value,
      comment: e.target.comment.value,
      petId: petInQuestion._id
    }

    console.log(ourObject)

    setFormWasJustSent(true)
    setTimeout(() => {
      setFormWasJustSent(false)
    }, 2900)
    setTimeout(() => {
      setIsOverlayOpen(false)
      e.target.name.value = ""
      e.target.email.value = ""
      e.target.answer.value = ""
      e.target.comment.value = ""
    }, 2500)
    const formPromise = await fetch("/submit-contact-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ourObject)
    })
    const formResponse = await formPromise.json()
    console.log(formResponse)
  }

  useEffect(() => {
    setStyleObject({})
  }, [])

  function closeOverlay() {
    setIsOverlayOpen(false)
  }

  function handleContactClick(pet) {
    setPetInQuestion(pet)
    setIsOverlayOpen(true)
  }

  return (
    <>
      <div className="page-section" id="view-pets">
        <div className="page-section-inner">
          <h2 className="page-section-title">Meet Our Friends</h2>
          <div className="pet-filter">
            <p>
              Show me:{" "}
              <button className={currentFilter == "all" ? "active" : ""} onClick={() => setCurrentFilter("all")}>
                All Pets
              </button>{" "}
              <button onClick={() => setCurrentFilter("dog")} className={currentFilter == "dog" ? "active" : ""}>
                Only Dogs
              </button>{" "}
              <button onClick={() => setCurrentFilter("cat")} className={currentFilter == "cat" ? "active" : ""}>
                Only Cats
              </button>
            </p>
          </div>

          <div className="list-of-pets">
            {pets
              .filter(pet => {
                if (currentFilter == "all") {
                  return true
                }

                return currentFilter == pet.species
              })
              .map(pet => {
                function petPhoto(photo) {
                  if (pet.photo) {
                    return <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload/w_660,h_784,c_fill/${pet.photo}.jpg`} alt={`A ${pet.species} named ${pet.name}`} />
                  } else {
                    return <img src="/images/fallback.jpg" alt={`A ${pet.species} named ${pet.name}`} />
                  }
                }

                function generateAgeText(birthYear) {
                  const currentYear = new Date().getFullYear()
                  const age = currentYear - birthYear

                  if (age == 1) return "1 year old"

                  if (age == 0) return "Less than a year old"

                  return `${age} years old`
                }
                return (
                  <div key={pet._id.toString()} className="pet-card" data-species={pet.species}>
                    <div className="pet-card-text">
                      <h3>
                        <span className="pet-name">{pet.name}</span>

                        <button onClick={() => handleContactClick(pet)} className="pet-contact-btn" aria-label="Adopt Barksalot" data-id={pet._id.toString()}>
                          <svg aria-hidden="true" focusable="false" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_15_104)">
                              <path d="M3 3.5C2.20435 3.5 1.44129 3.81607 0.87868 4.37868C0.316071 4.94129 0 5.70435 0 6.5L0 18.515C0.00396529 19.308 0.321786 20.0673 0.883965 20.6266C1.44615 21.186 2.20694 21.5 3 21.5H11.25C11.4489 21.5 11.6397 21.421 11.7803 21.2803C11.921 21.1397 12 20.9489 12 20.75C12 20.5511 11.921 20.3603 11.7803 20.2197C11.6397 20.079 11.4489 20 11.25 20H3C2.66982 20 2.34884 19.8911 2.08686 19.6902C1.82487 19.4892 1.63652 19.2074 1.551 18.8885L10.011 13.682L12 14.8745L22.5 8.5745V13.25C22.5 13.4489 22.579 13.6397 22.7197 13.7803C22.8603 13.921 23.0511 14 23.25 14C23.4489 14 23.6397 13.921 23.7803 13.7803C23.921 13.6397 24 13.4489 24 13.25V6.5C24 5.70435 23.6839 4.94129 23.1213 4.37868C22.5587 3.81607 21.7956 3.5 21 3.5H3ZM8.562 12.812L1.5 17.1575V8.5745L8.562 12.812ZM1.5 6.8255V6.5C1.5 6.10218 1.65804 5.72064 1.93934 5.43934C2.22064 5.15804 2.60218 5 3 5H21C21.3978 5 21.7794 5.15804 22.0607 5.43934C22.342 5.72064 22.5 6.10218 22.5 6.5V6.8255L12 13.1255L1.5 6.8255Z" fill="#475AFF" />
                              <path d="M24 19.25C24 20.6424 23.4469 21.9777 22.4623 22.9623C21.4777 23.9469 20.1424 24.5 18.75 24.5C17.3576 24.5 16.0223 23.9469 15.0377 22.9623C14.0531 21.9777 13.5 20.6424 13.5 19.25C13.5 17.8576 14.0531 16.5223 15.0377 15.5377C16.0223 14.5531 17.3576 14 18.75 14C20.1424 14 21.4777 14.5531 22.4623 15.5377C23.4469 16.5223 24 17.8576 24 19.25ZM18.75 16.25C18.5511 16.25 18.3603 16.329 18.2197 16.4697C18.079 16.6103 18 16.8011 18 17V18.5H16.5C16.3011 18.5 16.1103 18.579 15.9697 18.7197C15.829 18.8603 15.75 19.0511 15.75 19.25C15.75 19.4489 15.829 19.6397 15.9697 19.7803C16.1103 19.921 16.3011 20 16.5 20H18V21.5C18 21.6989 18.079 21.8897 18.2197 22.0303C18.3603 22.171 18.5511 22.25 18.75 22.25C18.9489 22.25 19.1397 22.171 19.2803 22.0303C19.421 21.8897 19.5 21.6989 19.5 21.5V20H21C21.1989 20 21.3897 19.921 21.5303 19.7803C21.671 19.6397 21.75 19.4489 21.75 19.25C21.75 19.0511 21.671 18.8603 21.5303 18.7197C21.3897 18.579 21.1989 18.5 21 18.5H19.5V17C19.5 16.8011 19.421 16.6103 19.2803 16.4697C19.1397 16.329 18.9489 16.25 18.75 16.25Z" fill="#475AFF" />
                            </g>
                            <defs>
                              <clipPath id="clip0_15_104">
                                <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                      </h3>
                      <p className="pet-description">{pet.description}</p>
                      <p className="pet-age">{generateAgeText(pet.birthYear)}</p>
                    </div>
                    <div className="pet-card-photo">{petPhoto(pet.photo)}</div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>



      <div style={styleObject} className={isOverlayOpen ? "form-overlay form-overlay--is-visible" : "form-overlay"}>
        <form onSubmit={contactSubmit} className="form-overlay-inner" action="">
          <div className="form-content">
            <input autoComplete="off" name="name" className="form-field" type="text" aria-label="Your Name" placeholder="Your Name" />
            <input autoComplete="off" name="email" className="form-field" type="text" aria-label="Email Address" placeholder="Email Address" />
            <input autoComplete="off" name="answer" className="form-field" type="text" aria-label="What is the word for a baby dog?" placeholder="What is the word for a baby dog?" />
            <textarea name="comment" className="form-field" placeholder="Comment (optional)"></textarea>
            <div className="justify-right">
              <button className="our-btn">Submit</button>
            </div>
            <div className="close-form-overlay" onClick={closeOverlay}>
              x
            </div>
          </div>
          <div className="form-photo">
            <img className="overlay-pet-photo" src={petInQuestion.photo ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload/w_660,h_784,c_fill/${petInQuestion.photo}.jpg` : "/images/fallback.jpg"} alt={`A ${petInQuestion.species} named ${petInQuestion.name}`} />
            <p>
              Thank you for your interest in <strong className="overlay-pet-name">{petInQuestion.name}.</strong>
            </p>
          </div>
          <div className={formWasJustSent ? "thank-you thank-you--visible" : "thank-you"}>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
              Thank you for reaching out.
            </p>
          </div>
        </form>
      </div>
    </>
  )
}
