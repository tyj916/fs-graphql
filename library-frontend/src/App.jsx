import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendation from './components/Recommendation'
import Notify from './components/Notify'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={onLogout}>logout</button>
        </>}
        {!token && <>
          <button onClick={() => setPage('login')}>login</button>
        </>}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendation show={page === 'recommend'} />

      <LoginForm show={page === 'login'} setError={notify} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
