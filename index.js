//Sample for Assignment 3
const express = require("express")

//Import a body parser module to be able to access the request body as json
const bodyParser = require("body-parser")

//Use cors to avoid issues with testing on localhost
const cors = require("cors")

const app = express()

const port = 3000

//Tell express to use the body parser module
app.use(bodyParser.json())

//Tell express to use cors -- enables CORS for this backend
app.use(cors())

//Set Cors-related headers to prevent blocking of local requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

let genres = [
  { id: 1, name: "Fiction" },
  { id: 2, name: "Non-Fiction" },
  { id: 3, name: "Science Fiction" },
  { id: 4, name: "Fantasy" },
]

let books = [
  { id: 1, title: "Pride and Prejudice", author: "Jane Austin", genreId: 1 },
  {
    id: 2,
    title: "Independent People",
    author: "Halldór Laxnes",
    genreId: 1,
  },
  {
    id: 3,
    title: "Brief Answers to the Big Questions",
    author: "Stephen Hawking",
    genreId: 2,
  },
]

/* YOUR CODE STARTS HERE */

// Helper functions
/**
 * Check if a genre id is valid
 * @param genreId - The id of the genre
 * @returns {boolean} - True if the genre id is valid, false otherwise
 */
const isValidGenreId = (genreId) => {
  return genres.some(genre => genre.id === genreId);
}

/**
 * Find a genre by its id
 * @param genreId
 * @returns {name: string, id: number} or undefined
 */
const findGenreById = (genreId) => {
    return genres.find(genre => genre.id === genreId);
}

/**
 * Find a book by its id
 * @param bookId - The id of the book
 * @returns {genreId: number, author: string, id: number, title: string} or undefined
 */
const findBookById = (bookId) => {
    return books.find(book => book.id === bookId);
}

/**
 * Validate the required fields in the request body
 * It checks if the value is provided and is of the correct type, and if it is not empty or whitespace
 * @param value - The value to validate
 * @param type - The type of the value
 * @returns {boolean}
 */
const validateRequiredField = (value, type) => {
    return !(!value || typeof value !== type || !value.trim());
}

/**
 * Validate the book and genre ids provided in the request
 * It checks if the ids are numbers and if they exist in the collection of books and genres
 * @param bookId - The id of the book
 * @param genreId - The id of the genre
 * @returns {[number,string]} - An array containing the status code and a message
 */
const validateBookParams = (bookId, genreId) => {
  // Check if the book id and genre id are numbers
  if(isNaN(bookId) || isNaN(genreId)) {
    return [400, "Invalid input. Book id and genre id must be numbers"]
  }

  // Check if bookId exists within the collection of books
  if (!findBookById(bookId)) {
    return [404, "Book not found"]
  }

  // Check if genreId exists within the collection of genres
  if (!isValidGenreId(genreId)) {
    return [404, "Genre not found"]
  }

  return [200, "Success"]
}

const apiPath = "api"
const version = "v1"
// Full api path to be used in the routes
const fullApiPath = `/${apiPath}/${version}`

/**
 * Get all books
 * If a genre query is provided, filter the books by the genre
 * @param {string} genre - The genre to filter the books by (optional)
 * @returns {Array} - An array of books or an empty array
 */
app.get(`${fullApiPath}/books`, (req, res) => {
  const allowedQueryParams = ['filter']
  const queryParams = Object.keys(req.query)
  const invalidParams = queryParams.filter(p => !allowedQueryParams.includes(p))

  // Return a 400 error if any disallowed query parameters are present
  if (invalidParams.length > 0) {
    return res.status(400).json({ message: "Invalid input. Only 'filter' query parameter is allowed." })
  }

  // Handle the genre query filter if provided
  if (req.query.filter) {
    let genreQuery = Array.isArray(req.query.filter) ? req.query.filter : [req.query.filter]
    genreQuery = genreQuery.map(g => g.toLowerCase())
    const genreIds = genres.filter(g => genreQuery.includes(g.name.toLowerCase())).map(g => g.id)

    // If no matching genres found, return an empty array
    if (genreIds.length === 0) {
      return res.status(200).json([])
    }

    // Return the books that match the genre IDs
    const filteredBooks = books.filter(book => genreIds.includes(book.genreId))
    return res.status(200).json(filteredBooks)
  }

  // If no genre query is provided, return all books
  return res.status(200).json(books)
})

