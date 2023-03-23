﻿var ViewModal = function () {
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

    self.checkToken = function () {
        var token = $.cookie("admin_token")
        if (token != undefined) {
            self.getAll();
        } else {
            window.location.href = "/admin";
        }
    }

    self.data = ko.observableArray();
    self.getAll = function () {
       
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/role/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.data([])
                $.each(data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }

    self.item = ko.observable()

    self.closeModal = function () {
        $('#kt_modal_role').modal('hide')
    }

    self.openModalAdd = function () {
        self.mode('add')
        var item = {
            ActionName: "",
            ActionCode: ""
        }
        self.item(self.convertToKoObject(item));
        $('#kt_modal_role').modal('show')
    }

    self.add = function () {
        if (self.item().ActionCode().length == 0 || self.item().ActionName().length == 0) {
            self.showtoastError("Không được để rỗng")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/role/add",
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(self.convertToJSObject(self.item())),
                success: function (data) {
                    if (data.status == true) {
                        self.showtoastState(data.message)
                        self.closeModal();
                        self.getAll();
                    } else {
                        self.showtoastError(data.message)
                    }
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        }
    }

    self.openModalEdit = function (item) {
        self.mode('edit')
        self.item(item);
        $('#kt_modal_role').modal('show')
    }

    self.edit = function () {
        if (self.item().ActionCode().length == 0 || self.item().ActionName().length == 0) {
            self.showtoastError("Không được để rỗng")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/role/update/" + self.item().Id(),
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(self.convertToJSObject(self.item())),
                success: function (data) {
                    if (data.status == true) {
                        self.showtoastState(data.message)
                        self.closeModal();
                        self.getAll();
                    } else {
                        self.showtoastError(data.message)
                    }
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        }
    }

    self.delete = function (item) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/role/delete/" + item.Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(self.convertToJSObject(self.item())),
            success: function (data) {
                if (data.status == true) {
                    self.showtoastState(data.message)
                    self.closeModal();
                    self.getAll();
                } else {
                    self.showtoastError(data.message)
                }
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    ko.applyBindings(viewModal);
});