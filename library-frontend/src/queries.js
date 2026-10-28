import { gql } from "@apollo/client";

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
  query {
    allBooks {
      title
      published
      author
      id
      genres
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
      title
      published
      author
      id
      genres
    }
  }
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
