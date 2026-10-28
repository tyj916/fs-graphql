const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

const getAuthor = async (name) => {
  const author = await Author.findOne({ name })

  if (author) {
    return author
  }

  const newAuthor = new Author({ name })
  return await newAuthor.save()
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const { author, genre } = args
      const filter = {}

      if (author) {
        const authorObject = await Author.findOne({ name: author })

        if (!authorObject) {
          return [] // no matching author, just return empty array
        }

        filter.author = authorObject._id
      }

      if (genre) {
        filter.genres = genre
      }

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    } 
  },
  Mutation: {
    addBook: async (root, args) => {
      const bookExists = await Book.exists({ title: args.title })

      if (bookExists) {
        throw new GraphQLError(`Book already exists: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      const author = await getAuthor(args.author)
      const book = new Book({ ...args, author: author._id })
      const savedBook = await book.save()
      return savedBook.populate('author')
    },
    editAuthor: (root, args) => {
      // tba
    }
  }
}

module.exports = resolvers
