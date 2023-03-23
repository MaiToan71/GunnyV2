
$(document).ready(function () {
    $('.add-to-cart').click(function () {
        if ($.cookie("gunny_username") == undefined) {
            window.location.href = "/dang-nhap"
        } else {
            if ($.cookie("gunny_username") != $(this).attr('data-username')) {
                var className =$(this).attr('data-username')
                $.ajax({
                    method: "GET",
                    url: `/api/user/${$.cookie("gunny_username") }`,
                    contentType: "application/json",
                    success: function (data) {
                        var checked = false;
                        if (data.presenter != null) {
                            if (data.presenter.length > 0) {
                                checked = true
                                toastr.error("Bạn đã có đại lý rồi")
                            } 
                        }
                        if (checked == false) {
                            UpdatePresenter($.cookie("gunny_username"), className)
                        }
                    }
                })
            }
        }
    })
})

function UpdatePresenter(email, presenter) {
    $.ajax({
        method: "Post",
        url: `/api/user/${email}/${presenter}`,
        contentType: "application/json",
        success: function (data) {
            if (data == true) {
                $(`.btn.${presenter}`).text("Đã mua")
                $(`.btn.${presenter}`).removeClass("btn-success")
                $(`btn.${presenter}`).addClass("btn-danger")
                toastr.success("Đăng ký thành công")
            }
        }
    })
}
