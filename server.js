const http = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// mock data for actors
const actors = [
  {
    id: '1',
    name: 'Andrew',
    description: 'Andrew is good at kungfu'
  },
  {
    id: '2',
    name: 'Sarah',
    description: 'Sarah is good at singing'
  },
  {
    id: '3',
    name: 'Mike',
    description: 'Mike is good at swimming'
  }
];

const db = {
    actors
};

// To find the actor who has the same id
function find(actors, idJson) {
    for (var i = 0; i < actors.length; i++) {
        console.log(actors[i].id, idJson)
        if (actors[i].id == idJson.id) {
            return(actors[i]);
        }
    }
}

// definition of schema
let typeDefs = `
  type Actor {
    id: String!
    name: String
    description: String
  }
  type Query {
    actor(id: String): Actor
    actors: [Actor]
  }`;

// definition of resolvers
let resolvers = {
  Query: {
    actor: (parent, {id}) => find(db.actors, {id}),
    actors: (parent, args) => db.actors
  }
};
 
// define the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});

const app = express();
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// listening at the port 4001
// output 'Server ready' when the code is fine
httpServer.listen({ port: 4001 }, () => {
  console.log(`Server ready`);
});