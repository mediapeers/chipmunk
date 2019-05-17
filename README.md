# CHIPMUNK

## main goals

### NOTES

* slim & simple compared to _chinchilla_
* better suited for react apps
* functional with hopefully no memory leaks
* tested

### DONE

* no differenciation between member/collection actions..
* simple interface for PUT/POST requests
* proper error handling instead of non-resolving promises
* no cookie management
* optional ruby on rails object formatting, or implicitly via a flag in specifications indicating a specific action supports rails nested attributes
* manual association resolving
* return reduced result set based on given attributes
* _viscacha_-like association resolve functionality

### TODO

* caching

### interface

#### setup, run blocks (always use run blocks!)

```javascript
const chipmunk = createChipmunk({
  errorInterceptor: (err) => true,
  headers: { 'Affiliation-Id': 'mpx' }
})

chipmunk.run(async (ch) => {
  // to change config
  ch.updateConfig({ headers: { 'Session-Id': '345dfgsdfgw43..' } })

  // requests.. e.g.
  await ch.context('um.user')

  // an error happens
  throw new Error('foo')
}, (err) => {
  // error handler is optional
  console.log(err.message) // would print 'foo'
})

```

#### contexts

```javascript
// get context
await ch.context('um.user')
```

#### actions

```javascript
// get user, default method
await ch.action('um.user', 'get', { params: { user_id: 3 } })
```

```javascript
// get user with associations resolved & limited attribute set
await ch.action('um.user', 'get', {
  params: { user_id: 3 },
  schema: `
    id, first_name,
    organization { name },
  `
})
```

```javascript
// create new user
await ch.action('um.user', 'create', {
  body: {
    first_name: 'john',
    last_name: 'doe',
    ...rest,
  }
})
```

```javascript
// update existing user
await ch.action('um.user', 'update', {
  params: { user_id: 3 },
  body: {
    first_name: 'johnny',
  }
})

// update existing users
await ch.action('um.user', 'update', {
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

user1['@associations']['organization'] // => https://url.to/organization/2'
user1.organization // => NotLoadedError!

const orgResult = await ch.fetch(users, 'organization') // => returns all associated organizations as ChipmunkResult
users = ch.assign(users, orgResult.objects, 'organization')
users[0].organization // => returns org of first user

// alternatively..
users = await ch.fetchAndAssign(users, 'organization')
users[0].organization // => returns org of first user
```
