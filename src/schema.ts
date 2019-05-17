import { each, isEmpty, isObject, split, trim, first, reduce, merge } from 'lodash'

const detectProps = (structure:string) => {
  let result = {}
  let edges =  [0]
  let delimiter = /({|}|,)/g
  let count = 0 // count of current bracket deepness
  var match

  while ((match = delimiter.exec(structure)) != null) {
    let character = first(match)

    if      (character == '{') count++
    else if (character == '}') count--
    else if (character == ',' && count == 0) {
      edges.push(match.index-1) // previous end
      edges.push(match.index+1) // next start
    }
  }
  if (count != 0) throw new Error('bad structure') // '{' vs '}' mismatch!

  edges.push(structure.length-1)

  while(edges.length > 0) {
    let curly
    let start  = edges.shift()
    let end    = edges.shift()
    let length = end-start
    let prop   = trim(structure.substr(start, length+1))
    if (isEmpty(prop)) continue

    if ((curly = prop.indexOf('{')) >= 0) {
      let rest  = prop.length - curly - 2
      let name  = trim(prop.substr(0, curly))
      let inner = prop.substr(curly+1, rest)

      result[name] = detectProps(inner)
    }
    else {
      result[prop] = true
    }
  }

  return result
}

export default (structure) => {
  if (isObject(structure)) return structure

  structure = (structure || '').replace(/\n|\r/g, "") // removes newlines
  return detectProps(structure)
}

/*

user
  first_name, last_name,
  organization
    name
    country
      name

  - get all users
  - get all user's organizations
  - get all organization's countries

  1. get users
  2. for all users, pick attributes
  3. fetch all organizations for users
  4. for all organizations, pick attributes
  5. fetch countries for all organizations
  6. for all countries, pick name

  const result = chch.action...

  const resolve = (objects, schema) => {
    const associations = filter(schema, isObject)

    promises = map(associations, async (assoc) => {
      try {
        const assocResult = await association(object, assoc.name)
        const assocResolved = resolve(assocResult.objects, schema[assoc.name])
        return assign(objects, assocResolved)
      }
      catch {
        // if we fail to resolve an association, continue anyways
        console.warn('...')
        return objects
      }
    })

    await Promise.all(promises)
    const data = map(objects, pick(object, keys(schema))
  }
 */
