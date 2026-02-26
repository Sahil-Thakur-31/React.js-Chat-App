window.addEventListener('DOMContentLoaded', () => {
  const car = document.getElementById('moving-car').querySelector('img');
  const meterFill = document.getElementById('meter-fill');
  const predText = document.getElementById('pred-text');

  // Animate car back and forth
  let direction = 1; // 1 = forward, -1 = backward
  let position = 0;
  const speed = 1; 
  const maxMove = document.getElementById('moving-car').parentElement.offsetWidth - car.offsetWidth;

  function moveCar() {
    position += speed * direction;
    if (position >= maxMove || position <= 0) direction *= -1;
    car.style.left = position + 'px';
    car.style.transform = direction === -1 ? 'scaleX(-1)' : 'scaleX(1)';
    requestAnimationFrame(moveCar);
  }
  moveCar();

  // Animate meter based on predicted price
  function updateMeter() {
    const priceMatch = predText.textContent.match(/₹([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
    const percent = Math.min((price / 50) * 100, 100); // Assuming max 50 Lakh
    meterFill.style.width = percent + '%';
  }
  updateMeter();
});
