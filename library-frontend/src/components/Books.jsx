import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const GenresButton = ({ setGenre }) => {
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return <div>Loading...</div>
  }

  const books = result.data.allBooks
  const genres = [...new Set(books.flatMap(book => book.genres))]

  return (
    <div>
      {genres.map(genre => (
        <button 
          key={genre} 
          onClick={() => setGenre(genre)}
        >{genre}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return  <div>Loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      {genre && <p>in genre <strong>{genre}</strong></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <GenresButton setGenre={setGenre} />
    </div>
  )
}

export default Books
