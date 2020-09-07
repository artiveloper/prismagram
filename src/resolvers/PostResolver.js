import {PrismaClient} from '@prisma/client'
import {isAuthenticated} from '../middlewares';

const prisma = new PrismaClient()

export default {
    Mutation: {
        toggleLike: async (_, args, {request}) => {
            isAuthenticated(request)
            const {postId} = args
            const {user} = request

            console.log(postId, user.id)

            try {
                const existLike = await prisma.like.findMany({
                    where: {
                        userId: user.id,
                        postId: postId
                    }
                })

                if (existLike.length === 0) {
                    await prisma.like.create({
                        data: {
                            user: {connect: {id: user.id}},
                            post: {connect: {id: postId}}
                        }
                    })
                } else {
                    await prisma.like.deleteMany({
                        where: {
                            userId: user.id,
                            postId: postId
                        }
                    })
                }

                return true
            } catch (error) {
                console.error(error)
                return false
            }
        }
    }
}
