module.exports = {
  siteMetadata: {
    title: 'LET’S BE HAPPY!'
  },
  plugins: [
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url:
          process.env.WPGRAPHQL_URL ||
          `http://lena.360deg.pro/graphql`,
          //`https://wpgatsbydemo.wpengine.com/graphql`,
          //`http://127.0.0.1/graphql`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/content/assets`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter WordPress Blog`,
        short_name: `GatsbyJS & WP`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,

    /**
     * this (optional) plugin enables Progressive Web App + Offline functionality
     * To learn more, visit: https://gatsby.dev/offline
     */
    // `gatsby-plugin-offline`,
  ],
}
