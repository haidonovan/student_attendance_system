

// import { PrismaClient } from './generated/prisma'
import { PrismaClient } from '@prisma/client'

let prisma

if (!global.prisma) {
  global.prisma = new PrismaClient()
}

prisma = global.prisma

export { prisma }
