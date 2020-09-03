import {PrismaClient} from '@prisma/client'
import {generateSecret} from '../utils'

const prisma = new PrismaClient()

export default {
    Mutation: {
        createAccount: async (_, args) => {
            const {username, email, firstName, lastName, bio} = args
            return prisma.user.create({
                data: {
                    username,
                    email,
                    firstName,
                    lastName,
                    bio
                }
            })
        },

        requestSecret: async (_, args) => {
            const {email} = args
            const loginSecret = generateSecret()
            try {
                await prisma.user.update({
                    where: {
                        email
                    },
                    data: {
                        loginSecret
                    }
                })
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        },

        confirmSecret: async (_, args) => {
            const {email, secret} = args
            const user = await prisma.user.findOne(
                {
                    where: {email}
                }
            )
            if (user.loginSecret === secret) {
                return "TOKEN"
            } else {
                throw Error("Wrong email/secret combination.")
            }
        }
    }
}
