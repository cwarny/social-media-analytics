import json
from ga import get_referrers
from cascade import *
from collections import defaultdict

results = get_referrers(table_id='ga:75218327',start_date='2013-08-28',end_date='2013-08-30')

referrers = defaultdict(list)
for row in results["rows"]:
    referrers[row[0]].append({"time":row[1],"visitors":row[2],"visits":row[3]})

referrers = [{"url":k,"metrics":v} for k,v in referrers.items()]

twitter_api = oauth_login()

tweets = []
for referrer in referrers:
    new_tweets = twitter_search(twitter_api,referrer["url"],max_statuses=10,allow_children=False)
    for tweet in new_tweets:
        tweet["metrics"] = referrer["metrics"]
    tweets.extend(new_tweets)

build_tweet_tree(tweets)

json.dump(tweets,open("tweets_tree.json","w"),indent=1)