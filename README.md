# Tweet-Delete 🐦

🔨 A lightweight tool for mass removing tweets from your timeline 🔨

❌ This will permanently erase tweets from your timeline with no recourse outside [backing up your tweets](https://help.twitter.com/en/managing-your-account/how-to-download-your-twitter-archive). Tread carefully. ❌

## Sample Image:

<img width="429" alt="Screenshot 2022-12-12 at 11 36 54 PM" src="https://user-images.githubusercontent.com/49052244/207235346-75015d39-f772-47ae-843c-b951eb8141db.png">

## How to use:

### 1) Installing the project

1.  Download the repo on your local machine:

    ```bash
    git clone https://github.com/Vroomfrondal/Tweet-Delete.git
    ```

2.  Navigate into the directory and install dependencies:
    ```bash
    npm install
    ```

### 2) Authenticating your Twitter Account

[Per Twitter Rules](https://developer.twitter.com/en/support/twitter-api/developer-account#:~:text=All%20Twitter%20API%20access%20requires,Elevated%20access%20can%20be%20requested.), the only way to utilize this tool is to apply for a developer account in order to use your own API keys. It takes a minute but is most definitely faster than manually deleting your tweets, I suppose.

- Authenticating directions:
  1. Put in an [developer account application](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api) on twitter's website.
  2. Once granted access, log into your new [developer portal](https://developer.twitter.com/), and navigate to the `#projects` tab.
  3. Create a new project/app (you're allowed one app per free twitter account).
  4. ❗Important❗ click **"User Authentication Setings"** and follow the prompts on screen to allow the app Read and Write permissions - otherwise you won't allow the Twitter API to read your profile and delete your tweets!
  5. Give a **name**, **description**, **website** (any url such as `https://www.google.com` or your own portfolio website), and **callback url** (just your ip address that you can find [here on google](https://www.google.com/search?q=what%27s+my+ip&oq=what%27s+my+ip&aqs=chrome..69i57j0i512j0i433i512j0i512l5.1283j1j7&sourceid=chrome&ie=UTF-8). I.e:`https://173.000.000.000`)
  6. Apply for [elevated access](https://developer.twitter.com/en/portal/products/elevated) (its free) in order to use the V1 API for deleting tweets (must use v1 because v2 has a 50 tweet-limit per 15 minutes)
  7. In the root of the directory create an `.env` file and copy/paste your new Twitter Apps Api Keys (don't wrap the values in parentheses or you'll get an error):
  ```js
  appKey = consumer_key
  appSecret = consumer_secret_key
  accessToken = access_token
  accessSecret = access_token_secret
  ```
  7. ✅ Your account is now setup and you can execute the script.

**If you're not comfortable with such concise directions, you can read about [Twitter OAuth 1.0A](https://developer.twitter.com/en/docs/authentication/oauth-1-0a) as well as checking out some other videos of people doing a [similar process](https://www.youtube.com/watch?v=fD-GRCH_tks&t=419s) for their apps.**

### 3) Using the script

- navigate to the root of the directory and run this CLI command:
  ```bash
  npm run start   // runs index.ts file inside /src
  ```
- Enter your twitter username when prompted in the CLI (no @ sign)

### Dev Details

- [Twitter V2 API](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api)
- Uses the [Twitter V1 API](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-destroy-id) for deleting tweets to get around the V2 50-delete limit.
- Written in TypeScript to run with TS-Node
- The [dot-env](https://www.npmjs.com/package/dotenv) library and gitignore handle api keys. Commit to source comfortable if all keys are stored in your `.env` file.
- Utilizes Twitter's `OAuth 1.0a User Context` system to authenticate users based on your developer account and application's app keys.
