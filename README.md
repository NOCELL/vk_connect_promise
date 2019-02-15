# VK Connect promisify

Module for working with API callings as Promise 

### Init

```javascript

import connect from '@vkontakte/vkui-connect'
import connect_promise from 'vk_connect_promise'

connect.subscribe(connect_promise.resolver)
```

### .call

Ccalling VK Connect methods

```javascript
await connect_promise.send("VKWebAppShare", {"link": "https://vk.com/nocell"});
```


### .getToken

Get access_token for calling VK API methods

```javascript
const {
    data: {
        access_token
    }
} = await connect_promise.getToken(app_id, ['photos', 'friends']
```


### .api 

Make VK API request

```javascript
const {
    data: { response },
} = await connect_promise.api('users.get', {
    user_ids: '1',
    v: '5.92',
    access_token: this.state.token,
})
```

