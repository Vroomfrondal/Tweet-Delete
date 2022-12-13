import { rwClient, v1Client } from '../twitterConfig'
import { userTweetTypes } from './typings'
import sleep from '../src/utils/sleep'
import readline from 'readline'

const getUserDetails = async (username: string) => {
  try {
    const request = await rwClient.v2.userByUsername(username)

    const userData = {
      ID: request.data.id,
      UserName: request.data.username,
      DisplayName: request.data.name,
    }

    return userData
  } catch (e) {
    console.error(e)
  }
}

const getUserTweets = async (username: string, startTime?: string, endTime?: string) => {
  // Get user details
  const userTweets: userTweetTypes[][] = []
  const user = await getUserDetails(username)
  if (!user) return ['No user for this username found.']

  // Loop over user's timeline and get all tweets
  console.log('Looking for tweets...')
  const firstRequest = await rwClient.v2.userTimeline(user!.ID)

  const tweets: userTweetTypes[] = firstRequest['_realData'].data
  if (tweets) userTweets.push(tweets.map((tweet) => tweet))

  // Start Paginating if theres more tweets
  let counter = 0
  let hasNextPage = true
  let nextToken = firstRequest.meta.next_token

  while (hasNextPage) {
    const paginatedRequest = await rwClient.v2.userTimeline(user!.ID, {
      pagination_token: nextToken,
      start_time: undefined,
      end_time: undefined,
      //   exclude: ['retweets'], //"replies"
    })
    const currToken = paginatedRequest.meta.next_token

    if (currToken) {
      if (counter > 50) hasNextPage = false //! remove - using to control tweet flow

      const tweets: userTweetTypes[] = paginatedRequest['_realData'].data
      if (tweets) {
        console.log(`Searching page ${counter} for tweets...`)
        userTweets.push(tweets.map((tweet) => tweet))
      }

      nextToken = currToken
      counter++
    } else hasNextPage = false
  }

  if (!userTweets.length) return ['No available tweets for this user.']
  console.log(`Found ${userTweets.flat().length} total tweets.`)
  return userTweets.flat()
}

const deleteTweetV1 = async (tweetID: string) => {
  try {
    v1Client.post(`statuses/destroy/${tweetID}.json`, (res) => {
      if (!res) console.log(`Deleted Tweet with ID of "${tweetID}..."`)
      else console.log(res)
    })

    sleep(200)
  } catch (e) {
    throw new Error(`Failed with error: ${e}`)
  }

  return `Done removing tweets`
}

const main = async () => {
  await new Promise(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Enter your twitter username: ', async (username) => {
      const tweets = (await getUserTweets(username)) as userTweetTypes[]

      // Removing tweets from timeline!
      tweets.map(async (tweet) => await deleteTweetV1(tweet.id))
      rl.close()
    })
  })
}

main()
// 4705 tweets
