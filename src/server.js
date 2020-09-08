import dotenv from 'dotenv'
import logger from 'morgan'
import path from 'path'
import {GraphQLServer} from 'graphql-yoga'
import {makeExecutableSchema} from 'graphql-tools'
import {fileLoader, mergeTypes, mergeResolvers} from 'merge-graphql-schemas'
import {authenticateJwt} from './passport'
import {isAuthenticated} from './middlewares'

dotenv.config()

const PORT = process.env.PORT || 4000

/*
    graphql configuration.
 */
const allTypes = fileLoader(path.join(__dirname, '/graphqls/*'))
const allResolvers = fileLoader(path.join(__dirname, '/resolvers/*'))
const schema = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
})

const server = new GraphQLServer({
    schema,
    context: ({request}) => ({request, isAuthenticated})
})

server.express.use(logger("dev"))
server.express.use('/graphql', authenticateJwt)

server.start(
    {
        port: PORT,
        playground: "/playground",
        endpoint: "/graphql"
    },
    () => {
    console.log(`Server Running on http://localhost:${PORT}`)
})
