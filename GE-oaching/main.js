"use strict";

var map = L.map('map').fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

map.locate({ setView: true, maxZoom: 11 });

let useFrontCamera = false;
let isCameraActive = false;
let currentStream = null;
let texteMarqueur = "";
const videoElement = document.getElementById("myVideo");
const canvas = document.getElementById("photoCanvas");

// Fonction pour démarrer la caméra
async function startCamera() {
    if (currentStream) {
        stopCamera();
    }

    const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" }
    };
    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = currentStream;
        videoElement.style.display = "block";
        isCameraActive = true;
    } catch (error) {
        console.error("Erreur lors de l'activation de la caméra:", error);
        alert("Impossible d'accéder à la caméra. Assurez-vous qu'aucune autre application n'utilise la caméra.");
    }
}

// Fonction pour arrêter la caméra
function stopCamera() {
    if (currentStream) {
        let tracks = currentStream.getTracks();
        tracks.forEach(track => track.stop());
    }
    videoElement.srcObject = null;
    videoElement.style.display = "none";
    isCameraActive = false;
    currentStream = null;
}

// Fonction pour capturer la photo
function capturePhoto() {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Arrêter la caméra après la capture
    stopCamera();

    // Convertir l'image en URL pour l'utiliser dans le marqueur
    const imageUrl = canvas.toDataURL("image/png");
    
    // Créer le marqueur avec le texte et l'image
    if (texteMarqueur) {
        const marker = L.marker([currentLat, currentLng]).addTo(map);
        marker.bindPopup(`
            <div>
                <p>${texteMarqueur}</p>
                <img src="${imageUrl}" alt="Photo du marqueur" style="width:100px; height:auto; border-radius:8px;"/>
            </div>
        `);
        marker.openPopup();
    }
}

let currentLat, currentLng;

// Événement clic sur la carte pour ajouter un marqueur avec texte et image
map.on("click", async function(event) {
    const { lat, lng } = event.latlng;
    currentLat = lat;
    currentLng = lng;

    // Saisir le texte pour le marqueur
    texteMarqueur = prompt("Entrez le texte du marqueur:");
    
    if (texteMarqueur) {
        // Démarrer la caméra pour capturer la photo après la saisie du texte
        await startCamera();
    }
});

// Bouton pour capturer la photo après activation de la caméra
document.getElementById("capturePhoto").addEventListener("click", () => {
    capturePhoto();
});

// Bouton pour changer de caméra (avant/arrière)
document.getElementById("switchCamera").addEventListener("click", async () => {
    useFrontCamera = !useFrontCamera;
    if (isCameraActive) {
        await startCamera();
    }
});
