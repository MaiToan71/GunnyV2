$(document).ready(function () {
    $('#admin_fullname').text($.cookie("gunny_username"))
    $('#admin_fullname_cms').text($.cookie("gunny_username_admin"))
    $.each($('.menu-link'), function () {
        var href = $(this).attr('href');
        var url = location.pathname;
        $(this).removeClass('active')
        if (href == url) {
            $('#page-selected').text($(this).parent().parent().parent().text().trim().split("\n")[0] + " : " + ($(this).text().trim()))
            $(this).addClass('active')
            $(this).parent().parent().parent().addClass('show')
        }
    })
   

});