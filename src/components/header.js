import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  a {
    color: #555;
    font-size: 18px;
    text-decoration: none;
  }
`

export default function Header() {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      menu: wpMenu {
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  `)
  return (
    <Nav>
    {data.menu.menuItems.nodes.map(node => {
      const url = node.url.includes("http") ? "/" : node.url
      return (
        <Link key={node.id} to={url}>
          {node.label}
        </Link>
      )
    })}
  </Nav>
  )
}
