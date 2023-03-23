var ViewModal = function () {
    self = this;
    self.showtoastError = function (msg, title) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "3000",
            "timeOut": "3000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr['error'](title, msg);
    };
    self.showtoastState = function (msg, title) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "3000",
            "timeOut": "3000",
            "extendedTimeOut": "3000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        toastr['success'](title, msg);
    };
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        newObj.Selected = ko.observable(false);
        return newObj;
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
    self.convertToJsonString = function (data) {
        return JSON.stringify(data)
    }

    self.convertToJSObject = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return ko.mapping.toJS(item);
        }
    }

    self.mode = ko.observable("");
    self.provinces = ko.observableArray();
    self.onchange = function () {
        $('#province').on('change', function () {
            self.getDistricts(Number($('#province').val()))
        });
        $('#district').on('change', function () {
            self.getCommunes(Number($('#district').val()))
        });
    }
    self.getProvinces = function () {
        $.ajax({
            method: "get",
            url: posUrl + `/geo/provinces`,
            contentType: "application/json",
            success: function (res) {
                self.provinces([])
                $.each(res.data, function (ex, item) {
                    self.provinces.push(item)
                })
                self.getDistricts(Number($('#province').val()))
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.districts = ko.observableArray();
    self.getDistricts = function (province_id) {
        $.ajax({
            method: "get",
            url: posUrl + `/geo/districts?province_id=${province_id}`,
            contentType: "application/json",
            success: function (res) {
                self.districts([])
                $.each(res.data, function (ex, item) {
                    self.districts.push(item)
                })
                self.getCommunes(Number($('#district').val()))
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.communes = ko.observableArray();
    self.getCommunes = function (district_id) {
        $.ajax({
            method: "get",
            url: posUrl + `/geo/communes?district_id=${district_id}`,
            contentType: "application/json",
            success: function (res) {
                self.communes([])
                $.each(res.data, function (ex, item) {
                    self.communes.push(item)
                })
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.data = ko.observableArray();
    self.totalMoney = ko.observable(0)
    self.data2 = ko.observableArray();

    self.totalQuantity = ko.observable(0)
    self.totalSale = ko.observable(0)
    self.totalMoneySale = ko.observable(0)
    self.getCookie = function () {
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
                    self.data([])
                    var product_total = 0;
                    self.data2([])
                    var totalQuantity = 0
                    var totalSale = 0;
                    var totalMoneySale = 0;
                    $.each(res.data, function (ex, item) {
                        $.each(JSON.parse($.cookie('chamy_products')), function (ex, cookie) {
                            item.cookieTotal = 0
                            item.cookieSize = ""
                            if (cookie.id == item.Web.Id) {
                                item.cookieTotal = cookie.total
                                item.cookieSize = cookie.sizeName
                                product_total += Number((Number(item.PosPrice) * Number(cookie.total)).toFixed(0))
                                cookie.product = item
                                self.data2.push(cookie)
                                self.data.push(item)
                                totalQuantity += item.cookieTotal
                                totalSale += Number((item.PosPrice - item.PosPriceSale).toFixed(0))

                                if (item.Sale == 0) {
                                    totalMoneySale += Number((Number(item.PosPrice) * Number(cookie.total)).toFixed(0))
                                }

                            }

                        })
                    })
                    console.log(totalMoneySale)
                    if (totalMoneySale < 3000000) {
                        totalMoneySale = 0;
                    } else if (totalMoneySale >= 3000000 && totalMoneySale <= 5000000) {
                        totalMoneySale = 5 * totalMoneySale/100;
                    } else {
                        totalMoneySale = 10 * totalMoneySale / 100;
                    }
                    self.totalMoneySale(totalMoneySale)
                    self.totalSale(totalSale)
                    self.totalQuantity(totalQuantity)
                    self.totalMoney(product_total)
                    var moneys = document.querySelectorAll('.money');
                    moneys.forEach(money => {

                        var x = Number(money.textContent);
                        if (!isNaN(x)) {
                            x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                            money.innerHTML = x;
                        }

                    });
                }
            })
        }
        if ($.cookie('userId_chamy')!= undefined) {
            $.ajax({
                method: "get",
                url: `/api/customer/${Number($.cookie('userId_chamy'))}`,
                contentType: "application/json",
                success: function (res) {
                    $('#sender_name').val(res.Fullname)
                    $('#sender_telephone').val(res.Phone)
                    $('#sender_email').val(res.Email)
                    self.user(res)
                }
            })
        }
    }
    self.user = ko.observable();
    self.sendMessager = function () {
        const messageForm = document.getElementById('submit-buy');
        messageForm.addEventListener('submit', ev => {
            ev.preventDefault();
            $("#submit-buy").validate({
                rules: {
                    sender_name: {
                        required: true,
                        minlength: 2
                    },
                    sender_telephone: {
                        required: true,
                        minlength: 10,
                        maxlength: 15
                    },
                    sender_email: {
                        required: true
                    },
                    province: {
                        required: true
                    },
                    district: {
                        required: true
                    },
                    wards: {
                        required: true
                    },
                    sender_address: {
                        required: true,
                        minlength: 2
                    }
                },
                messages: {
                    sender_name: {
                        required: "Bạn chưa nhập tên",
                        minlength: "Tối thiểu 2 ký tự",
                    },
                    sender_telephone: {
                        required: "Bạn chưa nhập số điện thoại",
                        minlength: "Tối thiểu 10 ký tự",
                        maxlength: "Tối đa 15 ký tự",
                    },
                    sender_email: {
                        required: "Bạn chưa nhập email",
                    },
                    province: {
                        required: "Bạn chưa chọn tỉnh/ thành phố",
                    },
                    district: {
                        required: "Bạn chưa chọn quận/huyện"
                    },
                    wards: {
                        required: "Bạn chưa chọn phường xã",
                    },
                    sender_address: {
                        required: "Bạn chưa nhập địa chỉ",
                        minlength: "Tối thiểu 2 ký tự",
                    }
                },
                submitHandler: function (form) {
                    connection.invoke('SendMessage', `${$('#sender_name').val()} đã mua sản phẩm`);
                }
            });
           
        });
       
    }

    self.buy = function () {
      //  self.sendMessager();
        $().ready(function () {
            $("#submit-buy").validate({
                rules: {
                    sender_name: {
                        required: true,
                        minlength: 2
                    },
                    sender_telephone: {
                        required: true,
                        minlength: 10,
                        maxlength:15
                    },
                    sender_email: {
                        required: true
                    },
                    province: {
                        required: true
                    },
                    district: {
                        required: true
                    },
                    wards: {
                        required: true
                    },
                    sender_address: {
                        required: true,
                        minlength: 2
                    }
                },
                messages: {
                    sender_name: {
                        required: "Bạn chưa nhập tên",
                        minlength: "Tối thiểu 2 ký tự",
                    },
                    sender_telephone: {
                        required: "Bạn chưa nhập số điện thoại",
                        minlength: "Tối thiểu 10 ký tự",
                        maxlength: "Tối đa 15 ký tự",
                    },
                    sender_email: {
                        required: "Bạn chưa nhập email",
                    },
                    province: {
                        required: "Bạn chưa chọn tỉnh/ thành phố",
                    },
                    district: {
                        required:"Bạn chưa chọn quận/huyện"
                    },
                    wards: {
                        required: "Bạn chưa chọn phường xã",
                    },
                    sender_address: {
                        required: "Bạn chưa nhập địa chỉ",
                        minlength: "Tối thiểu 2 ký tự",
                    }
                },
                submitHandler: function (form) {
                    if (self.totalQuantity() > 0) {
                        $('.preloader_regis').css('display', "block");
                        var obj = {
                            sender_name: $('#sender_name').val(),
                            sender_telephone: $('#sender_telephone').val(),
                            sender_email: $('#sender_email').val(),
                            province: $("#province option:selected").text(),
                            district: $("#district option:selected").text(),
                            wards: $("#wards option:selected").text(),
                            sender_address: $('#sender_address').val(),
                            sender_note: $('#sender_note').val(),
                            sender_SaleTotal: self.totalMoneySale()
                        }
                        if (self.user() == undefined) {
                            obj.customerId = 0
                        } else {
                            obj.customerId = self.user().Id
                        }

                        var orderDetails = [];
                        $.each(self.data2(), function (ex, item) {
                            var orderDetail = {
                                name: item.product.Web.Name,
                                price: item.product.PosPriceSale,
                                priceOld: item.product.PosPrice,
                                quantity: item.total,
                                size: item.sizeName,
                                color: '',
                                status: 0,
                                posCode: item.product.Web.PosCode
                            }
                            orderDetails.push(orderDetail)
                        })
                        obj.orderDetails = orderDetails;
                        $.ajax({
                            method: "POST",
                            url: `/api/Order/add`,
                            contentType: "application/json",
                            data: JSON.stringify(obj),
                            success: function (res) {
                                if (res.status == true) {
                                    self.sendEmail(obj.sender_email, obj)
                                }
                            }
                        })
                    } else {
                        toastr.error("Bạn chưa chọn mua sản phẩm nào")
                        $('.preloader_regis').css('display', "none");
                    }
                    return false; // required to block normal submit since you used ajax\

                }
            });
        })

    }
    self.totalQuantity = ko.observable()
    self.sendEmail = function (sender_email, obj) {
        var html = `

        <!doctype html>
        <html lang="en-US">

        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>CHAMY EMAIL</title>
            <meta name="description" content="CHAMY EMAIL">
        </head>
        <style>
            a:hover {text-decoration: underline !important;}
        </style>

        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <!-- Logo -->
                            <tr>
                                <td style="text-align:center;">
                                  <a href="https://www.chamy.vn/" title="logo" target="_blank">
                                    <img width="150" src="https://www.chamy.vn/frontend/img/logo-chamy-png-01-2.png" title="logo" alt="logo">
                                  </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <!-- Email Content -->
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px; background:#fff; border-radius:3px;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);padding:0 40px;">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <!-- Details Table -->
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0"
                                                    style="width: 100%; border: 1px solid #ededed">
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                Tên người dùng:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                               ${obj.sender_name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                Số điện thoại:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${obj.sender_telephone}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                Email:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${obj.sender_email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed;border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">
                                                                Thành phố:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${obj.province}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px;  border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                                Quận/huyện:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056;">
                                                                ${obj.district}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                                Phường/ xã:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056; ">
                                                                ${obj.wards}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                                Địa chỉ:</td>
                                                            <td
                                                                style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056; ">
                                                                ${obj.sender_address}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                            Ghi chú:</td>
                                                        <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056; ">
                                                           ${obj.sender_note}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%;font-weight:500; color:rgba(0,0,0,.64)">
                                                            Ngày mua:</td>
                                                        <td
                                                            style="padding: 10px; border-bottom: 1px solid #ededed; color: #455056; ">
                                                           ${Date.now()}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;font-weight: bold;" >Chi tiết đơn hàng</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #ededed">
                                                    <tbody>
        `
        var total = 0;
        var totalQuantity = 0;
        $.each(obj.orderDetails, function (ex, detail) {
            total += detail.price
            html += `<tr>
                    <td  style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">${detail.name}</td>
                    <td  style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">${detail.quantity}</td>
                    <td  style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)">${detail.size}</td>
                    <td class="money"  style="padding: 10px; border-bottom: 1px solid #ededed; border-right: 1px solid #ededed; width: 35%; font-weight:500; color:rgba(0,0,0,.64)"><span style="margin-right:10px;text-decoration: line-through!important;opacity:0.7">${formatVND(detail.priceOld)}</span><span>${ formatVND(detail.price)}<span></td>
                </tr>
            `
        })
        html += `
<tr>
                                                    <td style="height:40px;font-weight: bold;"colspan="4" >Tổng số lượng : <span style="color:blue; font-weight: bold;">${ self.totalQuantity()}</span></td>
                                                </tr>
<tr>
                                                    <td style="height:40px;font-weight: bold;"colspan="4" > Tổng tiền hàng : <span style="color:blue; font-weight: bold;">${ formatVND(self.totalMoney())}</span></td>
                                                </tr>
<tr>
                                                    <td style="height:40px;font-weight: bold;"colspan="4" > Chiết khấu : <span style="color:blue; font-weight: bold;">${ formatVND(self.totalSale())}</span></td>
                                                </tr>
<tr>
                                                    <td style="height:40px;font-weight: bold;"colspan="4" > Giảm giá hóa đơn : <span style="color:blue; font-weight: bold;">${ formatVND(self.totalMoneySale())}</span></td>
                                                </tr>
                 <tr>
                                                    <td style="height:40px;font-weight: bold;"colspan="4" > Khách phải trả : <span style="color:blue; font-weight: bold;">${ formatVND(self.totalMoney() - self.totalSale() - self.totalMoneySale())}</span></td>
                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                                <p style="font-size:14px; color:#455056bd; line-height:18px; margin:0 0 0;">&copy; <strong>https://www.chamy.vn</strong></p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>

                </html>
                `
        
        var obj = {
            "To": sender_email,
            "Subject": "Thông tin đơn hàng",
            "Body": html
        }
        $.ajax({
            method: "POST",
            url: `/api/email/sendto`,
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                setCookie('sender_email', sender_email, 365)
                setCookie('chamy_products', JSON.stringify([]), 365)
                window.location.href = "/dat-hang/xac-nhan"
            }
        })
    }
    function formatVND(x) {
        
        x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        return x;
    }
    function setCookie(name, value, days) {
        $.cookie(name, value, { path: '/' })
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.onchange();
    viewModal.getProvinces();
    viewModal.getCookie();
    viewModal.buy();
    
    ko.applyBindings(viewModal);
});