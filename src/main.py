import fastapi
import fastapi.staticfiles
import fastapi.responses
import uvicorn
import asyncio

app = fastapi.FastAPI()
app.mount("/static", fastapi.staticfiles.StaticFiles(directory="static"), "static")


@app.get('/')
def root():
    return fastapi.responses.FileResponse("static/index.html")

async def start_server():
    config = uvicorn.Config(app, "0.0.0.0", 42069)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        pass