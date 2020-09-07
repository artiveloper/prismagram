import {PrismaClient} from '@prisma/client'
import {isAuthenticated} from '../middlewares'

const prisma = new PrismaClient()


export default {
    Mutation: {
        follow: async (_, args, {request}) => {
            isAuthenticated(request)
            const {user} = request
            const {id} = args

            try {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        followings: {
                            connect: {
                                id
                            }
                        }
                    }
                })
                return true
            } catch (error) {
                console.error(error)
                return false
            }
        },

        unfollow: async (_, args, {request}) => {
            isAuthenticated(request)
            const {user} = request
            const {id} = args

            try {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        followings: {
                            disconnect: {
                                id
                            }
                        }
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
