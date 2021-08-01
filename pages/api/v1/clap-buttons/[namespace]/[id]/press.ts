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
      let total_claps
      if (!isNamespaceExist) {
        isNamespaceExist = await prisma.vote.create({
          data: {
            slug: id,
            namespace,
            total: 1,
            type,
          },
        })
        total_claps = 1
      } else {
        total_claps = isNamespaceExist.total + 1
        await prisma.vote.update({
          where: {
            id: isNamespaceExist.id,
          },
          data: {
            total: total_claps,
          },
        })
      }
      await prisma.userVote.create({
        data: {
          userId: isUserExist.id,
          voteId: isNamespaceExist.id,
          voteDirection: 1,
          hasLiked: null,
        },
      })

      return {
        ...responseData,
        data: {
          id,
          attributes: {
            total_claps,
            user_has_voted: true,
            user_claps: 1,
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
  const result = await checkInStorage(namespace, id, "clap_button")
  if (!result) {
    res.status(500)
    res.json({ error: "Internal Server Error" })
  } else {
    res.status(201)
    res.json(result)
  }
}
