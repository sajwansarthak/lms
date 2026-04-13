import { getAuth } from '@clerk/express'

/** Clerk Express v2 attaches `auth` as a callable; use `getAuth(req).userId`, not `req.auth.userId`. */
export function getClerkUserId(req) {
    return getAuth(req).userId
}
