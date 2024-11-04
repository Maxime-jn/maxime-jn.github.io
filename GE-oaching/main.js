"use strict";

const map = L.map('map').setView([46.2048134126465, 6.146482001629117], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markersData = [
    { coords: [46.2043907, 6.1431577], content: "Contenu pour le marqueur 1" },
    { coords: [46.23267904125583, 6.104264756150501], content: "Contenu pour le marqueur 2" },
    { coords: [46.28004597496244, 6.195724667454375], content: "Contenu pour le marqueur 3" },
    { coords: [46.14935957331897, 5.974429667801284], content: "Contenu pour le marqueur 4" },
    { coords: [46.18253897476035, 6.14054572352949], content: "Contenu pour le marqueur 5" },
    { coords: [46.21363767499827, 6.105416712847887], content: "Contenu pour le marqueur 6" },
    { coords: [46.21473536253226, 6.034728655371496], content: "Contenu pour le marqueur 7" },
];


markersData.forEach((markerData, index) => {
    const marker = L.marker(markerData.coords).addTo(map);
    marker.on('click', () => showDetails(markerData.content));
});


function showDetails(content) {
    document.getElementById("details").style.display = "block";
    document.getElementById("markerContent").innerText = content;
}

function closeDetails() {
    document.getElementById("details").style.display = "none";
}


let useFrontCamera = false;
const myVideo = document.getElementById("myVideo");
document.getElementById("toggleCamera").addEventListener("click", async () => {
    useFrontCamera = !useFrontCamera;
    const constraints = {
        video: { facingMode: useFrontCamera ? "user" : "environment" }
    };
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    myVideo.srcObject = stream;
});


if (!localStorage.getItem('markerData')) {
    localStorage.setItem('markerData', JSON.stringify(markersData));
}
