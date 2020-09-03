import dotenv from 'dotenv'
import logger from 'morgan'
import path from 'path'
import {GraphQLServer} from 'graphql-yoga'
import {makeExecutableSchema} from 'graphql-tools'
import {fileLoader, mergeTypes, mergeResolvers} from 'merge-graphql-schemas'
import {sendSecretMail} from './utils/email';

dotenv.config()

const PORT = process.env.PORT || 4000

console.log(sendSecretMail("artiveloper@gmail.com", "asdfasdfasdf"))

/*
    graphql configuration.
 */
const allTypes = fileLoader(path.join(__dirname, '/graphqls/*'))
const allResolvers = fileLoader(path.join(__dirname, '/resolvers/*'))
const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
})

const server = new GraphQLServer({schema})
server.express.use(logger("dev"))

server.start({port: PORT}, () => {
    console.log(`Server Running on http://localhost:${PORT}`)
})
