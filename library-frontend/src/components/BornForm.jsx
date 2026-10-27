import { useState } from "react"

const BornForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const submit = (e) => {
    e.preventDefault()

    console.log('Update birthyear')

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <label>
          name
          <input value={name} onChange={(e) => setName(e.target.value)} />
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
