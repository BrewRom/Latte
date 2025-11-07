/*
const server = Bun.serve({
  routes: {
    "/style": new Response(Bun.file("src/pages/style.css")),
    "/files/:name": req => {
      return new Response(Bun.file(`files/${req.params.name}`));
    },
    "/*": new Response(Bun.file("src/pages/index.html"))
  }
})


*/

const server = Bun.serve({
  fetch(req, server) {

    if (server.upgrade(req)) {
      console.log("Success");
    }

    const path = new URL(req.url).pathname;

    if (path == "/") {
      return new Response(Bun.file("src/pages/index.html"));
    }

    if (path == "/style") {
      return new Response(Bun.file("src/pages/style.css"));
    }

    if (path.includes("/files")) {
      const file = decodeURIComponent(path);
      return new Response(Bun.file(file.substring(1)));
    }

    if (path.includes("/nes")) {
      return new Response(Bun.file("src/pages/nes.html"))
    }

    return new Response("");
  },
  websocket: {
    message(ws, message) {
      console.log(message);
    },
    open(ws) {
      console.log("Connected");
    },
    close(ws, code, reason) {
      
    },
  }
})

console.log(`server running at http://${server.hostname}:${server.port} `)
