# igh-site

Official static website of [igh.inc](https://igh.inc) deployed via [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/).

## Development

Clone this repository and start the local dev server:

```sh
python3 -m http.server 8000 --directory public
```

And visit `http://localhost:8000` to preview changes.

## Deployment

[Cloudflare Pages](https://pages.cloudflare.com/) serves the `public` directory.

```text
Framework preset: None
Build command: none
Build output directory: public
Production branch: master
```
