import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { EDIT_BORN } from "../queries"

const BornForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editBorn] = useMutation(EDIT_BORN)

  const submit = (e) => {
    e.preventDefault()

    editBorn({ variables: { 
      name, 
      born: +born, 
    } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <label>
          name
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {authors.map(author => (
              <option key={author.id} value={author.name}>{author.name}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          born
          <input value={born} onChange={(e) => setBorn(e.target.value)} />
        </label>
        <br />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BornForm
