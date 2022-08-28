import React, { useEffect, useState }  from "react"
import { Link } from "react-router-dom";
import Identity from "./Identity";

const Layout = ({ location, title, children, store }) => {
  const rootPath = "/" //`${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <div>
        <h1 className="main-heading">
          <Link to={"/"}>{title}</Link>
        </h1>
        <Identity store={store} />
      </div>
    )
  } else {
    header = (
      <div>
        <Link className="header-link-home" to={"/"} >..</Link>
        <Identity store={store}/>
      </div>
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
