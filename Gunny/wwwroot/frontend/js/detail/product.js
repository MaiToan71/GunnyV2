$(document).ready(function () {
    $('.c-btn_scrollImg').click(function () {
        var data_id = $(this).attr('data-id');
        $('html, body').animate({
            scrollTop: $('#img_' + data_id).offset().top - 75
        }, 500);
    })


    $('ul.tabs li a.tabs-label').click(function () {
        $('ul.tabs li').removeClass('selected');
        $(this).parent().addClass('selected');
        $('.tabs-content').removeClass('selected');
        var $tab = $(this).attr('data-content');
        $('#' + $tab).addClass('selected');
    });

    $('#product-faqs .faq-heading a').click(function () {
        $(this).parent().parent().toggleClass('selected');
    });

    $('.button-add').click(function () {
        var $quantity = $('input[name="quantity"]').val();
        $quantity = parseInt($quantity) + 1;
        $('input[name="quantity"]').val($quantity);
        $('.quantity-text').html($quantity);
    });

    $('.button-sub').click(function () {
        var $quantity = $('input[name="quantity"]').val();
        if (parseInt($quantity) == 1)
            return;
        $quantity = parseInt($quantity) - 1;
        $('input[name="quantity"]').val($quantity);
        $('.quantity-text').html($quantity);
    });

    var quantitySize = $('#quantity-size').text().trim()
    $('#increment').click(function () {
        $('#quantity').val(function (i, oldval) {
            console.log(quantitySize)
            if (oldval < 6)
                return parseInt(oldval, 10) + 1;
            else
                return parseInt(oldval, 10);
        });
    });
    $('#decrement').click(function () {
        var val = $('#quantity').val()
        if (val > 1) {
            $('#quantity').val(function (i, oldval) {
                return parseInt(oldval, 10) - 1;
            });
        }
    });

    // $(window).on('load',function () {
    var total_color = $('#total_color').val();
    // console.log(total_color);
    // setTimeout(function () {
    for (i = 0; i < total_color; i++) {
        if ($(window).width() > 1024) {
            // setTimeout(function () {
            $('#lightSlider' + i).lightSlider({
                gallery: true,
                item: 1,
                loop: true,
                slideMargin: 0,
                enableDrag: true,
                thumbItem: 5,
                vertical: true,
                verticalHeight: 705,
                vThumbWidth: 90,
                currentPagerPosition: 'left',
                mode: 'fade',
                speed: 1500,

            });
            // },1)

        } else {
            // setTimeout(function () {
            $('#lightSlider' + i).lightSlider({
                gallery: true,
                item: 1,
                loop: true,
                slideMargin: 0,
                enableDrag: true,
                verticalHeight: 600,
                thumbItem: 4,
                currentPagerPosition: 'left',
                // mode: 'fade',
                speed: 1500,
            });
            // },2)
        }
    }
    // },0)
    // })

    $(".c-box_all--images .lSPrev").prepend("<i class='fa fa-angle-left'/>  ");
    $(".c-box_all--images .lSNext").prepend("<i class='fa fa-angle-right'/>  ");
    if ($('.c-box_all--images').hasClass('c-has_video')) {
        $('.lSGallery').addClass('c-has_video');
    }

    $('.lSSlideOuter').fadeOut();
    $('#lightSlider0').parent().parent().fadeIn();

    jQuery("#extend_colorProduct .c-item_color").click(function (e) {
        var id_color = $(this).attr('d-color');
        var name_color = $(this).attr('d-name');
        var data_show = $(this).attr('data-show');
        $('#extend_colorProduct .c-item_color').removeClass('active');
        $(this).addClass('active');
        $('.c-show_color--name span').html(name_color);

        $('.lSSlideOuter').fadeOut(200);
        $('#' + data_show).parent().parent().fadeIn(800);

        $('.c-item_choose--size').hide();
        $('#c-show_size--name span').html('');
        $('#extend_size').val('');
        $('.c-item_choose' + id_color).css("display", "flex");


        $('html, body').animate({
            scrollTop: $('.c-box_all--images').offset().top - 100
        }, 1000);

      

    });


    var swiperRelate = new Swiper('.c-swipper-relate', {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            // dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });


    $('#product-related .sp-item .checked').click(function () {
        var $checked = $(this).attr('data-checked');
        if ($checked == 1) {
            $(this).addClass('unchecked');
            $(this).attr('data-checked', 0);
        } else {
            $(this).removeClass('unchecked');
            $(this).attr('data-checked', 1);
        }

        var $ids = '0';
        $('#product-related .sp-item .checked').each(function () {
            var $checked = $(this).attr('data-checked');
            var $id = $(this).attr('data-id');
            if ($checked == 1)
                $ids += ',' + $id;
        });
        $('#product-related .btn-related').attr('data-id', $ids);
    })


    // stick_scroll();
    // scroll_tab();


    var alert_info1 = $('#alert_info').val();
    arr_alertInfo = alert_info1 ? JSON.parse(alert_info1) : [];


});

function scroll_tab() {
    // var offser = $('.col_aside').offset();

    var height_thumb_img = $('.c-list--thumb_image')[0].scrollHeight;
    var height_ctn = $('#body_fix_add_cart')[0].scrollHeight;
    $(window).scroll(function () {
        var offser_of_partner = $('.list-product-same').offset();
        var offser_box_image = $('.c-box_all--images').offset();
        var mbox_add_cart = $('.c-mbox--add_cart').offset();
        var height_mbox_add_cart = $('.c-mbox--add_cart')[0].scrollHeight;
        var scrolltop = $(window).scrollTop();

        // console.log(offser_of_partner.top);
        console.log(window.innerHeight);
        console.log(scrolltop);
        console.log(offser_box_image.top);

        // if (scrolltop >= (height_thumb_img - 66) && (offser_of_partner.top - (height_thumb_img - 10)) >= scrolltop) {
        if (scrolltop >= (offser_box_image.top - 70)) {
            if (scrolltop < (offser_of_partner.top - (height_thumb_img + 70))) {
                $('.c-list--thumb_image').attr("style", "position:fixed; top: 100px;");
            } else {
                $('.c-list--thumb_image').attr("style", "position:absolute; bottom: 0; top: unset;");

            }
        } else {
            $('.c-list--thumb_image').attr("style", "position:relative; top: auto;");
        }
        if ($(window).width() > 1024) {
            if (scrolltop >= (offser_box_image.top - 70)) {
                if (scrolltop < (offser_of_partner.top - (height_ctn + 70))) {
                    $('#body_fix_add_cart').attr("style", "position:fixed; top: 100px;");
                    $('#body_fix_add_cart').addClass("fixing");
                } else {
                    $('#body_fix_add_cart').attr("style", "position:absolute; bottom: 0; top: unset;");
                    $('#body_fix_add_cart').addClass("fixing");
                }
            } else {
                $('#body_fix_add_cart').attr("style", "position:relative; top: auto;");
                $('#body_fix_add_cart').removeClass("fixing");
            }
        }

        if ($(window).width() < 768) {
            $('.c-mbox--add_cart').attr("style", "height:" + ($('.c-m--add_cart')[0].scrollHeight + 50) + 'px;');
            if (scrolltop <= (offser_of_partner.top - window.innerHeight)) {
                $('.c-m--add_cart').attr("style", "position:fixed; margin: 0px");
            } else {
                $('.c-m--add_cart').attr("style", "position:absolute; ");
            }
        }

    });
}


var stick_scroll = function () {
    var win = $(window);
    stick_act();
    win.resize(function (e) {
        stick_act();
    });

    function stick() {
        // $('.c-list--thumb_image').stick_in_parent({
        //     offset_top: 60,
        // });
    }

    function stick_ctn() {
        // $('.c-list--thumb_image').stick_in_parent({
        //     offset_top: 60,
        // });
    }

    function un_stick() {
        $('.c-list--thumb_image').trigger("sticky_kit:detach");
    }

    function un_stick_ctn() {
        // $('#body_fix_add_cart').trigger("sticky_kit:detach");
    }

    function stick_act() {
        (win.width() < 1025) ? un_stick() : stick();
        (win.width() < 1025) ? un_stick_ctn() : stick_ctn();
    }
}

// function initZoom() {
//     var $src = $('#product-zoom img').attr('src').replace('/medium/', '/original/');
//     $('#product-zoom').zoom({url: $src});
// }


function validateComment() {
    if ($('#txtCom').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p bĂ¬nh luáº­n.', function () {
            $('#txtCom').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    if ($('#txtName').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p tĂªn.', function () {
            $('#txtName').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    if (!isEmail($('#txtMail').val())) {
        Boxy.alert('HĂ£y nháº­p Ä‘á»‹a chá»‰ Email.', function () {
            $('#txtMail').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    if ($('#txtCode').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p mĂ£ báº£o máº­t.', function () {
            $('#txtCode').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    var $data = $('form#frmComment').serialize();
   
    return false;
}

function quickBuy($id) {
    tb_show('Mua nhanh', '/index.php?module=product&view=product&raw=1&width=510&task=quickBuy&id=' + $id);
    return false;
}

function validquickBuy() {
    if ($('#qname').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p tĂªn.', function () {
            $('#qname').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    if ($('#qmobile').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p sá»‘ Ä‘iá»‡n thoáº¡i.', function () {
            $('#qmobile').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    if ($('#qaddress').val() == '') {
        Boxy.alert('Báº¡n vui lĂ²ng nháº­p Ä‘á»‹a chá»‰.', function () {
            $('#qaddress').focus();
        }, {
            title: 'ThĂ´ng bĂ¡o.', afterShow: function () {
                $('#boxy_button_OK').focus();
            }
        });
        return false;
    }
    var $data = $('form#frm_quick_buy').serialize();
    $('#waitting').show();
   
    return false
}

$('.related_products_detail').click(function () {
    var $price = parseInt($('#product_price').val());

    var checkedVals = $('.related_products_detail:checkbox:checked').map(function () {
        return this.value;
    }).get();

    $ids = checkedVals.join(",");

    $('#product_related').val($ids);

    var $arrIds = $ids.split(',');
    $(".related_products").prop('checked', false);
    if ($ids != '')
        $.each($arrIds, function (key, value) {
            $(".related_" + value).prop('checked', true);
            $price = $price + parseInt($('#product_price_' + value).val());
        });

    $('span.price-all').html($.number($price, 0, ',', '.') + ' Ä‘');

    var $obj = $('#add-cart-detail');
    $id = $obj.attr('data-id');
    $related = $('#product_related').val();
    $('a.add-cart').attr('href', '/dat-mua-' + $id + '?related=' + $related)
});

$('.related_products_quick').click(function () {
    var $price = parseInt($('#product_price').val());

    var checkedVals = $('.related_products_quick:checkbox:checked').map(function () {
        return this.value;
    }).get();

    $ids = checkedVals.join(",");

    $('#product_related').val($ids);

    var $arrIds = $ids.split(',');
    $(".related_products").prop('checked', false);
    if ($ids != '')
        $.each($arrIds, function (key, value) {
            $(".related_" + value).prop('checked', true);
            $price = $price + parseInt($('#product_price_' + value).val());
        });

    $('span.price-all').html($.number($price, 0, ',', '.') + ' Ä‘');

    var $obj = $('#add-cart-detail');
    $id = $obj.attr('data-id');
    $related = $('#product_related').val();
    $('a.add-cart').attr('href', '/dat-mua-' + $id + '?related=' + $related)
});

$('.c-btn_sub--size').click(function (event) {

    $('label.label_error').prev().remove();
    $('.label_error').remove();

    var height = $('#info_height').val(), weight = $('#info_weight').val();

    if (!notEmpty("info_height", arr_alertInfo[4])) {
        return false;
    }
    if (!isPhone("info_height", arr_alertInfo[6])) {
        return false;
    }
    if (!notEmpty("info_weight", arr_alertInfo[5])) {
        return false;
    }
    if (!isPhone("info_weight", arr_alertInfo[6])) {
        return false;
    }

    var data_id = $(this).attr('data-id');
    var url_root = $('#url_root').val();
  
});


$('.c-btn_reset--size').click(function (event) {
    $('.c-col_find--size .c-box_form').show('slow');
    $('.c-box_resuft--size').hide('slow');

})

$('.c-btn_choose--size').click(function (event) {
  
    var size_id = $(this).attr('size-id');
    console.log(size_id)
    $('#extend_size').val(size_id);
    $('.c-name_size--choose ').removeClass('active');
    $('.c-size_' + size_id).addClass('active');
    $('#modalFindSize').modal('hide');

})
$('.c-icon_cart--home').click(function (event) {
    getListItem();

});
$('.add-cart').click(function (event) {
    $('label.label_error').prev().remove();
    $('.label_error').remove();

    var noti_addCart = $('#alert_addcart').val();
    var $id = $(this).attr('data-id');
    var $quantity = 1;
    var $quantity = $('#quantity').val();
    $quantity = parseInt($quantity);
    var max_quantity = $('#quantity-size').text()
    if (max_quantity == 0) {
        toastr.error('Bạn chưa chọn size', 'Thất bại')

    } else
        if ($quantity > max_quantity) {
            toastr.error('Số lượng quá lớn, vui lòng nhập lại', 'Thất bại')
        } else {
            var obj = {
                sizeName: $('#c-show_size--name').text(),
                total: $quantity,
                id: $('#product-id').val()
            }
            var array = $.cookie('chamy_products')
            if (array == undefined) {
                array = []
                array.push(obj)
            } else {
                var check = false
                array = JSON.parse($.cookie('chamy_products'));
                var checkMax = false
                $.each(array, function (ex, item) {
                    if (item.id == obj.id && item.sizeName == obj.sizeName) {
                        check = true;
                        item.total += obj.total
                        if (item.total > max_quantity) {
                            item.total -= obj.total
                            toastr.error('Quá số lượng', 'Thất bại')
                        } else {
                            toastr.success("Đã cập nhật giỏ hàng")
                        }
                    }
                })

                if (checkMax == false) {
                    if (check == false) {
                        toastr.success("Đã cập nhật giỏ hàng")
                        array.push(obj)

                        if ($.cookie('userId_chamy') != null)
                            var history = {
                                Ip: "",
                                Action: "Thêm gỏ hàng",
                                CustomerId: $.cookie('userId_chamy'),
                                CustomerName: $.cookie('fullname_chamy'),
                                Link: "/san-pham/chi-tiet/id-" + obj.id
                            }
                        addToHistory(history)
                    }
                }
             
            
            }
            $(document).ready(function () {
                $('.c-icon_cart--home').trigger('click');
            });
            $('#shopping-total').text(array.length)
            setCookie('chamy_products', JSON.stringify(array),365)
            getListItem();


        }

});
function addToHistory(obj) {
    $.ajax({
        method: "post",
        url: "/api/history/add",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (res) {


        }
    })
}

function setCookie(name, value, days) {
    $.cookie(name, value, { path: '/' })
}
function getListItem() {
    if ($.cookie('chamy_products') != undefined) {
        var array = [];
        $.each(JSON.parse($.cookie('chamy_products')), function (ex, item) {
            array.push(item.id)
        })
        $.ajax({
            method: "POST",
            url: `/api/frontend/shopingcarts`,
            contentType: "application/json",
            data: JSON.stringify({ ListIds: array }),
            success: function (res) {
                $('#shopping-cart-chamy').remove()
                $('.c-box_shopping--cart').html(`<div id="shopping-cart-chamy"></div>`)
                var product_total = 0;
                html = `<div class="c-box_shopping--cart">
    <p>
        <strong>GIỎ HÀNG. </strong>
    </p>
    <div class="c-calc_bag">
        <div class="c-list_item">`
                $.each(res.data, function (ex, item) {
                    $.each(JSON.parse($.cookie('chamy_products')), function (ex, cookie) {
                        if (cookie.id == item.Web.Id) {
                            product_total += Number((Number(item.PosPriceSale) * Number(cookie.total)).toFixed(0))

                    html +=`
             <div class="c-box_item clearfix key_item--1">
                <div class="row c-item ">
                    <div class="title-cart col-md-3 col-sm-4  c-col-image">
                        <a href="/san-pham/chi-tiet/${item.FormatName}"
                            title="${item.Web.Name}">
                           `
                    $.each(item.Web.ImageProducs, function (ex, img) {
                        if (img.Index == 1) {
                            html += `<img src="/img/${img.Link}"
                                class="img-responsive">
                            .</a>`
                        }
                    })
                            html +=
                                `
                    </div>
                    <div class="col-md-9 col-sm-8 c-col-name name-pro">
                        <div class="c-box_name"><a href="/san-pham/chi-tiet/${item.FormatName}"
                                title="White Long Sleeves Woven Vest" class="c-name">${item.Web.Name}</a><a
                                data-id="${item.Web.Id}" data-size="${cookie.sizeName}" class="c-del_incart pull-right"
                                href="javascript:void(0)" title="" >x</a></div>
                        <div class="c-sec_option select-size"><label class="c-label">Size: </label>${cookie.sizeName}</div>
                        <div class="c-sec_option select-box"><label class="c-label">Số lượng</label><span
                                class="custom-quantity-input">${cookie.total}</span><span class="total-pro pull-right money">${item.PosPriceSale}</span></div>
                    </div>
                </div>
            </div>
            <hr>
        
       `
                        }
                    })
                })
                html += ` </div>
        <div class="c-list_fee">
            <p class="price_order">
                Tổng tiền tạm tính <span class="order-value pull-right money">${product_total}</span>
            </p>
            <div class="c-total_order">
                <span class="c-title">TỔNG HÓA ĐƠN</span>
                <span class="order-value pull-right money">${product_total}</span>
            </div>
        </div>
    </div>
    <a class="btn c-btn_dark" href="/dat-hang">
        <strong>Đi tới đặt hàng</strong>
    </a>
</div>`

                $('#shopping-cart-chamy').html(html)

                var moneys = document.querySelectorAll('.money');
                moneys.forEach(money => {

                    var x = Number(money.textContent);
                    if (!isNaN(x)) {
                        x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                        money.innerHTML = x;
                    }

                });

                $(".c-del_incart").click(function () {
                    $a = $(this).attr("data-tr");
                    // $("." + $a).hide();
                    var sizeNameClick = $(this).attr('data-size');
                    var idClick = $(this).attr("data-id");
                    var arrayClick = []
                    $.each(JSON.parse($.cookie('chamy_products')), function (ex, item) {
                        if (item.sizeName != sizeNameClick && item.id == idClick) {
                            arrayClick.push(item)
                        }
                    })

                    setCookie('chamy_products', JSON.stringify(arrayClick), 365)
                    getListItem();
                });

            },
            error: function (err) {
            }
        });
    }
}




function removeProductItem() {
    console.log($(this).attr('data-id'))
}

function fsAlert($option) {
    $option = $option || {};
    var box = $("<div></div>");
    box.html($option.msg).dialog({
        modal: true,
        title: 'ThĂ´ng bĂ¡o',
        buttons: {
            Ok: function () {
                $.isFunction($option.func) && ($option.func)();
                $(this).dialog('destroy').remove();
            }
        }
    }).dialog('open');
    return false;
}


$('.empty-product').click(function () {
    alert('Sáº£n pháº©m táº¡m thá»i háº¿t hĂ ng.');
});


$('.payment-method > a').click(function () {
    $('.payment-method').removeClass('selected');
    $(this).parent().addClass('selected');
    $('#payment_method').val($(this).attr('data-id'));
});

$('a.btn-related').click(function () {
    var $IDs = $(this).attr('data-id');
    var $comboID = $(this).attr('data-combo');
    if ($IDs == '0' || $IDs == '') {
        fsAlert('Báº¡n vui lĂ²ng chon sáº£n pháº©m!');
        return false;
    }
    $(this).addClass('disabled');
  
    return false;
});

function showQuickCart() {
  
}

$('#sender_city').change(function () {
    setSelectDistricts($('#sender_district'), $(this).val(), 0);
});

$('#recipients_city').change(function () {
    setSelectDistricts($('#recipients_district'), $(this).val(), 0);
});

function validateUpdateCart() {
    $('input.quantity-value').each(function () {
        if (Number.isInteger($(this).val()) || $(this).val() <= 0) {
            alert('Sá»‘ lÆ°á»£ng pháº£i lĂ  sá»‘ vĂ  lá»›n hÆ¡n 0.');
            $(this).focus();
            return false;
        }
    });
    var data = $('#frmUpdateCart').serialize();

   
    return false;
}

function validatePayment() {
    $count = 0;
    if ($('#username').val() == '') {
        alert('HĂ£y nháº­p há» vĂ  tĂªn cá»§a báº¡n.');
        $('#username').focus();
        return false;
    }
    if ($('#recipients_email').val() == '') {
        alert('Nháº­p email cá»§a báº¡n.');
        $('#recipients_email').focus();
        return false;
    }
    if ($('#recipients_address').val() == '') {
        alert('Nháº­p Ä‘á»‹a chá»‰ cá»§a báº¡n.');
        $('#recipients_address').focus();
        return false;
    }
    if ($('#recipients_telephone').val() == '') {
        alert('Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i cá»§a báº¡n.');
        $('#recipients_telephone').focus();
        return false;
    }
    var filterEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!$('#recipients_email').val().match(filterEmail)) {

        alert('Email chÆ°a Ä‘Ăºng Ä‘á»‹nh dáº¡ng');

        $('#recipients_email').focus();

        return false;
    }
    if (!$('#recipients_telephone').val().match(phoneno)) {

        alert('Sá»‘ Ä‘iá»‡n thoáº¡i chÆ°a Ä‘Ăºng Ä‘á»‹nh dáº¡ng');

        $('#recipients_telephone').focus();

        return false;
    }


    // if($('#payment_method').val() == 1) {
    //     if ($('#payment_bank').val() == '') {
    //         fsAlert('Báº¡n vui chá»n ngĂ¢n hĂ ng Ä‘á»ƒ chuyĂªn khoáº£n.');
    //         $('#payment_bank').focus();
    //         return false;
    //     }
    // }else{
    //     $('#payment_bank').val('');
    // }
    var payment_method = $("input[name='payment_method']:checked").val();
    $count++;
    if ($count == 1) {
        $('.click_one').addClass('disable_click');
        if (payment_method == 1) {
            $total_order = $('#fb_total_order').val();
            if ($total_order) {
                $total = $total_order;
            } else {
                $total = 0;
            }

            // fbq('track', 'Purchase', {value: $total, currency: 'VND'});

            document.forms['frmPayment'].submit();
        }
    }


}

$('#txtPayLive').click(function () {

    if ($('#username').val() == '') {
        alert('HĂ£y nháº­p há» vĂ  tĂªn cá»§a báº¡n.');
        $('#username').focus();
        return false;
    }
    if ($('#recipients_email').val() == '') {
        alert('Nháº­p email cá»§a báº¡n.');
        $('#recipients_email').focus();
        return false;
    }
    if ($('#recipients_address').val() == '') {
        alert('Nháº­p Ä‘á»‹a chá»‰ cá»§a báº¡n.');
        $('#recipients_address').focus();
        return false;
    }
    if ($('#recipients_telephone').val() == '') {
        alert('Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i cá»§a báº¡n.');
        $('#recipients_telephone').focus();
        return false;
    }

    var filterEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!$('#recipients_email').val().match(filterEmail)) {
        alert('Email chÆ°a Ä‘Ăºng Ä‘á»‹nh dáº¡ng');
        $('#recipients_email').focus();
        return false;
    }
    if (!$('#recipients_telephone').val().match(phoneno)) {
        alert('Sá»‘ Ä‘iá»‡n thoáº¡i khĂ´ng Ä‘Ăºng Ä‘á»‹nh dáº¡ng');
        $('#recipients_telephone').focus();
        return false;
    }

    $('.showATM_online').css('display', 'block');
    $('#submit-bt3').css('display', 'none');
    var username = $('#username').val();
    var recipients_email = $('#recipients_email').val();
    var recipients_address = $('#recipients_address').val();
    var recipients_telephone = $('#recipients_telephone').val();
    var sender_comments = $('#sender_comments').val();
    var payment_method = 0;
    var sender_sex = $("input[name='sender_sex']:checked").val();
    // document.forms['frmPayment'].submit();
  
});
$('#txtPayOff').click(function () {
    $('.showATM_online').css('display', 'none');
    $('#submit-bt3').css('display', 'inline-block');
});

$('.nav-tabs.nav-bank li a').click(function () {
    $('input[name="payment_bank"]').val($(this).attr('data-value'));
});

function validApplyDiscount() {
    if (!isEmpty('discount_code')) {
        fsAlert('HĂ£y nháº­p mĂ£ giáº£m giĂ¡ cá»§a báº¡n.');
        $('#discount_code').focus();
        return false;
    }
   
    return false;
}



;(function ($) {
    $(function () {
        $('.btn-click-1').bind('click', function (e) {
            e.preventDefault();
            $('#exampleModalCenter').bPopup();
        });
        $('.btn-click-2').bind('click', function (e) {
            e.preventDefault();
            $('#exampleModal').bPopup();
        });
    });
})(jQuery);

/*================================================================================
 * @name: bPopup - if you can't get it up, use bPopup
 * @author: (c)Bjoern Klinggaard (twitter@bklinggaard)
 * @demo: http://dinbror.dk/bpopup
 * @version: 0.9.4.min
 ================================================================================*/
(function (b) {
    b.fn.bPopup = function (z, F) {
        function K() {
            a.contentContainer = b(a.contentContainer || c);
            switch (a.content) {
                case "iframe":
                    var h = b('<iframe class="b-iframe" ' + a.iframeAttr + "></iframe>");
                    h.appendTo(a.contentContainer);
                    r = c.outerHeight(!0);
                    s = c.outerWidth(!0);
                    A();
                    h.attr("src", a.loadUrl);
                    k(a.loadCallback);
                    break;
                case "image":
                    A();
                    b("<img />").load(function () {
                        k(a.loadCallback);
                        G(b(this))
                    }).attr("src", a.loadUrl).hide().appendTo(a.contentContainer);
                    break;
                default:
                    A(), b('<div class="b-ajax-wrapper"></div>').load(a.loadUrl, a.loadData, function () {
                        k(a.loadCallback);
                        G(b(this))
                    }).hide().appendTo(a.contentContainer)
            }
        }

        function A() {
            a.modal && b('<div class="b-modal ' + e + '"></div>').css({
                backgroundColor: a.modalColor,
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                opacity: 0,
                zIndex: a.zIndex + t
            }).appendTo(a.appendTo).fadeTo(a.speed, a.opacity);
            D();
            c.data("bPopup", a).data("id", e).css({
                left: "slideIn" == a.transition || "slideBack" == a.transition ? "slideBack" == a.transition ? g.scrollLeft() + u : -1 * (v + s) : l(!(!a.follow[0] && m || f)),
                position: a.positionStyle || "absolute",
                top: "slideDown" == a.transition || "slideUp" == a.transition ? "slideUp" == a.transition ? g.scrollTop() + w : x + -1 * r : n(!(!a.follow[1] && p || f)),
                "z-index": a.zIndex + t + 1
            }).each(function () {
                a.appending && b(this).appendTo(a.appendTo)
            });
            H(!0)
        }

        function q() {
            a.modal && b(".b-modal." + c.data("id")).fadeTo(a.speed, 0, function () {
                b(this).remove()
            });
            a.scrollBar || b("html").css("overflow", "auto");
            b(".b-modal." + e).unbind("click");
            g.unbind("keydown." + e);
            d.unbind("." + e).data("bPopup", 0 < d.data("bPopup") - 1 ? d.data("bPopup") - 1 : null);
            c.undelegate(".bClose, ." + a.closeClass, "click." + e, q).data("bPopup", null);
            H();
            return !1
        }

        function G(h) {
            var b = h.width(), e = h.height(), d = {};
            a.contentContainer.css({height: e, width: b});
            e >= c.height() && (d.height = c.height());
            b >= c.width() && (d.width = c.width());
            r = c.outerHeight(!0);
            s = c.outerWidth(!0);
            D();
            a.contentContainer.css({height: "auto", width: "auto"});
            d.left = l(!(!a.follow[0] && m || f));
            d.top = n(!(!a.follow[1] && p || f));
            c.animate(d, 250, function () {
                h.show();
                B = E()
            })
        }

        function L() {
            d.data("bPopup", t);
            c.delegate(".bClose, ." + a.closeClass, "click." + e, q);
            a.modalClose && b(".b-modal." + e).css("cursor", "pointer").bind("click", q);
            M || !a.follow[0] && !a.follow[1] || d.bind("scroll." + e, function () {
                B && c.dequeue().animate({
                    left: a.follow[0] ? l(!f) : "auto",
                    top: a.follow[1] ? n(!f) : "auto"
                }, a.followSpeed, a.followEasing)
            }).bind("resize." + e, function () {
                w = y.innerHeight || d.height();
                u = y.innerWidth || d.width();
                if (B = E()) clearTimeout(I), I = setTimeout(function () {
                    D();
                    c.dequeue().each(function () {
                        f ? b(this).css({left: v, top: x}) : b(this).animate({
                            left: a.follow[0] ? l(!0) : "auto",
                            top: a.follow[1] ? n(!0) : "auto"
                        }, a.followSpeed, a.followEasing)
                    })
                }, 50)
            });
            a.escClose && g.bind("keydown." + e, function (a) {
                27 == a.which && q()
            })
        }

        function H(b) {
            function d(e) {
                c.css({display: "block", opacity: 1}).animate(e, a.speed, a.easing, function () {
                    J(b)
                })
            }

            switch (b ? a.transition : a.transitionClose || a.transition) {
                case "slideIn":
                    d({left: b ? l(!(!a.follow[0] && m || f)) : g.scrollLeft() - (s || c.outerWidth(!0)) - C});
                    break;
                case "slideBack":
                    d({left: b ? l(!(!a.follow[0] && m || f)) : g.scrollLeft() + u + C});
                    break;
                case "slideDown":
                    d({top: b ? n(!(!a.follow[1] && p || f)) : g.scrollTop() - (r || c.outerHeight(!0)) - C});
                    break;
                case "slideUp":
                    d({top: b ? n(!(!a.follow[1] && p || f)) : g.scrollTop() + w + C});
                    break;
                default:
                    c.stop().fadeTo(a.speed, b ? 1 : 0, function () {
                        J(b)
                    })
            }
        }

        function J(b) {
            b ? (L(), k(F), a.autoClose && setTimeout(q, a.autoClose)) : (c.hide(), k(a.onClose), a.loadUrl && (a.contentContainer.empty(), c.css({
                height: "auto",
                width: "auto"
            })))
        }

        function l(a) {
            return a ? v + g.scrollLeft() : v
        }

        function n(a) {
            return a ? x + g.scrollTop() : x
        }

        function k(a) {
            b.isFunction(a) && a.call(c)
        }

        function D() {
            x = p ? a.position[1] : Math.max(0, (w - c.outerHeight(!0)) / 2 - a.amsl);
            v = m ? a.position[0] : (u - c.outerWidth(!0)) / 2;
            B = E()
        }

        function E() {
            return w > c.outerHeight(!0) && u > c.outerWidth(!0)
        }

        b.isFunction(z) && (F = z, z = null);
        var a = b.extend({}, b.fn.bPopup.defaults, z);
        a.scrollBar || b("html").css("overflow", "hidden");
        var c = this, g = b(document), y = window, d = b(y), w = y.innerHeight || d.height(),
            u = y.innerWidth || d.width(), M = /OS 6(_\d)+/i.test(navigator.userAgent), C = 200, t = 0, e, B, p, m, f,
            x, v, r, s, I;
        c.close = function () {
            a = this.data("bPopup");
            e = "__b-popup" + d.data("bPopup") + "__";
            q()
        };
        return c.each(function () {
            b(this).data("bPopup") || (k(a.onOpen), t = (d.data("bPopup") || 0) + 1, e = "__b-popup" + t + "__", p = "auto" !== a.position[1], m = "auto" !== a.position[0], f = "fixed" === a.positionStyle, r = c.outerHeight(!0), s = c.outerWidth(!0), a.loadUrl ? K() : A())
        })
    };
    b.fn.bPopup.defaults = {
        amsl: 50,
        appending: !0,
        appendTo: "body",
        autoClose: !1,
        closeClass: "b-close",
        content: "ajax",
        contentContainer: !1,
        easing: "swing",
        escClose: !0,
        follow: [!0, !0],
        followEasing: "swing",
        followSpeed: 500,
        iframeAttr: 'scrolling="no" frameborder="0"',
        loadCallback: !1,
        loadData: !1,
        loadUrl: !1,
        modal: !0,
        modalClose: !0,
        modalColor: "#000",
        onClose: !1,
        onOpen: !1,
        opacity: 0.7,
        position: ["auto", "auto"],
        positionStyle: "absolute",
        scrollBar: !0,
        speed: 250,
        transition: "fadeIn",
        transitionClose: !1,
        zIndex: 9997
    }
})(jQuery);

function run() {
    document.getElementById("extend_size").value = document.getElementById("size-extends").value;
    document.getElementById("extend_style").value = document.getElementById("style-extends").value;
}


$(document).on('click', '.quantity-selector .entry', function () {
    var _qty = parseInt($('.quantity-selector .number').val());
    if ($(this).hasClass('sub')) {
        if (_qty > 1) {
            $('.quantity-selector .number').val(--_qty);
        }
    } else {
        $('.quantity-selector .number').val(++_qty);
    }
});


$(document).ready(function () {
    $('.choose-style').click(function () {
        var id_style = $(this).attr('data-id');
        $('#extend_style').val(id_style);
        $('.choose-style').removeClass('active');
        $(this).addClass('active');
    });

    $('.choose-size').click(function () {
        var id_size = $(this).attr('data-id');
        $('#extend_size').val(id_size);
        $('.choose-size').removeClass('active');
        $(this).addClass('active');
    });

    $('.c-item_choose--size .c-name_size--choose').click(function () {
        $('.c-show_color--name').removeClass('quantity')
        var id_size = $(this).attr('data-v');
        var name_size = $(this).attr('data-name');
        var sold_out = $(this).attr('data-stock');
        $('#quantity-size').text(sold_out)
        if (sold_out == 1) {
            $('#extend_size').val(id_size);
            $('#c-show_size--name span').html(name_size);
            $('.c-item_choose--size .c-name_size--choose').removeClass('active');
            $(this).addClass('active');
        } else {
            // $(this).addClass('active');
        }
 
        $('#c-show_size--name').text("SIZE :"+name_size)
    });

    del_cart();
});


function UpUpdateCart(id) {

    var val = parseInt($('#add_quantity_' + id).val());

    if (val <= 0) $('#add_quantity_' + id).val(val = 1);
    pro_id = id;
    up = 1;
    if (val < 6)
        quan = val + 1;
    else
        return false;
    
    return false;
}

function DowUpdateCart(id) {
    var val = parseInt($('#add_quantity_' + id).val());
    // if (val < 0) $('#add_quantity_'+id).val(val = 1);
    // $('#add_quantity_'+id).val(val + 1);
    if (val > 1) {
        pro_id = id;
        up = 2;
        quan = val - 1;
        return false;
    } else
        return false;
}


function del_cart() {

    $(".del-pro-link").click(function () {
        $a = $(this).attr("data-tr");
        $("." + $a).hide();

        var $id = $(this).attr("data-id");
       
    });
}


function save_post(id) {
    // var alert_info = $('#alert_info').val();
    // alert_info = alert_info ? JSON.parse(alert_info) : [];


    var name_id1 = $('.c-btn_heart');

}

function close__() {
    var close = document.getElementsByClassName("closebtn");
    var i;
    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function () {
                div.style.display = "none";
            }, 600);
        }
    }

    var x = document.getElementById("alert_")
    x.className = "alert";
    setTimeout(function () {
        x.className = x.className.replace("alert", "hide");
    }, 3000);
}