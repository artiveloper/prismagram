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
                await prisma.followRelation.create({
                    data: {
                        followingId: id,
                        followerId: user.id
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
                await prisma.user.delete({
                    data: {
                        followingId: id,
                        followerId: user.id
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
