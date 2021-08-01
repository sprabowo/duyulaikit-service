# Duyulaikit

Duyulaikit is a self hosted backend service for [Lyket](https://lyket.dev/). if you want to use Lyket service in paid version, i highly recommend it. this is experimental and purpose for fun only, you can use it in your personal website / blog. It's free

## Technologies

- [Vercel](https://vercel.com)
- [Railway](https://railway.app/new)

## Usage

Setup env and storage using Raleway

```sh
# go to railway.com/new > Provision new postgreSQL db
# get Postgres Connection URL
# e.g. postgresql://postgres:*****@*****.railway.app:*****/railway
# save as DATABASE_URL in .env

# generate api key with randomizer
openssl rand -base64 32
# save as NEXT_PUBLIC_API_KEY in .env
```

Deploy on vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsprabowo%2Fduyulaikit-service&env=NEXT_PUBLIC_API_KEY,DATABASE_URL&project-name=duyulaikit-service&repository-name=duyulaikit-service)

Embed lyket widget:

- React

```jsx
<Provider
  apiKey={NEXT_PUBLIC_API_KEY}
  baseUrl={NEXT_PUBLIC_VERCEL_URL + "/api"}
>
  <LikeButton id="post-1" namespace="demo" />
  <ClapButton id="post-2" namespace="demo" />
  <UpdownButton id="post-3" namespace="demo" />
</Provider>
```

- HTML/Wordpress

```html
<!-- If you want to use twitter like style -->
<!-- data-lyket-id and data-lyket-namespace is required -->
<div
  data-lyket-type="like"
  data-lyket-id="your-blog-post-1-slug"
  data-lyket-template="twitter"
  data-lyket-namespace="demo"
></div>

<!-- simple like style -->
<div
  data-lyket-type="like"
  data-lyket-id="your-blog-post-2-slug"
  data-lyket-template="simple"
  data-lyket-namespace="demo"
></div>

<!-- simple clap style -->
<div
  data-lyket-type="clap"
  data-lyket-id="your-blog-post-3-slug"
  data-lyket-template="simple"
  data-lyket-namespace="demo"
></div>

<!-- medium clap style -->
<div
  data-lyket-type="clap"
  data-lyket-id="your-blog-post-4-slug"
  data-lyket-template="medium"
  data-lyket-namespace="demo"
></div>

<!-- simple updown vote style -->
<div
  data-lyket-type="updown"
  data-lyket-id="your-blog-post-5-slug"
  data-lyket-template="simple"
  data-lyket-namespace="demo"
></div>

<!-- reddit updown vote style -->
<div
  data-lyket-type="updown"
  data-lyket-id="your-blog-post-6-slug"
  data-lyket-template="reddit"
  data-lyket-namespace="demo"
></div>

<script src="https://unpkg.com/@lyket/widget@1.3.5/dist/lyket.js?apiKey={NEXT_PUBLIC_API_KEY}&baseUrl={NEXT_PUBLIC_VERCEL_URL}/api"></script>
```

## Support

<a href="https://karyakarsa.com/sprabowo/tip" target="_blank"><img src="https://upload.karyakarsa.com/api/qrcode?url=sprabowo%2Ftip&size=200" alt="Karya Karsa" width="150px"></a> <a href="https://www.buymeacoffee.com/sprabowo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150px" height="auto"></a>
