import {PrismaClient} from '@prisma/client'
import {isAuthenticated} from '../middlewares';

const prisma = new PrismaClient({
    log: ['query']
})

export default {
    Query: {
        searchPost: async (_, args) => {
            const {term} = args
            try {
                return await prisma.post.findMany({
                    where: {
                        OR: [
                            {location: {startsWith: term}},
                            {caption: {startsWith: term}}
                        ]
                    }
                })
            } catch (error) {
                console.log(error)
                return []
            }
        },

        getFullPost: async (_, args, {request}) => {
            const {id} = args
            const {user} = request

            const post = await prisma.post.findOne({
                where: {
                    id
                },
                include: {
                    Like: {
                        where: {
                            userId: user.id
                        }
                    }
                }
            })

            post.isLiked = !!post.Like

            const files = await prisma.file.findMany({
                where: {
                    postId: id
                }
            })

            const comments = await prisma.comment.findMany({
                where: {
                    postId: id
                },
                select: {
                    id: true,
                    text: true,
                    user: {select: {username: true}}
                }
            })

            const likeCount = await prisma.like.count({
                where: {
                    postId: id
                }
            })

            return {
                post,
                files,
                comments,
                likeCount
            }
        }
    },

    Mutation: {
        upload: async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request)
            const {caption, files} = args
            const {user} = request

            try {
                const post = prisma.post.create({
                    data: {
                        caption,
                        user: {connect: {id: user.id}}
                    }
                })

                const uploadFiles = files.map(file => {
                    return prisma.file.create({
                        data: {
                            url: file,
                            Post: {connect: {id: post.id, userId: user.id}}
                        }
                    })
                })

                await prisma.$transaction([post, ...uploadFiles])

                return post
            } catch (error) {
                console.error(error)
                new Error(error)
            }
        },

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
