from oauth2client.file import Storage
from apiclient.discovery import build
import httplib2
from apiclient.errors import HttpError
from oauth2client.client import AccessTokenRefreshError
import sys

TOKEN_FILE_NAME = 'analytics.dat'

credentials = Storage(TOKEN_FILE_NAME).get()

http = httplib2.Http()
http = credentials.authorize(http)
service = build('analytics', 'v3', http=http)

def get_referrers(table_id,start_date,end_date,start_index='1',max_results='25'):
    results = None
    try:
        # Attempt making the request.
        results = service.data().ga().get(ids=table_id,start_date=start_date,end_date=end_date,metrics='ga:visitors,ga:visits',dimensions='ga:fullReferrer,ga:dateHour',filters='ga:source==t.co',start_index=start_index,max_results=max_results).execute()
    
    except AccessTokenRefreshError:
        print >> sys.stderr, 'The credentials have been revoked or expired, please re-run the application to re-authorize'
    
    except HttpError, error:
        print >> sys.stderr, 'Arg, there was an API error : %s %s : %s' % (error.resp.status, error.resp.reason, error._get_reason())
    
    return results