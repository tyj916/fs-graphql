import { gql } from "@apollo/client";

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    author {
      name
    }
    id
    genres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      # bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks(
      $genre: String
    ) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const EDIT_BORN = gql`
  mutation editBorn(
    $name: String!
    $born: Int!
  ) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(username: $username, password: $password) {
      value
    }
  }
`

