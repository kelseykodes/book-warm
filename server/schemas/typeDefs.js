const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    # Add a queryable field to retrieve an array of Class objects
    savedBooks: [Book]

  }

  type Book {
    bookId: ID!
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, password: String!, email: String! ): Auth
    login(email: String!, password: String!): Auth
    removeBook(bookId: ID!): User
    saveBook(authors: [String]!, bookId: String!, title: String, description: String, image: String, link: String): User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
   me: User
  }
`;

module.exports = typeDefs;
