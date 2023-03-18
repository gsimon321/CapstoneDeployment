import { ApolloServer } from "apollo-server-micro";
import connectDb from "./config/connectionDB";
import processRequest from "graphql-upload/processRequest.mjs";
const {graphqlUploadExpress} = require("graphql-upload");

const typeDefs = require("./schemas/typdefs");
const resolvers = require("./resolvers/index");
connectDb();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
});

const startServer = apolloServer.start();

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

  // Add the `graphqlUploadExpress` middleware
  await graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })(req, res, () => {});

  const contentType = req.headers["content-type"];

  if (contentType && contentType.startsWith("multipart/form-data")) {
    req.filePayload = await processRequest(req, res);
  }

  await startServer;

  return apolloServer.createHandler({ path: "/api/graphql" })(req, res);
};

export const config = {
  api: { bodyParser: false },
};