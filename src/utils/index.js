import {
    adjectives,
    nons
} from './words'

export const generateSecret = () => {
    const randomNumber = Math.floor(Math.random() * adjectives.length)
    return `${adjectives[randomNumber]} ${nons[randomNumber]}`
}
