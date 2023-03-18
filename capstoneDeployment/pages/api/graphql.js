import  {  ApolloServer  }  from  "apollo-server-micro";
import connectDb from './config/connectionDB'
import processRequest from "graphql-upload/processRequest.mjs";
console.log(ApolloServer)

console.log(processRequest)

const typeDefs = require("./schemas/typdefs")
const resolvers = require("./resolvers/index")
connectDb();


const  apolloServer  =  new  ApolloServer({  typeDefs,  resolvers, uploads:true, persistedQueries: {
  cache: new Map(),
}, });
const startServer = apolloServer.start()

export default async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://studio.apollographql.com"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Accept, Content-Type, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Headers"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, PUT, PATCH, DELETE, OPTIONS, HEAD"
    );
    if (req.method === "OPTIONS") {
        res.end();
        return false;
    }

  const contentType = req.headers['content-type']



  
  
  if (contentType && contentType.startsWith('multipart/form-data')) {

    req.filePayload = await processRequest(req, res)
  }

  await startServer

  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}

export const config = {
  api: { bodyParser: false }
}