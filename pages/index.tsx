import Head from "next/head"
import { ClapButton, UpdownButton } from "@lyket/react"

const IndexPage = () => (
  <div className="w-full flex justify-center items-center bg-gray-100 min-h-screen relative">
    <div className="flex flex-wrap max-w-xl px-4 md:px-0">
      <Head>
        <title>Duyulaikit demo</title>
      </Head>
      {/* <div className="w-full bg-white shadow-xl rounded-lg p-4 mb-4 last:mb-0">
        <h2 className="font-semibold text-lg mb-2">Blog post #1</h2>
        <p className="mb-2">
          Yeay this is my first post. please support me, hit like below
        </p>
        <LikeButton id="artikel-2" namespace="demo" />
      </div> */}
      <div className="w-full bg-white shadow-xl rounded-lg p-4 mb-4 last:mb-0">
        <h2 className="font-semibold text-lg mb-2">Blog post #2</h2>
        <p className="mb-2">I'm happy to launch my second post. clap it here</p>
        <ClapButton id="artikel-2" namespace="demo" />
      </div>
      <div className="w-full bg-white shadow-xl rounded-lg p-4 mb-4 last:mb-0">
        <h2 className="font-semibold text-lg mb-2">Blog post #3</h2>
        <p className="mb-2">
          This is my third post. you can give me feedback if you like or dislike
        </p>
        <UpdownButton id="artikel-2" namespace="demo" />
      </div>
    </div>
    <div className="absolute bottom-0 mx-auto mb-4">
      <a
        className="shadow-md"
        href="https://github.com/sprabowo/duyulaikit-service"
      >
        &lt; source code /&gt;
      </a>
    </div>
  </div>
)

export default IndexPage
