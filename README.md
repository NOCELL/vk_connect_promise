# VK Connect promisify

Module for working with API callings as Promise 

## Init

```javascript

import connect from '@vkontakte/vkui-connect'
import connect_promise from 'vk_connect_promise'

connect.subscribe(connect_promise.resolver)
```

## Methods

### .call

Call VK Connect method

```javascript
await connect_promise.call("VKWebAppShare", {"link": "https://vk.com/nocell"});
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

### .updateToken 

Set token for call VK API methods via execute-wrapper

```javascript
const {
    data: { access_token },
} = await connect_promise.getToken(app_id, '')
connect_promise.updateToken(access_token)
```

### .execute 

Make VK API request via execute-wrapper

```javascript
const data = await connect_promise.api('users.get', {
    user_ids: '1',
    v: '5.92',
    access_token: this.state.token,
})
```