/**
 * Get a single book by id
 * @param {string} bookId - The id of the book to get
 * @param {string} genreId - The id of the genre of the book
 * @returns {Object} - The book object or a 404 error
 */
app.get(`${fullApiPath}/genres/:genreId/books/:bookId`, (req, res) => {
  const bookId = Number(req.params.bookId)
  const genreId = Number(req.params.genreId)

  // Validate the params
  const [statusCode, message] = validateBookParams(bookId, genreId)
  if (statusCode !== 200) {
      return res.status(statusCode).json({ message })
  }

  // Return the book
  return res.status(200).json(findBookById(bookId))
})

/**
 * Create a new book
 * @returns {Object} - The new book object or a 400 error
 */
app.post(`${fullApiPath}/books`, (req, res) => {
  // Ensure the request body is provided
  if (!req.body) {
    return res.status(400).json({ message: "Invalid input. Please provide a title, author and genreId." })
  }

  // Ensure 'title' is provided and is a non-empty string
  if (!validateRequiredField(req.body?.title, 'string')) {
    return res.status(400).json({ message: "Invalid input. 'title' is required and must be a non-empty string." })
  }

  // Ensure 'author' is provided and is a non-empty string
  if (!validateRequiredField(req.body?.author, 'string')) {
      return res.status(400).json({ message: "Invalid input. 'author' is required and must be a non-empty string." })
  }

  // Ensure 'genreId' is provided and corresponds to a valid genre
  if (!req.body?.genreId || !isValidGenreId(req.body.genreId)) {
    return res.status(400).json({ message: "Invalid input. 'genreId' is required and must correspond to a valid genre." })
  }

  // Create a new book object
  const newBook = {
    id: books.length + 1,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    genreId: req.body.genreId,
  }
  // Add the new book to the books array
  books.push(newBook)

  // Return the new book
  return res.status(201).json(newBook)
})

/**
 * Update a book
 * @param {string} genreId - The id of the genre of the book
 * @param {string} bookId - The id of the book to update
 * @returns {Object} - The updated book object or a 400 error
 */
app.patch(`${fullApiPath}/genres/:genreId/books/:bookId`, (req, res) => {
  const bookId = Number(req.params.bookId)
  const genreId = Number(req.params.genreId)

  // Ensure the request body is provided
  if (!req.body) {
      return res.status(400).json({ message: "Invalid input. Please provide a title, author, id and genreId." })
  }

  // Validate the params
  const [statusCode, message] = validateBookParams(bookId, genreId)
  if (statusCode !== 200) {
    return res.status(statusCode).json({ message })
  }

  // Verifies that the book associated with bookId actually belongs to the genreId specified in the URL
  if (!books.some((book) => book.id === bookId && book.genreId === genreId)) {
      return res.status(404).json({ message: "Book not found in the specified genre" })
  }

  // Validates book title if provided
  if (req.body.title && !validateRequiredField(req.body.title, 'string')) {
      return res.status(400).json({ message: "Invalid input. 'title' must be a non-empty string." })
  }

  // Validates book author if provided
  if (req.body.author && !validateRequiredField(req.body.author, 'string')) {
    return res.status(400).json({message: "Invalid input. 'author' must be a non-empty string."})
  }

  // Validates genreId if provided in the request body
  if (req.body?.genreId && !isValidGenreId(req.body.genreId)) {
      return res.status(400).json({ message: "Invalid input. 'genreId' must correspond to a valid genre." })
  }

  // Update the book in the books array
  books = books.map((book) => {
    if (book.id === bookId) {
      return {
        ...book,
        title: req.body.title || book.title,
        author: req.body.author || book.author,
        genreId: req.body.genreId || book.genreId,
      }
    }
    return book
  })

  // Return the updated book
  return res.status(200).json(findBookById(bookId))
})

