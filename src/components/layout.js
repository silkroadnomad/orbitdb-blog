import React from "react"
import { Link } from "react-router-dom";
import { Container,Grid, GridItem } from '@chakra-ui/react'
import {SettingsDrawer as Drawer} from './SettingsDrawer'

const Layout = ({ location, title, children, store }) => {

  const rootPath = "/"
  const tagPath = "/tag"
  const dbPath = "/db"
  const isRootPath = location.pathname === rootPath
  const isTagPath = location.pathname.startsWith(tagPath)
  const isDbPath = location.pathname.startsWith(dbPath)
  let header
  
  if (isRootPath || isTagPath || isDbPath) {
    header = (
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
          <GridItem colSpan={4} ><h1 className="main-heading"><Link to={"/"}>{title}</Link></h1></GridItem>
          <GridItem textAlign={"right"}><Drawer store={store}/></GridItem>
      </Grid>
    )
  } else {
    header = (
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
          <GridItem colSpan={4}><h1 className="main-heading"><Link className="header-link-home" to={"/"} >..</Link></h1></GridItem>
          <GridItem textAlign={"right"}><Drawer store={store}/></GridItem>
      </Grid>
    )
  }

  return (
    <Container maxW='container.sm'>

        <header className="global-header">{header}</header>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built by
          {` `}
          <a href="https://www.nicokrause.com">Nico Krause</a>
        </footer>
    
    </Container>
  )
}

export default Layout
