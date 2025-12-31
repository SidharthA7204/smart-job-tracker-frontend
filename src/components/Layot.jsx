import Header from "./Header"
import Sidebar from "./Sidebar"
import "./layout.css"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </>
  )
}

export default Layout
