const Notify = ({ errorMessage }) => {
  if (!errorMessage) return null

  return (
    <div>
      <p>{errorMessage}</p>
    </div>
  )
}

export default Notify
