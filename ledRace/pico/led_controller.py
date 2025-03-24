import array
from machine import Pin
import random
import re
from rp2 import PIO, StateMachine, asm_pio
import time

class LedController:
    """
    Contrôle d'un bandeau lumineux de type WS2812
    """

    BLUE = (0, 87, 183)
    BLACK = (0, 0, 0)
    GREEN = (0, 255, 0)
    MAX_LUMINOSITY_ALLOWED = 0.2
    RED = (255, 0, 0)
    YELLOW = (255, 215, 0)

    def __init__(self, num_leds=300):
        self.num_leds = num_leds
        self.pixel_array = array.array("I", [0 for _ in range(num_leds)])
        self.positions = {"joueur1": 0, "joueur2": 0}
        self.colors = {"joueur1": self.RED, "joueur2": self.BLUE}

        @asm_pio(sideset_init=PIO.OUT_LOW, out_shiftdir=PIO.SHIFT_LEFT,
                 autopull=True, pull_thresh=24)
        def ws2812():
            T1 = 2
            T2 = 5
            T3 = 3
            label("bitloop")
            out(x, 1) .side(0) [T3 - 1]
            jmp(not_x, "do_zero") .side(1) [T1 - 1]
            jmp("bitloop") .side(1) [T2 - 1]
            label("do_zero")
            nop() .side(0) [T2 - 1]

        self.sm = StateMachine(0, ws2812, freq=8000000, sideset_base=Pin(0))
        self.sm.active(1)

    def set_led_color(self, color, count=None):
        print("set_led_color")
        if count is None: count = len(self.pixel_array)
        for ii in range(count):
            self.pixel_array[ii] = (color[1] << 16) + (color[0] << 8) + color[2]

    def set_random(self):
        print("set_random")
        self.set_led_color((random.randrange(255), random.randrange(255), random.randrange(255)))
        self.update_pixel()

    def move_led(self, player):
        """ Déplace une LED pour le joueur correspondant """
        if player not in self.positions:
            return
        
        self.positions[player] = (self.positions[player] + 1) % self.num_leds  # Avance en boucle
        self.pixel_array = array.array("I", [0 for _ in range(self.num_leds)])  # Reset bandeau
        self.pixel_array[self.positions[player]] = (self.colors[player][1] << 16) + (self.colors[player][0] << 8) + self.colors[player][2]
        self.update_pixel()

    def update_pixel(self, brightness=None):
        print("update_pixel")
        if brightness is None: brightness = self.MAX_LUMINOSITY_ALLOWED
        dimmer_array = array.array("I", [0 for _ in range(self.num_leds)])
        for ii, cc in enumerate(self.pixel_array):
            r = int(((cc >> 8) & 0xFF) * brightness)
            g = int(((cc >> 16) & 0xFF) * brightness)
            b = int((cc & 0xFF) * brightness)
            dimmer_array[ii] = (g << 16) + (r << 8) + b
        self.sm.put(dimmer_array, 8)

