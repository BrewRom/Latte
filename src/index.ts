const server = Bun.serve({
  routes: {
    "/style": new Response(Bun.file("src/pages/style.css")),
    "/files/:name": req => {
      return new Response(Bun.file(`files/${req.params.name}`));
    },
    "/*": new Response(Bun.file("src/pages/index.html"))
  }
})

console.log(`server running at http://${server.hostname}:${server.port} `)