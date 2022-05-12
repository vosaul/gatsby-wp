import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import parse from "html-react-parser"

// We're using Gutenberg so we need the block styles
// these are copied into this project due to a conflict in the postCSS
// version used by the Gatsby and @wordpress packages that causes build
// failures.
// @todo update this once @wordpress upgrades their postcss version
import "../css/@wordpress/block-library/build-style/style.css"
import "../css/@wordpress/block-library/build-style/theme.css"
import "../css/custom.scss"

import Layout from "../components/layout"
import Seo from "../components/seo"

const PageTemplate = ({ data: {page} }) => {
  const featuredImage = {
    fluid: page.featuredImage?.node?.localFile?.childImageSharp?.fluid,
    alt: page.featuredImage?.node?.alt || ``,
  }

  return (
    <Layout>
      <Seo title={page.title} />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{page.title}</h1>

          {/* if we have a featured image for this page let's display it */}
          {featuredImage?.fluid && (
            <GatsbyImage
              fluid={featuredImage.fluid}
              alt={featuredImage.alt}
              style={{ marginBottom: 50 }}
            />
          )}
        </header>

        {!!page.content && (
          <section itemProp="articleBody">{parse(page.content)}</section>
        )}

        <hr />

      </article>

    </Layout>
  )
}
const pageData = useStaticQuery(graphql`
query PageById(
  # these variables are passed in via createPage.pageContext in gatsby-node.js
  $id: String
) {
  # selecting the current page by id
  page: wpPage(id: { eq: $id }) {
    id
    content
    title
    link
    featuredImage {
      node {
        altText
        localFile {
          childImageSharp {
            fluid(maxWidth: 1000, quality: 100) {
              ...GatsbyImageSharpFluid_tracedSVG
            }
          }
        }
      }
    }
  }
}
`)
export default PageTemplate

