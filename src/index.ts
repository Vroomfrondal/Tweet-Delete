import rwClient from './twitterConfig'

const getUserDetails = async (username: string) => {
  // must be by specific name. For example. If you're "@JohnSmith", use "JohnSmith"
  try {
    const request = await rwClient.v2.userByUsername(username)

    const userData = {
      ID: request.data.id,
      UserName: request.data.username,
      DisplayName: request.data.name,
    }

    console.log(userData)
    return userData
  } catch (e) {
    console.error(e)
  }
}

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

getUserDetails('chrisdeleon64')

// newTweet('Test')
// deleteTweet('')
