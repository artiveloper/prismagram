import jwt from 'jsonwebtoken';
import {
    adjectives,
    nons
} from './words'

export const generateSecret = () => {
    const randomNumber = Math.floor(Math.random() * adjectives.length)
    return `${adjectives[randomNumber]} ${nons[randomNumber]}`
}

export const generateToken = (id) => jwt.sign({id}, process.env.SECRET_KEY)
