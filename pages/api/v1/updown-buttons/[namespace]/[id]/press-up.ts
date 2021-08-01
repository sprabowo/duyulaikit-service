import { VercelRequest, VercelResponse } from "@vercel/node"
import prisma from "../../../../../../lib/prisma"
import { APIKEY } from "../../../../../../utils/config"

export default async function (req: VercelRequest, res: VercelResponse) {
  const responseData = {
    data: {
      attributes: {},
      id: null,
      type: "batch",
    },
  }
  const namespace = req.query.namespace as string
  const id = req.query.id as string
  const { authorization } = req.headers
  const sessionId = req.headers["x-session-id"] as string
  const token = authorization.split("Bearer ")[1]
  if (!authorization || !token) {
    res.status(401)
    return res.json({ error: "Unauthorized" })
  }
  if (token !== APIKEY) {
    res.status(403)
    return res.json({ error: "Forbidden" })
  }
  if (!req.body || req.method !== "PUT" || !namespace || !id) {
    res.status(400)
    return res.json({ error: "Bad request" })
  }

  let isUserExist = await prisma.user.findFirst({
    where: {
      id: sessionId,
    },
  })
  if (!isUserExist) {
    isUserExist = await prisma.user.create({
      data: {
        id: sessionId,
      },
    })
  }

  const checkInStorage = async (namespace = "demo", id, type) => {
    try {
      let isNamespaceExist = await prisma.vote.findFirst({
        where: {
          namespace,
          slug: id,
          type,
        },
      })
      if (!isNamespaceExist) {
        isNamespaceExist = await prisma.vote.create({
          data: {
            slug: id,
            namespace,
            total: 0,
            type,
          },
        })
      }

      let votedValue
      let total
      let isUserVoteExist = await prisma.userVote.findFirst({
        where: {
          userId: sessionId,
          voteId: isNamespaceExist.id,
        },
      })
      if (!isUserVoteExist) {
        await prisma.userVote.create({
          data: {
            userId: isUserExist.id,
            voteId: isNamespaceExist.id,
            voteDirection: 1,
            hasLiked: null,
          },
        })
        total = isNamespaceExist.total + 1
        votedValue = 1
        await prisma.vote.update({
          where: {
            id: isNamespaceExist.id,
          },
          data: {
            total,
          },
        })
      } else {
        total =
          isUserVoteExist.voteDirection === -1
            ? isNamespaceExist.total + 2
            : isUserVoteExist.voteDirection === 0
            ? isNamespaceExist.total + 1
            : isNamespaceExist.total - 1
        await prisma.vote.update({
          where: {
            id: isNamespaceExist.id,
          },
          data: {
            total,
          },
        })
        votedValue = isUserVoteExist.voteDirection <= 0 ? 1 : 0
        await prisma.userVote.update({
          where: {
            id: isUserVoteExist.id,
          },
          data: {
            voteDirection: votedValue,
          },
        })
      }

      return {
        ...responseData,
        data: {
          id,
          attributes: {
            total_score: total,
            user_vote_direction: votedValue,
            namespace,
          },
          type,
        },
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  )
  const result = await checkInStorage(namespace, id, "updown_button")
  if (!result) {
    res.status(500)
    res.json({ error: "Internal Server Error" })
  } else {
    res.status(201)
    res.json(result)
  }
}