/**
 * Delete a book
 * @param {string} bookId - The id of the book to delete
 * @returns {Object} - The deleted book object or a 404 error
 */
app.delete(`${fullApiPath}/books/:bookId`, (req, res) => {
  // Get the book id from the request
  const bookId = Number(req.params.bookId)

  // Check if the book id is valid
  if(isNaN(bookId)) {
      return res.status(400).json({ message: "Invalid input. Book id must be a number" })
  }

  // Check if the book id is valid
  if (!findBookById(bookId)) {
    return res.status(404).json({ message: "Book not found" })
  }

  // Find the book to delete
  const book = findBookById(bookId)
  // Delete the book from the books array
  books = books.filter((b) => b.id !== book.id)

  // Return the deleted book
  res.status(200).json(book)
})

/**
 * Get all genres
 * @returns {Array} - An array of genres
 */
app.get(`${fullApiPath}/genres`, (req, res) => {
  // Return all genres
  res.status(200).json(genres)
})

/**
 * Create new genre
 * @param {string} genre - The name of the genre
 * @returns {Object} - The new genre object or a 400 error
 */
app.post(`${fullApiPath}/genres`, (req, res) => {
  // Check if the request body
  if (!req.body) {
    return res.status(400).json({ message: "Invalid input. Please provide a name for the genre." })
  }

  // Ensure the name is a string and is not empty
  if (!validateRequiredField(req.body.name, 'string')) {
    return res.status(400).json({ message: "Invalid input. 'name' must be a non-empty string." })
  }

  const genreName = req.body.name.trim()

  // Check if the genre already exists
  if (genres.some((genre) => genre.name.toLowerCase() === genreName.toLowerCase())) {
      // Return a 400 error if the genre already exists
      return res.status(400).json({ message: "Genre already exists!" })
  }

  // Create a new genre object
  // Add the new genre to the genres array
  const newGenre = {
    id: genres.length + 1,
    name: genreName,
  }
  genres.push(newGenre)

  // Return the new genre
  return res.status(201).json(newGenre)
})

/**
 * Delete a genre
 * @param {string} genreId - The id of the genre to delete
 * @returns {Object} - The deleted genre object or a 400 error
 */
app.delete(`${fullApiPath}/genres/:genreId`, (req, res) => {
  // Get the genre id from the request
  const genreId = Number(req.params.genreId)

  // Validate
  // Check if the genre id is valid or if the genre is not in use
  if(isNaN(genreId)) {
      return res.status(400).json({ message: "Invalid input. Genre id must be valid" })
  }

  // Check if the genre is in use
  if (books.some((book) => book.genreId === genreId)) {
      return res.status(400).json({ message: "Invalid input. Genre is in use!" })
  }

  // Check if the genre id is valid
  if (!genreId || !isValidGenreId(genreId)) {
    // Return a 404 error if the input is invalid
    return res.status(404).json({ message: "Invalid input. Genre is in use or not found!" })
  }

  // Find the genre to delete and delete it from the genres array
  const genre = findGenreById(genreId)
  genres = genres.filter((g) => g.id !== genre.id)

  // Return the deleted genre
  return res.status(200).json(genre)
})

/**
 * Handle invalid delete routes
 * @returns {Object} - A 405 error
 */
app.delete(`${fullApiPath}/books/`, (req, res) => {
  return res.status(405).json({ message: "Method not allowed" })
})
app.delete(`${fullApiPath}/genres/`, (req, res) => {
  return res.status(405).json({ message: "Method not allowed" })
})

/**
 * Handle invalid routes
 * @returns {Object} - A 404 error
 */
// This should be the last route
app.all('*', (req, res) => {
  res.status(404).json({ message: "Not found" });
});

/* YOUR CODE ENDS HERE */

/* DO NOT REMOVE OR CHANGE THE FOLLOWING (IT HAS TO BE AT THE END OF THE FILE) */
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

module.exports = app // Export the app
