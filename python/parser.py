import json

tweets = [{"id":0,"created_at":"Tue Aug 27 11:39:00 +0000 2013","children":json.load(open("tweets.json"))}]

def parse(tweets,depth):
    depth += 1
    for tweet in tweets:
        print depth
        tweet["depth"] = depth
        if tweet.has_key("children") and tweet.get("children"):
            parse(tweet["children"],depth)
    return tweets
    
tweets = parse(tweets,-1)

json.dump(tweets, open("parsed_tweets.json","w"), indent=4)