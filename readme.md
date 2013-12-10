# Socialr

Socialr is a web app built with Node.js and Ember.js that enables you to analyze who talks about your content, how influential they are and what online social conversations they spawn.

# Current status

Beta. Please file any bugs [here](https://github.com/cwarny/social-media-analytics/issues).

# Getting started

```
$ git clone git@github.com:cwarny/social-media-analytics.git # or download the zip and unzip

$ npm install
```

- You will need [set up a web app project with a Google APIs account](https://developers.google.com/console/help/?hl=fr&csw=1). A Google client ID and a Google client secret will be associated to your web app, which will allow you to consume the Google APIs.

- Next, you will need [to create a Twitter app](https://dev.twitter.com/apps). This will provide you with a Twitter client ID and a Twitter client secret.

For both the Google app and the Twitter app, set the callback URLs respectively as ***your-domain*/auth/google/callback** and ***your-domain*/connect/twitter/callback**.

You will have to set these IDs, secrets and callback URLs as environment variables for your back-end Node application (or hard-code them in the source code).

# Concept

This web app grabs your Google Analytics account data, checks your site's visitors data for Twitter [shortened URLs](https://support.twitter.com//entries/109623) as referrers. 

![referrers list](http://a1.distilledcdn.com/wp-content/uploads/2011/08/tco.png)

If Twitter shortened URLs appear in your list of referrers, it means people tweeted your page's URL and other people clicked on the URL embedded in the tweet to land on your page.

Since these Twitter shortened URLs are unique to the users who encoded them, it is possible to link your Google Analytics data with Twitter data and trace back:

- Who tweeted about your web content;
- How many clicks per hour was generated per referring tweet;
- What conversations (retweets and replies) were spawned by each referring tweet.

More about this can be found [here](http://nbviewer.ipython.org/6442821).

Providing you with that information through an easy-to-navigate web app is the goal of Socialr.