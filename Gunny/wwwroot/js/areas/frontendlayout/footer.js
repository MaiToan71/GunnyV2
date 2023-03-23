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
    self.convertToJSObject = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return ko.mapping.toJS(item);
        }
    }
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
    self.data = ko.observableArray();
    self.getWebConfig = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/config/all`,
            contentType: "application/json",
            success: function (res) {
                self.data([])
                $.each(res, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
                self.getTiny(self.data())
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.update = function () {
        $.each(self.data(), function (ex, item) {
            if (item.Name() == "return_product") {
                item.Code(tinymce.get("return_product").getContent())
                console.log(item)
            }
            if (item.Name() == "shipping") {
                item.Code(tinymce.get("shipping").getContent())
            }
            if (item.Name() == "store") {
                item.Code(tinymce.get("store").getContent())
            }
        })
        $.ajax({
            method: "post",
            url: backendUrl + `/api/config/modify`,
            contentType: "application/json",
            data: JSON.stringify({ data: self.convertToJSObject(self.data()) }),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.showtoastState("Đã cập nhật thành công")
                    self.getWebConfig()
                    window.location.reload()
                   
                }
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }

    self.getTiny = function (data) {
        $.each(data, function (ex, item) {
            $(`#${item.Name()}`).html(item.Code())
            tinymce.init({
                selector: `textarea#`+item.Name(),
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                a11y_advanced_options: true,
                a11ychecker_html_version: 'html5',
                a11ychecker_level: 'aaa',
                encoding: 'xml',
                entity_encoding: 'named+numeric+raw',
                entities: '160,nbsp',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            });
        })
       
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.getWebConfig();
    ko.applyBindings(viewModal);
});