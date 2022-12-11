import rwClient from './twitterConfig'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const newTweet = async (message: string) => {
  try {
    // console.log('rwClient: ', rwClient)

    await rwClient.v2.tweet(message)
    console.log(`Tweeted: "${message.slice(0, 10)}...". Check your profile.`)
  } catch (e) {
    console.error(e)
  }
}

const deleteTweet = async (tweetID: string) => {
  try {
    await rwClient.v2.deleteTweet(tweetID)
  } catch (e) {
    console.error(e)
  }

  return
}

newTweet('Test')
// deleteTweet('')
