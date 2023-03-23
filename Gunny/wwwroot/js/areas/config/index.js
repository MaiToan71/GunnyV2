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
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.update = function () {
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
                   
                }
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.getWebConfig();
    ko.applyBindings(viewModal);
});