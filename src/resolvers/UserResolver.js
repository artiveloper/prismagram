import {PrismaClient} from '@prisma/client'
import {generateSecret, generateToken} from '../utils'
import {sendSecretMail} from '../utils/email';

const prisma = new PrismaClient()

export default {
    Query: {
        getUserProfile: async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request)
            const {user} = request
            const {id} = args
            try {
                const userProfile = await prisma.user.findOne({
                    where: {
                        id
                    }
                })
                userProfile.isSelf = user.id === id

                const isFollow = await prisma.followRelation.findMany({
                    where: {
                        followerId: user.id,
                        followingId: id
                    }
                })

                userProfile.amIFollowing = isFollow.length > 0

                return userProfile
            } catch (error) {
                console.error(error)
            }
        },

        me: async(_, __, {request, isAuthenticated}) => {
            isAuthenticated(request)
            const {user} = request
            const response = {
                username: true,
                firstName: true,
                lastName: true,
                bio: true,
                posts: true
            }
            const userProfile = prisma.user.findOne({
                where: {
                    id: user.id
                }
            })
            const posts = prisma.post.findMany({
                where: {
                    userId: user.id
                }
            })
            return { user: userProfile, posts }
        },

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

        editAccount: async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request)
            const {username, email, firstName, lastName, bio} = args
            const {user} = request
            return prisma.user.update({
                where: {
                    id: user.id
                },
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
