$(document).ready(function () {
    $(".banner-home-new").owlCarousel({
        autoplay: true, //Set AutoPlay to 3 seconds
        // autoplaySpeed: 1000,
        loop: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        nav: false,
        dots: true,
        margin: 0,
        smartSpeed: 500,
        items: 1
    });
})

$('.c-product_menu .offcanvas-menu-toggler').click(function () {
    var element = $(this).parent();
    if (element.parent().find("ul").hasClass("in")) {
        element.parent().find("ul").removeClass('in')
    } else {
        element.parent().find("ul").addClass('in')

    }
    if (element.hasClass('opened')) {
        element.removeClass('opened');
    } else {
        element.removeClass('opened');
        element.addClass('opened');
    }
})


$('.c-box_color .c-color').click(function () {
    var id = $(this).attr('data-action');
    var src_img = $(this).attr('data-rel');

    $('.c-item' + id + ' .c-color').removeClass('active');
    $(this).addClass('active');

    $('.c-item' + id + ' .img-sec').attr('src', src_img);
    $('.c-item' + id + ' .img-sec').css("opacity", "1");
    if ($(this).hasClass('c-default')) {
        $('.c-item' + id + ' .img-first').show();
        $('.c-item' + id + ' ').addClass('is-default')
        // mouseEvent();
    } else {
        $('.c-item' + id + ' ').removeClass('is-default')
    }
});

function mouseEvent() {
    $('.c-box_list .c-item').bind({
        mouseover: function () {
            $(this).children('c-image').removeClass('ddd')
        }, mouseleave: function () {
            $(this).children('c-image').addClass('ddd')
        }
    });
}


var end_load = false;

$(window).scroll(function () {
    //get position
    var eleDiv = document.getElementById("loading");
  
});

var LoadMore___ = function () {
    resetLoad();
    if (end_load == true)
        return false;
    var pagecurrent = $('#loading').attr("data-pagecurrent");
    var nextpage = $('#loading').attr("data-nextpage");
    var limit = $('#loading').attr("limit");
    var data_cat = $('#loading').attr("data-cat");
    var data_order = $('#loading').attr("data-order");
    var data_continue = $('#loading').attr("data-end");
    pagecurrent = Number(pagecurrent);
    nextpage = Number(nextpage);
   
};

function resetLoad() {
    setInterval(function () {
        end_load = false;
    }, 5000);
}