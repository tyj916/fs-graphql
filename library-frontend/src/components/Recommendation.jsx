import { useQuery } from "@apollo/client/react"
import { ME } from "../queries"

const Recommendation = (props) => {
  const meResult = useQuery(ME)

  if (!props.show) return null

  if (meResult.loading) {
    return <div>Loading...</div>
  }

  const favoriteGenre = meResult.data.me.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre {favoriteGenre}</p>
    </div>
  )
}

export default Recommendation
