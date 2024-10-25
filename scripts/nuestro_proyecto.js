document.addEventListener('DOMContentLoaded', () => {
    // Carrusel de imágenes
    const slides = document.querySelector('.slides');
    let currentIndex = 0;
    const totalSlides = slides.children.length;

    function showSlide(index) {
        slides.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        showSlide(currentIndex);
    }

    setInterval(nextSlide, 5000);
    });