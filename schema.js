import {
    makeExecutableSchema
} from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = [`
    type Book {
        id: String
        title: String
        author: Author
    }
    type Author {
        id: String
        name: String
        books: [Book]
    }
    type Query {
        allBooks: [Book]
        book(title: String!): Book
        allAuthors: [Author]
        author(name: String!): Author
    }
    type Mutation {
        updateBook(id: String!, title: String!): Book
        addBook(title: String!, author: String!): Book
        addAuthor(name: String!, book: String!): Author
        deleteBook(id: String!): Book
    }
`];

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;