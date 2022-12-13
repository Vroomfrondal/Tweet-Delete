import { TwitterApi } from 'twitter-api-v2'
import twitter from 'twitter'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

/* In order to use this file, in the root of the directory create
an '.env' file and paste your Developer Account's application api keys there */
const v2Client = new TwitterApi({
  appKey: process.env.appKey!,
  appSecret: process.env.appSecret!,
  accessToken: process.env.accessToken!,
  accessSecret: process.env.accessSecret!,
})

const v1Client = new twitter({
  consumer_key: process.env.appKey!,
  consumer_secret: process.env.appSecret!,
  access_token_key: process.env.accessToken!,
  access_token_secret: process.env.accessSecret!,
})

const rwClient = v2Client.readWrite

export { rwClient, v1Client }
