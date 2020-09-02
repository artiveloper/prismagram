import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    Mutation: {
        createAccount: async (_, args) => {
            const {username, email, firstName, lastName, bio} = args
            return prisma.user.create({
                data : {
                    username,
                    email,
                    firstName,
                    lastName,
                    bio
                }
            })
        }
    }
}
