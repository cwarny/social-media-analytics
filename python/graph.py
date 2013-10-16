import json
import networkx as nx
from networkx.readwrite import json_graph

tweets = json.load(open("parsed_tweets.json"))

def build_graph(g,tweets):
    for tweet in tweets:
        if tweet.has_key("clicks"):
            for click in tweet["clicks"]:
                g.add_edge(tweet["id"],click["id"])
                g.node[click.pop("id")] = click
            
        if tweet.has_key("children"):
            for child in tweet["children"]:
                g.add_edge(tweet["id"],child["id"])
                
            build_graph(g,tweet["children"])
            
        g.node[tweet.pop("id")] = tweet
        
    return g

g = build_graph(nx.Graph(),tweets)
nld = json_graph.node_link_data(g)

json.dump(nld, open('graph.json','w'), indent=4)