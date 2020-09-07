import {PrismaClient} from '@prisma/client'
import {isAuthenticated} from '../middlewares';

const prisma = new PrismaClient()

export default {
    Mutation: {
        addComment: async (_, args, {request}) => {
            isAuthenticated(request)
            const {user} = request
            const {postId, text} = args
            try {
                const createdComment = await prisma.comment.create({
                    data: {
                        user: {connect: {id: user.id}},
                        post: {connect: {id: postId}},
                        text
                    }
                })
                return createdComment
            } catch (error) {
                console.error(error)
            }
        }
    }
}
