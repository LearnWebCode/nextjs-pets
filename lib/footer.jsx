"use client"

import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Footer(props) {
  function AdminFooterOrNot() {
    if (props.isAdmin) {
      return (
        <p className="logout-text">
          <a href="" onClick={handleClick}>
            Logout
          </a>
        </p>
      )
    } else {
      return <></>
    }
  }

  const router = useRouter()

  async function handleClick(e) {
    e.preventDefault()
    await axios.get("/logout-action")
    router.replace("/login")
    router.refresh()
  }

  return (
    <>
      <footer className="site-footer">
        {AdminFooterOrNot()}
        <p className="footer-nav">
          <Link href="/">Home</Link>
          <Link href="/our-history">Our History</Link>
          <Link href="/our-vision">Our Vision</Link>
        </p>
        <p>&copy; 2023 Fake Adoption Center. All rights reserved.</p>
      </footer>
    </>
  )
}
