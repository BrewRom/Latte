import pyray

pyray.init_window(1280, 800, "Latte")

background_color = pyray.Color(36, 36, 36, 255)

background_texture = pyray.load_texture("assets/background.png")
x = 0

while not pyray.window_should_close():
    pyray.begin_drawing()

    pyray.clear_background(background_color)

    pyray.draw_texture(background_texture, x, 0, pyray.WHITE)

    pyray.end_drawing()


pyray.close_window()