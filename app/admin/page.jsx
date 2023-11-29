// import { cookies } from "next/headers"
import Dashboard from "./admin-dashboard"

const AdminPage = async () => {
  // const cookieStore = cookies()
  // const adminCookie = cookieStore.get("petadoption") ? cookieStore.get("petadoption").value : ""

  return <Dashboard />
}

export default AdminPage

export const metadata = {
  title: "Admin Dashboard"
}
