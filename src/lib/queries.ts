export const HOSPELIA_QUERY = `
  query AllContent {
    pageBy(uri: "home") {
      title
      content
    }
    properties(first: 100) {
      nodes {
        id
        title
        slug
        featuredImage { 
          node { 
            sourceUrl 
          } 
        }
        propertyFields { 
          price 
          location
          rating
          features
          category
          bedrooms
          bathrooms
          guests
        }
      }
    }
    menuItems(where: {location: HOSPELIA_MAIN_MENU}) {
      nodes { 
        label 
        url 
      }
    }
    optionsPage {  
      generalSettings { 
        phone 
        logo { 
          sourceUrl 
        } 
      }
    }
    reviews(first: 100) {
      nodes {
        id
        date
        title
        content
        reviewFields {
          rating
          nombre
          avatarUrl
          propertyId
        }
      }
    }
  }
`; 