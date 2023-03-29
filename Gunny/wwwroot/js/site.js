
$(document).ready(function () {
    $('.btn-' + $.cookie("gunny_userid")).css('display','none')
    $('.add-to-cart').click(function () {
        var userIdSelected = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: `/api/user/${userIdSelected}`,
            contentType: "application/json",
            success: function (data) {
                var checked = false;
                if (data.parentId != null) {
                        checked = true
                        toastr.error("Bạn đã có đại lý rồi")
                }

                if (checked == false) {
                    console.log(data.userId)
                    console.log(userIdSelected)
                    UpdateParentId(data.userId, userIdSelected )
                }
            }
        })
    })
})

function UpdateParentId(userid, userIdSelected) {
    $.ajax({
        method: "Post",
        url: `/api/user/${userid}/${userIdSelected}`,
        contentType: "application/json",
        success: function (data) {
            if (data == true) {
              /*  $(`.btn.${presenter}`).text("Đã mua")
                $(`.btn.${presenter}`).removeClass("btn-success")
                $(`btn.${presenter}`).addClass("btn-danger")*/
                toastr.success("Đăng ký thành công")
            }
        }
    })
}