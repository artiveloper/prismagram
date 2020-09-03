import passport from 'passport'
import JwtStrategy from 'passport-jwt'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const jwtOptions = {
    _jwtFromRequest: JwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secret: process.env.SECRET_KEY
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

passport.use(new JwtStrategy(jwtOptions, verifyUser))
