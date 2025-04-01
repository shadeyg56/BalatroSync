import fastify from "fastify";
import fs from "fs";
import archiver from "archiver";
import multipart from "@fastify/multipart"
import { pipeline } from "node:stream/promises"


const server = fastify();
server.register(multipart, {
    limits: {
        files: 1,
        fileSize: 10000
    }
}
);


const saveFolder = "./saves"

server.listen({port: 3001}, (err, address) => {
    if (err) {
        console.error(err);
    }
    console.log(`Server listening at ${address}`);

});

server.get("/downloadsave", async (request, reply) => {
    if (!fs.existsSync(saveFolder)) {
        console.error("bruh");
        reply.code(400)
        reply.send("No save available");
        return;
    }
    const archive = archiver("zip");
    archive.directory(saveFolder, false);
    archive.pipe(reply.raw);
    await archive.finalize();

});

server.post("/uploadsave", async (request, reply) => {
    const fileData = await request.file();
    if (!fileData){
        reply.code(400);
        return;
    }

    if (fileData.mimetype !== "application/zip") {
        reply.code(400);
        return;
    }

    await pipeline(fileData.file, fs.createWriteStream(`${saveFolder}/save.zip`));

    reply.send(200);
})