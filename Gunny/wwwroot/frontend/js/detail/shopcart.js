$('.c-box_viewCart .c-option_quantity').change(function () {

    var quantity = parseInt($(this).val());
    var id = $(this).attr('data-id');
    if (quantity <= 0) $('#add_quantity_' + id).val(quantity = 1);
    if (quantity < 7 && quantity > 0) {
        $.ajax({
            type: 'POST',
            url: 'index.php?module=product&view=product&raw=1&task=changeQuantityCart',
            dataType: 'json',
            data: {pro_id: id, quan: quantity},
            success: function ($json) {
                if ($json.error == true) {
                    //     alert($json.msg);
                } else {
                    $('.c-btn_cart .c-amount_cart').html('(' + $json.total + ')');
                    $('.c-box_viewCart .c-box_shopping--cart').html($json.html);

                    // $(".c-modal_overlay").toggle();
                    // $(".menu_header .c-box_viewCart").toggle(400);
                    $(".c-box_search .search-box").hide('slow');

                    // setTimeout(function () {
                    //     $('.c-btn_cart .c-alert_addCart').addClass('hide');
                    //     // location.reload();
                    //     //  // $('.c-btn_cart .c-alert_addCart span').remove();
                    // }, 2500)
                }
                //
                // $('#checkadd_quantity_' + id).html(quan);
                // $('#add_quantity_' + id).val(quan);
                // window.location.reload(true);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Có lỗi trong quá trình tải lên máy chủ. Xin bạn vui lòng kiểm tra lại kết nối.');
            }
        });
    }
    return false;


})


$(".c-del_incart").click(function () {
    $a = $(this).attr("data-tr");
    // $("." + $a).hide();
    var load = $(this).attr('data-load');
    var $id = $(this).attr("data-id");
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/index.php?module=product&view=product&task=edel&raw=1',
        data: "id=" + $id,
        success: function (data) {
            $('.c-btn_cart .c-amount_cart').html('(' + data.total + ')');
            $('.c-box_viewCart .c-box_shopping--cart').html( data.html);
            if(load == 1){
                window.location.reload(true);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('Có lỗi trong quá trình tải lên máy chủ. Xin bạn vui lòng kiểm tra lại kết nối.');
        }
    });
});


