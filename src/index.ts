import rwClient from '../twitterConfig'
import sleep from '../src/utils/sleep'

const newTweet = async (message: string) => {
  try {
    await rwClient.v2.tweet(message)
    console.log(`Tweeted: "${message.slice(0, 10)}...". Check your profile.`)
  } catch (e) {
    console.error(e)
  }
}

const getUserDetails = async (username: string) => {
  // must be by specific name. For example. If you're "@JohnSmith", use "JohnSmith"
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
  const userTweets = []
  const user = await getUserDetails(username)
  if (!user) return ['No user for this username found.']

  // Loop over user's timeline and get all tweets
  console.log('Looking for tweets...')
  const firstRequest = await rwClient.v2.userTimeline(user!.ID)

  const tweets = firstRequest['_realData'].data
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
      //   max_results: 100,
      //   exclude: ['retweets', 'replies'],
    })
    const currToken = paginatedRequest.meta.next_token

    if (currToken) {
      if (counter > 5) hasNextPage = false //! remove - using to control tweet flow

      const tweets = paginatedRequest['_realData'].data
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

const deleteTweets = async (tweetIDs: string[]) => {
  let deleteCount = 0

  tweetIDs.map(async (tweetID: string) => {
    try {
      await rwClient.v2.deleteTweet(tweetID)
      console.log(`Deleted tweet with ID of "${tweetID}"`)
      deleteCount++
      sleep(500)
    } catch (e) {
      console.error(e)
    }
  })

  return `Removed ${deleteCount} tweets from your timeline.`
}

const main = async () => {
  const tweets = await getUserTweets('chrisdeleon64')

  // tweets is an array of objects. loop through and delete each by id
  // tweets.map((tweet) => console.log(tweet))
  console.log(typeof tweets[0])
  console.log(tweets[0])
}

main()
