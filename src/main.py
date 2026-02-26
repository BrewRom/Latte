import pyray
import random

pyray.init_window(1280, 800, "Latte")
pyray.init_audio_device()

background_color = pyray.Color(36, 36, 36, 255)

background_texture = pyray.load_texture("assets/art/background.png")
x = 0

tap_sounds = [
    pyray.load_sound("assets/audio/tap_01.wav"),
    pyray.load_sound("assets/audio/tap_02.wav"),
    pyray.load_sound("assets/audio/tap_03.wav"),
    pyray.load_sound("assets/audio/tap_04.wav"),
    pyray.load_sound("assets/audio/tap_05.wav")
]

while not pyray.window_should_close():
    pyray.begin_drawing()

    pyray.clear_background(background_color)

    pyray.draw_texture(background_texture, x, 0, pyray.WHITE)

    pyray.end_drawing()

    if pyray.is_key_down(pyray.KeyboardKey.KEY_SPACE):
        to_play = random.randint(0, 4)
        sound = tap_sounds[to_play]
        pyray.play_sound(sound)

pyray.close_window()