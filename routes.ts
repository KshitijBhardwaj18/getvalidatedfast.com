/** 
 * An array of routes that are public to users
 * These routes will are public to all the users
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/auth/newverification",
    "/auth/reset",
    "/auth/newpassword"
];

export const authRoute = [
    "/auth/signin",
    "/auth/signup",
    "/auth/error"
]

export const apiAuthPrefix = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/dashboard"