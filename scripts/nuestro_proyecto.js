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

    document.addEventListener("DOMContentLoaded", function() {
        const bookItems = document.querySelectorAll(".book-item");
        bookItems.forEach(item => {
            const img = item.querySelector("img");
            img.addEventListener("click", (event) => {
                event.stopPropagation(); 
                
                document.querySelectorAll(".book-options").forEach(options => {
                    options.classList.add("hidden");
                });
                
                const options = item.querySelector(".book-options");
                options.classList.toggle("hidden");
            });
        });
    });
    