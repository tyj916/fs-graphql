const { GraphQLError } = require('graphql')
const Author = require('./models/author')
const Book = require('./models/book')

const getAuthor = async (name) => {
  const author = await Author.findOne({ name })

  if (author) {
    return author
  }

  const newAuthor = new Author({ name })
  return await newAuthor.save().catch(error => {
    throw new GraphQLError(`Failed to create author: ${error.message}`, {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: name,
        error
      }
    })
  })
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
      const { title, author: authorName } = args

      const bookExists = await Book.exists({ title })

      if (bookExists) {
        throw new GraphQLError(`Book already exists: ${title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title
          }
        })
      }

      const author = await getAuthor(authorName)
      const book = new Book({ ...args, author: author._id })
      const savedBook = await book.save().catch(error => {
        throw new GraphQLError(`Failed to create book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title,
            error
          }
        })
      })
      return savedBook.populate('author')
    },
    editAuthor: (root, args) => {
      // tba
    }
  }
}

module.exports = resolvers
