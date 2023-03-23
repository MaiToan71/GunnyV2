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

    self.checkToken = function () {
        var token = $.cookie("admin_token")
        if (token != undefined) {
            self.getAll();
            self.getRoles();
        } else {
            window.location.href = "/admin";
        }
    }

    self.data = ko.observableArray();
    self.getAll = function () {
        self.data([])
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Permission/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                $.each(data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.roles = ko.observableArray();
    self.getRoles = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/role/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.roles([])
                $.each(data, function (ex, item) {
                    self.roles.push(self.convertToKoObject(item))
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
        $('#name').val("");
        $('#list_role').select2()
        $('#list_role').val([]).change();
        $('#kt_modal_role').modal('show')
    }

    self.add = function () {
        var obj = {
            Name: $('#name').val(),
            ListRoles: $('#list_role').val().map(i => Number(i))
        }

        if (obj.Name.length == 0 ) {
            self.showtoastError("Không được để rỗng")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/Permission/add",
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(obj),
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
        var array = []
        $.each(item.ListRoles(), function (ex, r) {
            array.push(r.Id())
        })
        $('#name').val(item.Name())
        $('#list_role').select2()
        $('#list_role').val(array).change()
        self.mode('edit')
        self.item(item);
        $('#kt_modal_role').modal('show')
    }

    self.edit = function () {
        var obj = {
            Name: $('#name').val(),
            ListRoles: $('#list_role').val().map(i => Number(i))
        }

        if (obj.Name.length == 0) {
            self.showtoastError("Không được để rỗng")
        } else {
            self.deletePermistionRole(obj);
        }
    }

    self.deletePermistionRole = function (obj) {
        $.ajax({
            method: "get",
            url: backendUrl + "/api/Permission/remove/permistionrole/" + self.item().Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    $.ajax({
                        method: "POST",
                        url: backendUrl + "/api/Permission/update/" + self.item().Id(),
                        contentType: "application/json",
                        headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                        data: JSON.stringify(obj),
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
                } else {
                    self.showtoastError(data.message)
                }
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }

    self.delete = function (item) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/Permission/remove/" + item.Id(),
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