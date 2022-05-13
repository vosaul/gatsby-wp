import React from "react"
import { graphql } from "gatsby"
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

const PageTemplate = ({ pageContext, data }) => {
  const featuredImage = {
    fluid: data.featuredImage?.node?.localFile?.childImageSharp?.fluid,
    alt: data.featuredImage?.node?.alt || ``,
  }

  return (
    <Layout>
      <Seo title={pageContext.title} />

      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
          <h1 itemProp="headline">{pageContext.title}</h1>
          <h2>{data.title}</h2>

        {!!pageContext.content && (
          <section itemProp="articleBody">{parse(pageContext.content)}</section>
        )}

        <hr />

      </article>

    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
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
`
