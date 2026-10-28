import { useState } from "react"

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()

    console.log('login')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          name
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          password
          <input value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
