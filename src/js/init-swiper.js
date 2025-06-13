import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

new Swiper('.swiper', {
  slidesPerView: 1.5,
  spaceBetween: 16,
  centerInsufficientSlides: true,
  breakpoints: {
    640: {
      slidesPerView: 2.5,
    },
    768: {
      slidesPerView: 3.5,
    },
    1024: {
      slidesPerView: 6.5,
    },
  },
});