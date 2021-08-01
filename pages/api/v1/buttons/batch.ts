import { VercelRequest, VercelResponse } from "@vercel/node"
import prisma from "../../../../lib/prisma"
import { APIKEY } from "../../../../utils/config"

export default async function (req: VercelRequest, res: VercelResponse) {
  const responseData = {
    data: {
      attributes: {
        responses: [],
      },
      type: "batch",
    },
  }
  const batchResponseData = {
    data: {
      attributes: {},
      id: null,
      type: "batch",
    },
  }
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
  if (!req.body || req.method !== "POST") {
    res.status(400)
    return res.json({ error: "Bad request" })
  }

  const checkInStorage = async (namespace = "demo", id, type) => {
    try {
      let totalKey
      let votedKey
      let votedValue = null
      switch (type) {
        case "clap_button":
          totalKey = "total_claps"
          votedKey = "user_has_voted"
          break
        case "like_button":
          totalKey = "total_likes"
          votedKey = "user_has_liked"
          break
        case "updown_button":
          totalKey = "total_score"
          votedKey = "user_vote_direction"
          break
        default:
          break
      }

      const isNamespaceExist = await prisma.vote.findFirst({
        where: {
          namespace,
          slug: id,
          type,
        },
      })
      if (!isNamespaceExist) {
        return {
          ...batchResponseData,
          data: {
            id,
            type,
            attributes: {
              [totalKey]: 0,
              [votedKey]: votedKey === "user_vote_direction" ? 0 : false,
              namespace,
            },
          },
        }
      }

      let isUserVoteExist = await prisma.userVote.findFirst({
        where: {
          userId: sessionId,
          voteId: isNamespaceExist.id,
        },
      })
      switch (type) {
        case "like_button":
          votedValue = isUserVoteExist?.hasLiked
          break
        case "updown_button":
          votedValue = isUserVoteExist?.voteDirection
          break
        case "clap_button":
          votedValue = isUserVoteExist?.voteDirection === 1
          break
        default:
          break
      }

      return {
        ...batchResponseData,
        data: {
          id,
          attributes: {
            [totalKey]: isNamespaceExist.total,
            [votedKey]: votedValue,
            user_claps: 1,
            namespace,
          },
          type,
        },
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const {
    data: {
      attributes: { urls },
    },
  } = req.body

  async function waitingFiles(urls) {
    if (urls && urls.length > 0) {
      await Promise.all(
        urls.map(async (url) => {
          const splitUrl = url.split("/")
          const type = splitUrl[1]
          const namespace = splitUrl[2]
          const id = splitUrl[3]
          responseData.data.attributes.responses.push(
            await checkInStorage(
              namespace,
              id,
              type.slice(0, -1).replace("-", "_")
            )
          )
        })
      )
    }
  }

  await waitingFiles(urls)

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

  res.status(201)
  res.json(responseData)
}
