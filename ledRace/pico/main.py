"""
Description: Commande d'un bandeau lumineux de type WS2812 depuis un raspberry pico.
Le signal envoyé au bandeau est configuré par défaut sur le GPIO0 du pico.
"""
import re

from bt_controller.module import BtController 
from led_controller import LedController


class BtControllerLed(BtController):
    
    def __init__(self, led_controller, name=None):
        super().__init__(name)
        self._led_controller = led_controller
    
    def on_rx(self, data): # maximum 20 bytes per message
        data = data.decode('utf-8').strip()
        print(f"data utf-8={data}") # affiche le message reçu
        if data in ["joueur1", "joueur2"]:
            print(f"Avancement du joueur: {data}")
            self._led_controller.move_led(data)

if __name__ == "__main__":
    led_controller = LedController()
    btController = BtControllerLed(led_controller)
    btController.start()



