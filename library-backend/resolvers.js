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
      const { author } = args
      const allBooks = await Book.find({}).populate('author')
    
      if (!author) {
        return allBooks
      }

      return allBooks.filter(book => book.author.name === author)
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
