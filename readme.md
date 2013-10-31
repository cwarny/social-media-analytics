# Socialr

Socialr enables you to analyze who talks about your content, how influential they are and what online social conversations they spawn.

# Current status

Still in development.

# Concept

This web app grabs your Google Analytics account data, checks your site's visitors data for Twitter [ghost URLs](https://support.twitter.com//entries/109623) as referrers. 

![referrers list](http://a1.distilledcdn.com/wp-content/uploads/2011/08/tco.png)

If Twitter ghost URLs appear in your list of referrers, it means people tweeted your page's URL and other people clicked on the URL embedded in the tweet to land on your page.

Since these Twitter ghost URLs are unique to the users who encoded them, it is possible to link your Google Analytics data with Twitter data and trace back:

- Who tweeted about your web content;
- How many clicks per hour was generated per referring tweet;
- What conversations (retweets and replies) were spawned by each referring tweet.

More about this can be found [here](http://nbviewer.ipython.org/6442821).

Providing you with that information through an easy-to-navigate web app is the goal of Socialr.