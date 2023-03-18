import  {  ApolloServer  }  from  "apollo-server-micro";
import Cors from 'micro-cors';
const { gql } = require('apollo-server-micro')
import connectDb from './config/connectionDB'
// import processRequest from "graphql-upload/processRequest.js";
console.log(ApolloServer)

const cors = Cors()
const typeDefs = gql` 
type Query {
  club(ID: ID!): Club
  getClubs(amount: Int): [Club]
  position(ID: ID!): Position!
  getPositions(amount: Int, clubId: String): [Position]
  application(ID: ID!): Application!
  getApplications(amount: Int, positionID: String): [Application]
  user(id: ID!): User
}

type Mutation {
  createClub(clubInput: ClubInput): Club!
  deleteClub(ID: ID!): Boolean!
  editClub(ID: ID!, clubInput: ClubInput): Boolean
  createPosition(positionInput: PositionInput): Position!
  deletePosition(ID: ID!): Boolean!
  editPosition(ID: ID!, positionInput: PositionInput): Boolean
  createApplication(applicationInput: ApplicationInput): Application!
  deleteApplication(ID: ID!): Boolean!
  registerUser(registerInput: RegisterInput): User
  loginUser(loginInput: LoginInput): Club
  addExec(clubId: String, execAdd: ExecAdd): Exec
  editExec(clubId: String, execInput: ExecsInput): Exec
}

type Club {
  userRole: String
  _id: String
  name: String
  department: String
  description: String
  logoURL: String
  execs: [Execs]
  adminList: [User]
}

input RegisterInput {
  name: String
  email: String
  password: String
  role: String
  clubName: String
}

input LoginInput {
  email: String
  password: String
}

input ExecAdd {
  name: String
  role: String
  year: String
  program: String
}

type Exec {
  _id: String
  name: String
  role: String
  year: String
  program: String
}

type Execs {
  _id: String
  name: String
  role: String
  year: String
  program: String
  headshotURL: String
}

input ExecsInput {
  _id: String
  name: String
  role: String
  year: String
  program: String
}

type User {
  userID: String
  name: String
  email: String
  password: String
  role: String
  token: String
  clubName: String
  clubID: String
}

type Position {
  _id: String
  name: String
  description: String
  numberOfOpenings: Int
  skills: [Skill]
  q: [Question]
  clubId: String
}

type Application {
  _id: String
  name: String
  email: String
  description: String
  qA: [QuestionAnswer]
  positionID: String
  resumeID: String
}

type QuestionAnswer {
  question: String
  answer: String
}

type Question {
  question: String
}
type Skill {
  skill: String
}
input QuestionInput {
  question: String
}
input SkillInput {
  skill: String
}

input ClubInput {
  name: String
  department: String
  description: String
  execs: [ExecsInput]
}

input PositionInput {
  name: String
  description: String
  numberOfOpenings: Int
  skills: [SkillInput]
  q: [QuestionInput]
  clubId: String
}

input ApplicationInput {
  name: String
  email: String
  description: String
  qA: [QuestionAnswerInput]
  positionID: String
  resumeID: String
}

input QuestionAnswerInput {
  question: String
  answer: String
}

type UploadedFileResponse {
  filename: String!
  mimetype: String!
  encoding: String!
  url: String!
}

type Object{
  filename: String!
  url: String!
  objType: String!
  objId: String!
}
`

const resolvers = require("./resolvers/index")
connectDb();


const  apolloServer  =  new  ApolloServer({  typeDefs,  resolvers, context: ({req}) =>{},introspection:true, playground:true, });
const startServer = apolloServer.start()

export default cors( async (req, res) => {
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



  
  
  // if (contentType && contentType.startsWith('multipart/form-data')) {

  //   req.filePayload = await processRequest(req, res)
  // }

  await startServer

  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = {
  api: { bodyParser: false }
}