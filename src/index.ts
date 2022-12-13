import rwClient from '../twitterConfig'
import sleep from '../src/utils/sleep'
import readline from 'readline'
import { userTweetTypes } from './typings'

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
  const firstRequest = await rwClient.v2.userTimeline(user!.ID, { exclude: ['retweets'] })

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
      exclude: ['retweets'], //"replies"
    })
    const currToken = paginatedRequest.meta.next_token

    if (currToken) {
      if (counter > 10) hasNextPage = false //! remove - using to control tweet flow

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

const deleteTweet = async (tweetID: string) => {
  try {
    await rwClient.v2.deleteTweet(tweetID)
    console.log(`Deleted tweet with ID of "${tweetID}"`)
    sleep(500)
  } catch (e) {
    console.error(e)
  }

  return `Removed tweet with ID of "${tweetID}" from your timeline.`
}

const main = async () => {
  await new Promise(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Enter your twitter username: ', async (username) => {
      const tweets = (await getUserTweets(username)) as userTweetTypes[]

      // deleting all tweets found
      tweets.map((tweet) => {
        console.log(tweet)
        // deleteTweet(tweet.id)
      })

      console.log('Closing Program...')
      rl.close()
    })
  })
}

main()
