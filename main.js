"use strict"


const map = L.map('map').setView([46.2048134126465, 6.146482001629117], 11);


const myVideo = document.getElementById("myVideo");


const img = document.querySelector("img");

img.addEventListener("click", async () => {

    const constraints = {
        video: {
            width: { ideal: 800 },
            height: { ideal: 720 },
            facingMode: { exact: "environment" }
        }
    };

    let stream = await navigator.mediaDevices.getUserMedia(constraints)
    myVideo.srcObject = stream

});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



const marker1 = L.marker([46.2043907, 6.1431577]).addTo(map);
const marker2 = L.marker([46.23267904125583, 6.104264756150501]).addTo(map);
const marker3 = L.marker([46.28004597496244, 6.195724667454375]).addTo(map);
const marker4 = L.marker([46.14935957331897, 5.974429667801284]).addTo(map);
const marker5 = L.marker([46.18253897476035, 6.14054572352949]).addTo(map);
const marker6 = L.marker([46.21363767499827, 6.105416712847887]).addTo(map);
const marker7 = L.marker([46.21473536253226, 6.034728655371496]).addTo(map);

marker1.openPopup();
marker2.openPopup();
marker3.openPopup();
marker4.openPopup();
marker5.openPopup();
marker6.openPopup();
marker7.openPopup();


