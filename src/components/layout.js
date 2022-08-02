import * as React from "react"
import { Link } from "react-router-dom";

const Layout = ({ location, title, children }) => {
  const rootPath = "/" //`${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">..</Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built by
        {` `}
        <a href="https://www.nicokrause.com">Nico Krause</a>
      </footer>
    </div>
  )
}

export default Layout
