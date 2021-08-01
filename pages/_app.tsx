import { Provider } from "@lyket/react"
import { APIKEY, BASE_API_URL } from "~/utils/config"
import "tailwindcss/tailwind.css"

export default function App({ Component, pageProps }) {
  return (
    <Provider apiKey={APIKEY} baseUrl={BASE_API_URL}>
      <Component {...pageProps} />
    </Provider>
  )
}
