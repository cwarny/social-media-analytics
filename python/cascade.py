from __future__ import division
import twitter
from robust import make_twitter_request

def oauth_login():
    CONSUMER_KEY = 'ZSQCknnf5fXbnF8xvj5PmQ'
    CONSUMER_SECRET = 'MtBrBUJR1kijGAiQLRfOclmEQ9JdDphH2aMB3xtT6g'
    OAUTH_TOKEN = '347348265-hkdqdSxQHppceJIELJoTNcW3l1SbKA60SRkWPPjL'
    OAUTH_TOKEN_SECRET = 'D1wgG5MUROZYQtPRZK2gYwzFcaZl61a93XfRVfdfc'
    
    auth = twitter.oauth.OAuth(OAUTH_TOKEN,OAUTH_TOKEN_SECRET,CONSUMER_KEY,CONSUMER_SECRET)
    return twitter.Twitter(auth=auth)

twitter_api = oauth_login()

def twitter_search(twitter_api,q,max_statuses=200,**kw):
    search_results = make_twitter_request(twitter_api.search.tweets,q=q,count=100) # Twitter enforces a maximum of 100 results per page
    statuses = filter(lambda x: not x.has_key('retweeted_status') and not x.get('in_reply_to_status_id'), search_results['statuses']) if not kw.get("allow_children") else search_results['statuses']
    max_statuses = min(1000,max_statuses)
    while len(statuses) < max_statuses and search_results["statuses"]: # Paginate through results as long as there are results or until we hit max_statuses
        # To get the next page of results, extract the "next results" page ID from the current results page, and use it in a new search
        try:
            next_results = search_results['search_metadata']['next_results']
        except KeyError, e:
            break
        kwargs = dict([kv.split('=') for kv in next_results[1:].split("&")])
        search_results = make_twitter_request(twitter_api.search.tweets,**kwargs)
        statuses += filter(lambda x: not x.has_key('retweeted_status') and not x.get('in_reply_to_status_id'), search_results['statuses']) if not kw.get("allow_children") else search_results['statuses']
        
    return statuses

def build_tweet_tree(tweet_array,depth=0):
    depth += 1
    for tweet in tweet_array:
        tweet['children'] = get_retweets(tweet)
        tweet['children'].extend(get_replies(tweet))
        if depth < 10:
            build_tweet_tree(tweet['children'],depth)

def get_retweets(tweet):
    if tweet.has_key('retweet_count'):
        return make_twitter_request(twitter_api.statuses.retweets, _id=tweet['id'])
    else:
        return []

def get_replies(tweet):
    q = "@%s" % tweet['user']['screen_name']
    replies = twitter_search(twitter_api,q,max_statuses=1000,allow_children=True)
    return filter(lambda t: t.get('in_reply_to_status_id') == tweet['id'], replies)

def geo_code(tweet):
    coordinates = None
    if tweet.get("place") and tweet["place"].get("full_name"):
        try:
            coordinates = g.geocode(tweet["place"]["full_name"], exactly_one=True)
            coordinates = list(coordinates[1][::-1])
        except:
            coordinates = None
    elif tweet["user"].get("location"):
        try:
            coordinates = g.geocode(tweet["user"]["location"], exactly_one=True)
            coordinates = list(coordinates[1][::-1]) 
        except:
            coordinates = None
    return coordinates

