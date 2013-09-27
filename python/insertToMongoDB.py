""" An example of how to insert a document """
import sys

from datetime import datetime
from pymongo import Connection
from pymongo.errors import ConnectionFailure

def main():
    try:
        c = Connection(host="localhost", port=27017)
    except ConnectionFailure, e:
        sys.stderr.write("Could not connect to MongoDB: %s" % e)
        sys.exit(1)
        
    dbh = c["sma"]
    assert dbh.connection == c
    
    referrer = {
        "username" : "janedoe",
        "firstname" : "Jane",
        "surname" : "Doe",
        "dateofbirth" : datetime(1974, 4, 12),
        "email" : "janedoe74@example.com",
        "score" : 0
    }

    dbh.referrers.insert(referrer, safe=True)
    print "Successfully inserted document: %s" % referrer

if __name__ == "__main__":
    main()