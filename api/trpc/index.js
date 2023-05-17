var { initTRPC } = require('@trpc/server');
let trpcExpress = require('@trpc/server/adapters/express');
const UserController = require('../controllers/user');
var { z } = require('zod');

// created for each request
const createContext = ({
    req,
    res,
}) => ({}); // no context
const t = initTRPC.context().create();


const publicProcedure = t.procedure;

const appRouter = t.router({
    hello: publicProcedure.query(()=> "Hello world!"),
    user: publicProcedure.mutation(UserController.updateUser)
});

module.exports = { createContext, appRouter}