import json
import random

tweets = json.load(open("tweets.json"))

def parse(tweets,depth,i):
    depth += 1
    for tweet in tweets:
        if depth == 0:
            if tweet.has_key("in_reply_to_status_id"):
                del tweet["in_reply_to_status_id"]
            if tweet.has_key("retweeted_status"):
                del tweet["retweeted_status"]
            tweet["clicks"] = []
            hour = 1
            for x in range(random.randrange(1,10)):
                i += 1
                hourstring = "%02d" % (hour,)
                tweet["clicks"].append({"count": random.randrange(1,5),"created_at": "20130910" + hourstring, "id":i})
                hour += 1
            tweet["totalClicks"] = sum(map(lambda x: x["count"],tweet["clicks"]))
        if tweet.has_key("children") and tweet.get("children"):
            parse(tweet["children"],depth,i)
            
    return tweets
    
tweets = parse(tweets,-1,0)

json.dump(tweets, open("parsed_tweets.json","w"), indent=4)