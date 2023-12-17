import type { AWS } from '@serverless/typescript'

const functions: AWS["functions"] = {
  combination: {
    handler: 'src/functions/combination/index.handler',
    events: [
      {
        httpApi: {
          path: '/game-deals',
          method: 'get',
        }
      }
    ]
  }
}

export default functions