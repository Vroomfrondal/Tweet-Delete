import rwClient from './twitterConfig'

const newTweet = async (message: string) => {
  try {
    await rwClient.v2.tweet(message)
    console.log(`Tweeted: "${message.slice(0, 10)}...". Check your profile.`)
  } catch (e) {
    console.error(e)
  }
}

const deleteTweet = async (tweetID: string) => {
  try {
    await rwClient.v2.deleteTweet(tweetID)
    console.log(`Deleted tweet with ID of "${tweetID}"`)
  } catch (e) {
    console.error(e)
  }

  return
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

const getUserTweets = async (username: string) => {
  // Get user details
  const userTweets: any = []
  const user = await getUserDetails(username)
  if (!user) return 'No user for this username found.'

  console.log('Looking for tweets...')
  const firstRequest = await rwClient.v2.userTimeline(user!.ID)
  let hasNextPage = true
  let nextToken = firstRequest.meta.next_token

  while (hasNextPage) {
    const secondRequest = await rwClient.v2.userTimeline(user!.ID, {
      pagination_token: nextToken,
      start_time: undefined,
      end_time: undefined,
    })
    const currToken = secondRequest.meta.next_token

    if (currToken) {
      const tweets = secondRequest['_realData'].data
      if (tweets) {
        userTweets.push(tweets.map((tweet) => tweet.id))
      }

      nextToken = currToken
    } else hasNextPage = false
  }

  if (!userTweets.length) return ['No available tweets for this user.']
  console.log(userTweets.flat())
  return userTweets.flat()
}

getUserTweets('katekuenstller')
// getUserDetails('chrisdeleon64')
// newTweet('Test')
// deleteTweet('')
