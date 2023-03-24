
var clicks = 0;

function hide_search() {
    clicks += 1;
    if (clicks % 2 == 1) {
    } else {
        // $('#nav-right').css('display', 'block');
        $('#mobile-info').css('display', 'block');
    }
    // $('#nav-right').toggle();
    $('#nav-right').fadeToggle();
}

$(document).click(function () {
    $("#nav-right").hide();
});
$("#nav-right").click(function (e) {
    this.hide_search().click;
});
$('.c-box_mmenu .offcanvas-menu-toggler').click(function () {
    var element = $(this).parent().parent();
    if (element.hasClass('c-open')) {
        element.removeClass('c-open');
    } else {
        element.removeClass('c-open');
        element.addClass('c-open');
    }
})


$(document).ready(function () {
    $(".img-first").on('touchstart', function () {
    });
    /* $(document).on('touchstart', function () {
         detectTap = true; // Detects all touch events
     });*/
    // getSeeding()
    if ($.cookie('chamy_products') != undefined) {

        //  toastr.success("Có " + JSON.parse($.cookie('chamy_products')).length + " sản phẩm trong giỏ hàng")
        if (JSON.parse($.cookie('chamy_products')).length > 0) {
            $('#shopping-total').addClass("loading-css")
        }
        $('#shopping-total').text(JSON.parse($.cookie('chamy_products')).length)
    } /*else {
        toastr.success("Có " +0 + " sản phẩm trong giỏ hàng")
    }*/
    var elms = $(".link").each(function () {
        if (window.location.pathname == $(this).attr("data-link")) {
            $(this).addClass("activated ")
        }
    });
    $('.form_search').submit(function (event) {
        window.location.href = "/tim-kiem/" + $('#keyword').val();
        event.preventDefault();
    });
    $('#seach_moblie').submit(function (event) {
        window.location.href = "/tim-kiem/" + $('#keyword_moblie').val();
        event.preventDefault();
    });



   
    $('.c-box_search .c-call_search').click(function () {
        $(".c-box_search .search-box").toggle(400);
        $(".c-box_funs .c-box_viewCart").hide('slow');
        return false;
    })

    $('.menu_header .c-btn_cart,.menu_header .c-close_cart,.c-modal_overlay').click(function () {
        $(".c-modal_overlay").toggle();
        $(".menu_header .c-box_viewCart").toggle(400);
        $(".c-box_search .search-box").hide('slow');
        return false;
    })



    $('#c-call_account,.c-btn_close--account,.c-mem_overlay,.c-btn_call--login').click(function () {
        if ($.cookie('userId_chamy') == undefined) {
            $(".c-mem_overlay").toggle();
            $(".c-box_nonmember").toggle(300);
            $('.c-box_mmenu').hide();
            return false;
        }
    })

    $('#userId_chamy').click(function () {
        $('.menu-top').show();
    })

    $('.c-box_mmenu .c-btn_close--menu,#call_menu').click(function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('.menu-top').hide();
        }
        $(".c-box_mmenu").toggle(400);
        $(".c-menu_mobile,.c-box_maccount").show();
        return false;
    })

    $('.c-call_msearch').click(function () {
        $(".c-box_mmenu").toggle(400);
        $(".c-menu_mobile,.c-box_maccount").hide();
        return false;
    })


    $('.c-btn_sort').click(function () {
        if ($(".c-box_sort .dropdown-category").css('display') == 'block') {
            $(".c-box_sort .dropdown-category").toggle(400);
        }
        $(".c-box_sort .dropdown-sort").toggle(400);
        return false;
    });

    $('.c-btn_cate').click(function () {
        if ($(".c-box_sort .dropdown-sort").css('display') == 'block') {
            $(".c-box_sort .dropdown-sort").toggle(400);
        }
        $(".c-box_sort .dropdown-category").toggle(400);
        return false;
    });

    $(document).on('click', '.dropdown-category', function (e) {
        e.stopPropagation();
    });

    $('.main-menu > .menu-item > a').click(function () {
        var element = $(this).parent();
        if (element.hasClass('c-open')) {
            element.removeClass('c-open');
            // $('.c-main_menu .light-menu').fadeOut(400);
        } else {
            $('.c-main_menu .dropdown.c-open').toggleClass('c-open');
            element.removeClass('c-open');
            element.addClass('c-open');
            // $(this).next().fadeIn(400);
        }
    })


    var info_alertNonMem = $('#info_alertNonMem').val();
    arr_alertNonMem = info_alertNonMem ? JSON.parse(info_alertNonMem) : [];

    $('#c-call_account').click(function () {
        // loadNav();
        console.log('web')
        login();
        register()
    })
    $('#c-call_account_mobile').click(function () {
        console.log('moblie')
        // loadNav();
        login();
        register()
    })



})




function selectedRegister() {
    $('#memRegisBtn').addClass('active')
    $('#memLogBtn').removeClass('active')
    $('#memLog').removeClass('in')
    $('#memLog').removeClass('active')
    $('#memRegis').addClass('in')
    $('#memRegis').addClass('active')
}
function selectedLogin() {
    $('#memRegisBtn').removeClass('active')
    $('#memLogBtn').addClass('active')
    $('#memRegis').removeClass('in')
    $('#memRegis').removeClass('active')
    $('#memLog').addClass('in')
    $('#memLog').addClass('active')
}

function checkFormsubmitLg() {
    $('label.label_error').prev().remove();
    $('label.label_error').remove();

    if (!notEmpty("log_email", arr_alertNonMem[9])) {
        return false;
    }
    // if (!emailValidator("log-email", arr_alertNonMem[2])) {
    //     return false;
    // }

    if (!notEmpty("log_password", arr_alertNonMem[3])) {
        return false;
    }

    return true;
}


function checkFormsubmitReg() {
    $('.label_error').remove();

    if (!notEmpty("regis_email", arr_alertNonMem[1])) {
        return false;
    }
    if (!emailValidator("regis_email", arr_alertNonMem[2])) {
        return false;
    }
    if (!notEmpty("regis_phone", arr_alertNonMem[7])) {
        return false;
    }
    if (!isPhone("regis_phone", arr_alertNonMem[8])) {
        return false;
    }
    if (!lengthMin("regis_phone", 10, arr_alertNonMem[8])) {
        return false;
    }
    if (!lengthMax("regis_phone", 13, arr_alertNonMem[8])) {
        return false;
    }

    if (!notEmpty("regis_name", arr_alertNonMem[0])) {
        return false;
    }


    if (!notEmpty("regis_password", arr_alertNonMem[3])) {
        return false;
    }

    if (!lengthMin("regis_password", 8, arr_alertNonMem[6])) {
        return false;
    }

    return true;
}

function loadNav() {
    $('.main-menu > .menu-item > a').hover(function () {
        // $(this).next().toggle(500);
        //
        $(this).next().stop(true, true).slideDown(500);
    }, function () {
    });

    $('.main-menu > .menu-item').hover(function () {
    }, function () {
        // $(this).find('.light-menu').toggle(500);
        $(this).find('.light-menu').stop(true, true).slideUp(500);
    });
}

function changeQuantityCart(id) {


}


