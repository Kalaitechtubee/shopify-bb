import urllib.request
import re

try:
    url = 'https://hairdareyou.world/products/splash-flow-lavender?variant=5234731588068'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print('Fetched. Size:', len(html))
    
    # search for id="MainContent" or class="content-for-layout"
    match = re.search(r'<main[^>]*id=["\']MainContent["\'][^>]*>', html)
    if match:
        idx = match.start()
        print('MainContent start tag:', match.group(0))
        # Print next 3000 chars to see wrappers
        print(html[idx:idx+3000])
    else:
        print('MainContent not found!')
except Exception as e:
    print('Error:', e)
