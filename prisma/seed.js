const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const slug = "your-blog-post-slug"
  const vote = await prisma.vote.createMany({
    data: [
      {
        slug,
        namespace: "demo",
        type: "clap_button",
        total: 0,
      },
      {
        slug,
        namespace: "demo",
        type: "like_button",
        total: 0,
      },
      {
        slug,
        namespace: "demo",
        type: "updown_button",
        total: 0,
      },
    ],
  })
  console.log({ vote })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
