import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { LOGIN } from "../queries"

const LoginForm = ({ show, setError, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setUsername('')
      setPassword('')
      setPage('authors')
    },
    onError: (error) => {
      setError(`login failed: ${error.message}`)
    }
  })

  if (!show) return null

  const submit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          username
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          password
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
