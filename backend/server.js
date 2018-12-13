import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import {
    // graphqlExpress,
    // graphiqlExpress,
    ApolloServer
} from 'apollo-server-express';
import schema from './schema';

const app = express();

const server = new ApolloServer({
    schema
});

mongoose.connect('mongodb://localhost:27017/local', {
    useNewUrlParser: true
});

server.applyMiddleware({
    app,
    path: '/graphql'
});
// app.use(cors());
// app.use('/graphiql', bodyParser.json(), graphiqlExpress({
//     endpointURL: '/graphiql'
// }));

// app.use('/graphql', );

app.listen(4000, () => console.log(`Express server running on port 4000`));