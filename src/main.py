import fastapi
import fastapi.staticfiles
import fastapi.templating
import uvicorn
import asyncio

app = fastapi.FastAPI()
app.mount("/static", fastapi.staticfiles.StaticFiles(directory="static"), name="static")
app.mount("/roms", fastapi.staticfiles.StaticFiles(directory="roms"), name="roms")
templates = fastapi.templating.Jinja2Templates(directory="templates")

@app.get("/")
def root(request: fastapi.Request):
    return templates.TemplateResponse(
        request=request, name="index.html"
    )

@app.get("/games")
def get_games(request: fastapi.Request):
    return templates.TemplateResponse(
        request=request, name="games.html"
    )

async def create_and_run_server():
    config = uvicorn.Config(app, "0.0.0.0", 8200)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    try:
        asyncio.run(create_and_run_server())
    except KeyboardInterrupt:
        pass