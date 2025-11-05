const models = [
    "ToyCar.glb",
    "Analog_Clock.glb",
    "Astronaut.glb"
  ];

let currentIndex = 0;
const viewer = document.getElementById("viewer");

document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % models.length;
    viewer.src = models[currentIndex];

  });

document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + models.length) % models.length;
    viewer.src = models[currentIndex];
  });
