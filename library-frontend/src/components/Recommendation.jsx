import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS, ME } from "../queries"

const Recommendation = (props) => {
  const meResult = useQuery(ME)

  const genre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre
  })

  if (!props.show) return null

  if (booksResult.loading || meResult.loading) {
    return <div>Loading...</div>
  }

  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{genre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendation
