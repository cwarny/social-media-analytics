from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.file import Storage
from oauth2client.tools import run

FLOW = OAuth2WebServerFlow( client_id='898266335618-cforlp99f40vrc52t37l6roero0shhao.apps.googleusercontent.com',client_secret='JkXNJmjVGhHU69fr2nRiDh3W',scope='https://www.googleapis.com/auth/analytics.readonly',user_agent='analytics-api-v3-awesomeness')

TOKEN_FILE_NAME = 'analytics.dat'

storage = Storage(TOKEN_FILE_NAME)
credentials = storage.get()
if not credentials or credentials.invalid:
    # Get a new token.
    credentials = run(FLOW, storage)