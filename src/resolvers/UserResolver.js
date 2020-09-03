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
        }
    }
}
