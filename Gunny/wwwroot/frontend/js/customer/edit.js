$(document).ready(function () {
    var info_edit = $('#info_edit').val();
    array_info = info_edit ? JSON.parse(info_edit) : [];

    $("#formConfirm").click(function () {
        $(window).off("beforeunload");
        return true;
    });
    $('#btnConfirm').click(function () {
        if (checkFormConfirm())
            document.formConfirm.submit();
    });
    var info_buy = $('#info_edit').val();
    arr_alertBuy = info_buy ? JSON.parse(info_buy) : [];
});


function checkFormConfirm() {
    $('label.label_error').prev().remove();
    $('label.label_error').remove();

    if (!notEmpty2("password", "password", array_info[0])) {
        return false;
    }
    if (!lengthMin("password", 8, array_info[1])) {
        return false;
    }
    if (!uppercase('password', array_info[1])) {
        return false;
    }
    if (!number_pass('password', array_info[1])) {
        return false;
    }
    return true;
}


$('#changepass').change(function () {
    $('.pass_change').toggle(300);
    if ($('#changepass:checked').val() === 1) {
        $('#password').val('');
        $('#re-password').val('');
    }
});

