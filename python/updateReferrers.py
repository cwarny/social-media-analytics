from pymongo import Connection
import json

c = Connection(host="localhost", port=27017)

dbh = c["sma"]

dbh.accounts.update({"id":"42931498"},{"$set":{"webproperties.0.profiles.0.referrers":json.load(open("graph.json"))}}, safe=True)
    
    