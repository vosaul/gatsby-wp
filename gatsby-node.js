const path = require(`path`)
const chunk = require(`lodash/chunk`)

exports.createPages = async gatsbyUtilities => {
  // Query our posts from the GraphQL server
  const posts = await getPosts(gatsbyUtilities)
  const pages = await getPages(gatsbyUtilities)

  // If there are no posts in WordPress, don't do anything
  if (!posts.length) {
    return
  }

  // If there are posts, create pages for them
  await createIndividualBlogPostPages({ posts, gatsbyUtilities })

  // And a paginated archive
  await createBlogPostArchive({ posts, gatsbyUtilities })

  // Pages
  await createRootPages({ pages, gatsbyUtilities })
}

/**
 * This function creates all the individual blog pages in this site
 */

const createIndividualBlogPostPages = async ({ posts, gatsbyUtilities }) =>
  Promise.all(
    posts.map(({ previous, post, next }) =>
      gatsbyUtilities.actions.createPage({
        path: '/blog/' + post.uri,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          id: post.id,
          previousPostId: previous ? previous.id : null,
          nextPostId: next ? next.id : null,
        },
      })
    )
  )

  exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const queryResults = await graphql(`
    query pagesQuery {
      allWpPage {
        nodes {
          id
          slug
          title
          uri
          content
        }
      }
    }
`)
if (queryResults.errors) {
  reporter.panicOnBuild(`Error while running GraphQL query.`)
  return
}

    const template = path.resolve(`./src/templates/page.js`)
    queryResults.data.allWpPage.nodes.forEach(node => {
      const pagePath = '/' + (node.uri === '/' ? '' : node.slug)
      console.log('path:',pagePath, node.id)
      createPage({
        path: pagePath,
        component: template,
        context: {
          id: node.id,
          title: node.title,
          content: node.content,
        },
      })
    })
  }
  

/* const createRootPages = async ({ pages, gatsbyUtilities }) =>
  Promise.all(
    pages.map(({ page }) => {
       gatsbyUtilities.actions.createPage({
        path: page.uri,
        component: path.resolve(`./src/templates/page.js`),
        context: {
          id: page.id,
        },
      })}
    )
  ) */

async function createBlogPostArchive({ posts, gatsbyUtilities }) {
  const graphqlResult = await gatsbyUtilities.graphql(/* GraphQL */ `
    {
      wp {
        readingSettings {
          postsPerPage
        }
      }
    }
  `)

  const { postsPerPage } = graphqlResult.data.wp.readingSettings

  const postsChunkedIntoArchivePages = chunk(posts, postsPerPage)
  const totalPages = postsChunkedIntoArchivePages.length

  return Promise.all(
    postsChunkedIntoArchivePages.map(async (_posts, index) => {
      const pageNumber = index + 1

      const getPagePath = page => {
        if (page > 0 && page <= totalPages) {
          // Since our homepage is our blog page
          // we want the first page to be "/" and any additional pages
          // to be numbered.
          // "/blog/2" for example
          return page === 1 ? "/" : "/blog/${page}"
        }

        return null
      }

      // createPage is an action passed to createPages
      // See https://www.gatsbyjs.com/docs/actions#createPage for more info
      await gatsbyUtilities.actions.createPage({
        path: getPagePath(pageNumber),

        // use the blog post archive template as the page component
        component: path.resolve(`./src/templates/blog-post-archive.js`),

        // `context` is available in the template as a prop and
        // as a variable in GraphQL.
        context: {
          // the index of our loop is the offset of which posts we want to display
          // so for page 1, 0 * 10 = 0 offset, for page 2, 1 * 10 = 10 posts offset,
          // etc
          offset: index * postsPerPage,

          // We need to tell the template how many posts to display too
          postsPerPage,

          nextPagePath: getPagePath(pageNumber + 1),
          previousPagePath: getPagePath(pageNumber - 1),
        },
      })
    })
  )
}

/**
 * This function queries Gatsby's GraphQL server and asks for
 * All WordPress blog posts. If there are any GraphQL error it throws an error
 * Otherwise it will return the posts 🙌
 *
 * We're passing in the utilities we got from createPages.
 * So see https://www.gatsbyjs.com/docs/node-apis/#createPages for more info!
 */
async function getPosts({ graphql, reporter }) {
  const graphqlResult = await graphql(/* GraphQL */ `
    query WpPosts {
      # Query all WordPress blog posts sorted by date
      allWpPost(sort: { fields: [date], order: DESC }) {
        edges {
          previous {
            id
          }
          post: node {
            id
            uri
          }

          next {
            id
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      graphqlResult.errors
    )
    return
  }

  return graphqlResult.data.allWpPost.edges
}

async function getPages({ graphql, reporter }) {
  const graphqlResult = await graphql(/* GraphQL */ `
    query WpPages {
      # Query all WordPress pages
      allWpPage {
        edges {
          page: node {
            id
            uri
          }
        }
      }
    }
  `)

  if (graphqlResult.errors) {
    reporter.panicOnBuild(
      `There was an error loading your pages`,
      graphqlResult.errors
    )
    return
  }

  return graphqlResult.data.allWpPage.edges
}
