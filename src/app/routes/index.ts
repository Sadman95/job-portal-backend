import express from 'express'
import { IRoute, routes } from './routes'

const router = express.Router()

routes.forEach((route: IRoute) => router.use(route.path, route.router))

export const RootRoutes = router
