# Assignment 3 - Backend Development

## Overview
In this assignment, you will develop a backend that can be used for keeping track of books and genres. Two kinds of resources with several endpoints following the REST principles and best practices will be provided. Postman can be a useful tool during development.

**Note**: Similar to Assignment 2, this task might seem overwhelming at first. Start by designing the API following the lecture slides for L15/16 (writing down the HTTP methods and URLs for each endpoint). Then, implement easy endpoints first (e.g., read requests are typically easiest), and use dummy data initially (e.g., hard-coded arrays in the starter pack).

## Resources
For this project, two resource types are required: books and genres. Books have a title, author, and associated genre. Genres categorize these books into specific classifications.

### Book Attributes:
- id: A unique number identifying each book.
- title: The title of the book, provided as a string.
- author: The name of the author who wrote the book, given as a string.
- genreId: A numerical identifier that links the book to its corresponding genre in the genres resource.

### Genre Attributes:
- id: A unique number identifying each genre.
- name: The name of the genre, categorizing books into various literary themes or classifications, provided as a string.

You are encouraged to implement these resources in your backend as you see fit. However, it's essential that the backend can return and manage these attributes in the specified format.

## Endpoints
### Books Endpoints
1. **Read all books**
   - Returns an array of all books. For each book, the id, the title, the author, and the genreId are included in the response. Additionally, providing the filter query parameter returns only the books that are in the genre with the provided name. If no book is in the provided genre, an empty array is returned.

2. **Read an individual book**
   - Returns all attributes of the specified book.

3. **Create a new book**
   - Creates a new book. The endpoint expects the name and author in the request body. Duplicate names are allowed. The genreId is provided through the URL. The id shall be auto-generated (i.e., not provided in the request body). The request shall fail if a genre with the given id does not exist. If successful, the request returns the new resource (all attributes, including id and the full information).

4. **Partially update a book**
   - Partially updates an existing book. All attributes but the id can be updated. All attributes that are provided in the request body are updated. If successful, the request returns the updated resource. To change the genre, the request expects the old genreId in the URL, and the new genreId in the request body.

5. **Delete a book**
   - Deletes an existing book. If successful, the request returns all attributes of the deleted book.

### Genres Endpoints
1. **Read all genres**
   - Returns an array of all genres (with all attributes).

2. **Create a new genre**
   - Creates a new genre. The endpoint expects only the name attribute in the request body. The unique id shall be auto-generated. Duplicate names for genres are not allowed. If successful, the request returns the new genre (all attributes, including id).

3. **Delete a genre**
   - Deletes an existing genre. The request fails if any books exist in this genre. If successful, the request returns all attributes of the deleted genre.

## Library Management System - Frontend
For this assignment, we use an online frontend that keeps track of books. The deployed frontends' URLs for each group are:

- Students in group 1 should use: [Group 1](https://2024-veff-assignment3-group1.netlify.app/)
- Students in group 2 should use: [Group 2](https://2024-veff-assignment3-group2.netlify.app/)
- Students in group 3 should use: [Group 3](https://2024-veff-assignment3-group3.netlify.app/)
- Students in group 4 should use: [Group 4](https://2024-veff-assignment3-group4.netlify.app/)
- Students in group 5 should use: [Group 5](https://2024-veff-assignment3-group5.netlify.app/)
- Students in group 6 should use: [Group 6](https://2024-veff-assignment3-group6.netlify.app/)
- Students in HMV should use: [HMV](https://2024-veff-assignment3-hmv.netlify.app/)
- Students in Akureyri and Austurland should use: [Akureyri and Austurland](https://2024-veff-assignment3-unak.netlify.app/)

Whenever these websites are not available, it means that the frontend is down and cannot be reached. If this becomes an issue, then you can use the frontend that is provided in the supplement-material. If you use a local frontend to develop your backend, make sure that your code works with the deployed frontend before submitting your assignment.

## Requirements
The following requirements/best practices shall be followed:
1. The (unmodified) frontend application provided above, in section 4, needs to work with the application.
2. You should opt to use arrow functions when possible, do not use “var” and use inbuilt JavaScript functions over generic for-loops etc.
3. You should comment your code, explaining all functionality.
4. The application shall adhere to the REST constraints.
5. The best practices from L15/16 shall be followed.
   - Plural nouns shall be used for resource collections.
   - Specific resources shall be addressed using their ids, as a part of the resource URL.
   - Sub-resources shall be used to show relations between genres and books, as stated in Section 3.
   - JSON shall be used as a request/response body format.
   - The HTTP verbs shall be used to describe CRUD actions. The safe (for GET) and idempotent (for DELETE and PATCH) properties shall be adhered to.
   - Appropriate HTTP status codes shall be used for responses. 200 should be used for successful GET, DELETE and PATCH requests, 201 for successful POST requests. In error situations, 400 shall be used if the request was not valid, 404 shall be used if a resource was requested that does not exist, or if a non-existing endpoint is called. 405 shall be used if a resource is requested with an unsupported HTTP verb (e.g., trying to delete all genres)
   - You are NOT required to implement HATEOAS/Links.
6. The application/backend shall be served at http://localhost:3000/api/v1/. In case you have issues running your backend on port 3000, contact us - do not just change the port in the solution code.
7. The application shall be written as a Node.js application. The package.json file included in the "starter pack" should be used to develop the project. You are not allowed to edit the package.json, it should already contain a list of all required packages you need for this project.
8. The application shall be started using the command npm start.
9. The application is only permitted to use in-built modules of Node.js, as well as Express.js, body-parser, and cors.
10. You are not supposed to/allowed to add persistence (a database, file storage, or similar) to the assignment.
11. There are no restrictions on the ECMAScript (JavaScript) version.

## Submission
The assignment is submitted via Gradescope. You submit a zip file. Submission should contain only the following:
- index.js containing all of your code for the RESTful API
- (optional*) assignment3_postman_collection.json

Do not include the node_modules folder, package.json, package-lock.json or any other file. No late hand-ins are accepted.

*Bonus points are available for supplying a complete Postman collection along with your API. See collection requirements for bonus points in Section 9.
