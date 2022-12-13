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
  let counter = 0
  const userTweets: userTweetTypes[][] = []
  const user = await getUserDetails(username)
  if (!user) return ['No user for this username found.']

  // Loop over user's timeline and get all tweets
  console.log('Looking for tweets...')
  const firstRequest = await rwClient.v2.userTimeline(user!.ID)

  const tweets: userTweetTypes[] = firstRequest['_realData'].data
  if (tweets) userTweets.push(tweets.map((tweet) => tweet))

  // Start Paginating if theres more tweets
  let hasNextPage = true
  let nextToken = firstRequest.meta.next_token

  while (hasNextPage) {
    const paginatedRequest = await rwClient.v2.userTimeline(user!.ID, {
      pagination_token: nextToken,
      //   start_time: undefined,
      //   end_time: undefined,
      //   max_results: 10,
      //   exclude: ['retweets', 'replies'], //
    })

    if (paginatedRequest.meta.next_token) {
      //   if (counter > 200) hasNextPage = false //! remove - using to control tweet flow instead of deleting all tweets

      const tweets: userTweetTypes[] = paginatedRequest['_realData'].data
      if (tweets) {
        console.log(`Searching page ${counter} for tweets...`)
        userTweets.push(tweets.map((tweet) => tweet))
      }

      nextToken = paginatedRequest.meta.next_token
      counter++
    } else hasNextPage = false
  }

  if (!userTweets.length) return ['No available tweets for this user.']
  console.log(`Found ${userTweets.flat().length} total tweets.`)
  return userTweets.flat()
}

const deleteTweetV1 = async (tweetID: string) => {
  let deleteCount = 0
  try {
    v1Client.post(`statuses/destroy/${tweetID}.json`, () => {
      deleteCount++
    })

    console.log(`Found tweet with ID of "${tweetID}"`)
    sleep(50)
  } catch (e) {
    throw new Error(`Failed with error: ${e}`)
  }

  return console.log(`Deleted a total of ${deleteCount} tweets from your timeline`)
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
