$(document).ready(function(){
    $('.reviews-container').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    });
  });

if (window.screen.width <= 1100 && window.screen.width > 750){
    $('.reviews-container').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    });


}

if (window.screen.width <= 750){
    $('.reviews-container').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    });


}
$(".slider").not('.slick-initialized').slick()