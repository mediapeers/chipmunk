# CHIPMONK

## main goals

* slim & simple compared to _chinchilla_
* better suited for react apps
* no differenciation between member/collection actions..
* tested
* return reduced result set based on given attributes
* _viscacha_-like association resolve functionality
* functional
* simple interface for PUT/POST requests

### interface

#### contexts

```javascript
// get context
await ch.context('um.user')
```

#### actions

```javascript
// interface
ch.req = (
  appAndModel: string,
  params: { [s: string]: any },
  options: { [s: string]: any }
) => Promise<ChipmonkResult>
```

```javascript
// get user, default method
await ch.req('um.user', 'get', { ...options, params: { user_id: 3 } })
```

```javascript
// get user with associations resolved & limited attribute set
await ch.req('um.user', 'get', {
  ...options,
  params: { user_id: 3 },
  schema: `
    id, first_name,
    organization { name },
  `
})
```

```javascript
// create new user
await ch.req('um.user', 'create', {
  body: {
    first_name: 'john',
    last_name: 'doe',
    ...rest,
  }
})
```

```javascript
// update existing user
await ch.req('um.user', 'update', {
  params: { user_id: 3 },
  body: {
    first_name: 'johnny',
  }
})

// update existing users
await ch.req('um.user', 'update', {
  body: {
    '3': {
      first_name: 'johnny',
    },
    '5': {
      first_name: 'hermine',
    },
  }
})
```

#### associations

to manually resolve associations:

```javascript
// fetch organizations for given users
let users = [user1, user2, user3] // ..requested earlier

user1['@organization'] // => { @id: 'https://url.to/organization/2' }
user1.organization // => NotLoadedError!

const orgResult = await ch.fetch(users, 'organization') // => returns all associated organizations as ChipmonkResult
users = ch.assign(users, orgResult.objects)
users[0].organization // => returns org of first user

// alternatively..
users = await ch.fetchAndAssign(users, 'organization')
users[0].organization // => returns org of first user
```
