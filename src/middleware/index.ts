import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application } from 'express'

/**
 * bypass middlewares to app
 * @param app {Application}
 */
const applyMiddlewares = (app: Application) => {
	// @ts-ignore
	app.use(cookieParser());
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static("public"));
}

export default applyMiddlewares
