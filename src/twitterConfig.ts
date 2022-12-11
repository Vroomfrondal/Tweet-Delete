import { TwitterApi } from 'twitter-api-v2'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const client = new TwitterApi({
  appKey: process.env.appKey!,
  appSecret: process.env.appSecret!,
  accessToken: process.env.accessToken!,
  accessSecret: process.env.accessSecret!,
})

const rwClient = client.readWrite

export default rwClient
