import "./globals.css"
import { Source_Sans_3 } from "next/font/google"
import Footer from "../lib/footer"
import { cookies } from "next/headers"

const ss3 = Source_Sans_3({ subsets: ["latin"] })

export const metadata = {
  title: "Pet Adoption",
  description: "The best local pet adoption center."
}

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get("petadoption") ? cookieStore.get("petadoption").value : ""

  const isAdmin = adminCookie == process.env.SESSIONCOOKIEVALUE

  return (
    <html lang="en">
      <body className={ss3.className}>
        {children}
        <Footer isAdmin={isAdmin} />
      </body>
    </html>
  )
}
