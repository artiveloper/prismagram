import {PrismaClient} from '@prisma/client'
import {
    generateSecret,
    generateToken
} from '../utils'
import {sendSecretMail} from '../utils/email';

const prisma = new PrismaClient()

export default {
    Query: {
        searchUser: async (_, args) => {
            const {term} = args
            return await prisma.user.findMany({
                where: {
                    OR: [
                        {username: {contains: term}},
                        {firstName: {contains: term}},
                        {lastName: {contains: term}}
                    ]
                }
            })
        }
    },
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
            });
        },

        requestSecret: async (_, args) => {
            const {email} = args
            const loginSecret = generateSecret()
            try {
                await sendSecretMail(email, loginSecret)
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
                return generateToken(user.id)
            } else {
                throw Error("Wrong email/secret combination.")
            }
        }
    }
}
