import fastify from "fastify";

const server = fastify();

server.listen({port: 3001}, (err, address) => {
    if (err) {
        console.error(err);
    }
    console.log(`Server listening at ${address}`);
})