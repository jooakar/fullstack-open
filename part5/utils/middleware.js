import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'
import { SECRET } from './config.js'

export const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization')
  request.token =
    authorization && authorization.startsWith('Bearer ')
      ? authorization.replace('Bearer ', '')
      : null
  next()
}

export const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }
  const decoded = jwt.verify(request.token, SECRET)
  request.user = await User.findById(decoded.id)
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  next()
}

export const unknownEndpoint = (_request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

export const errorHandler = (error, _request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  next(error)
}
