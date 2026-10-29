const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

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
      const authors = await Author.find({})
      const books = await Book.find({})

      const authorsWithBookCount = authors.map(author => ({
        ...author.toObject(),
        id: author._id.toString(),
        bookCount: books.filter(book => book.author.toString() === author.id).length
      }))

      return authorsWithBookCount
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !=='test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
    addBook: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

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

      try {
        await book.save()
        await book.populate('author')
      } catch (error) {
        throw new GraphQLError(`Failed to create book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          code: 'UNAUTHENTICATED'
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Failed to edit birth year: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const { username, favoriteGenre } = args
      const user = new User({ username, favoriteGenre })

      return user.save().catch(error => {
        throw new GraphQLError(`Failed to create user: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError(`wrong credentials`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
