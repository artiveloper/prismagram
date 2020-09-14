import passport from 'passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

const verifyUser = async (payload, done) => {
    try {
        const user = await prisma.user.findOne({
            where: {
                id: payload.id
            }
        })
        if (user !== null) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (error) {
        return done(error, false)
    }
}

export const authenticateJwt  =(req, res, next) => {
    if (req.path === '/playground') {
        next()
    } else {
        passport.authenticate("jwt", {session: false}, (error, user, info) => {
            if (error) { // 서버 에러
                console.error(error);
                return next(error);
            }
            if (user) {
                req.user = user
            }
            next()
        })(req, res, next)
    }
}

passport.use(new Strategy(jwtOptions, verifyUser))
passport.initialize()
