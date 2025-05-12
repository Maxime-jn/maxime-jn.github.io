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
        self.game_over = False  # Indique si le jeu est terminé
    
    def on_rx(self, data): # maximum 20 bytes per message
        if self.game_over:
            print("Le jeu est terminé. Redémarrez pour jouer à nouveau.")
            return

        data = data.decode('utf-8').strip()
        print(f"data utf-8={data}")  # Affiche le message reçu
        if data == "reset":
            print("Réinitialisation de la course")
            self._led_controller.positions = {"joueur1": 0, "joueur2": 0}
            self._led_controller.set_led_color(self._led_controller.BLACK)
            self._led_controller.update_pixel()
            self.game_over = False
            return

        if data in ["joueur1", "joueur2"]:
            print(f"Avancement du joueur: {data}")
            self._led_controller.move_led(data)

            # Vérifie si un joueur a gagné
            if self._led_controller.positions[data] + 5 >= self._led_controller.num_leds:
                print(f"Le joueur {data} a gagné !")
                self.game_over = True

if __name__ == "__main__":
    led_controller = LedController()
    btController = BtControllerLed(led_controller)
    btController.start()



