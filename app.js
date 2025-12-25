// This file is necessary for cpanel deployment.

const { createServer } = require('http')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(process.env.PORT || 3000, () => {
    console.log('Next.js running on port ' + (process.env.PORT || 3000))
  })
})
