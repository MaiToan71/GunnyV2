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
            self.getUserId()
           
        } else {
            window.location.href = "/admin";
        }
    }

    self.user = ko.observable();
    self.getUserId = function () {
        var userId = $.cookie("admin_userid")
        if (userId != undefined) {
            $.ajax({
                method: "GET",
                url: backendUrl + "/api/user/" + Number(userId),
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    console.log(data)
                    self.user(self.convertToKoObject(data))
                    self.getAll();
                    self.getPer();
                },
                error: function (err) {
                }
            });
        } else {
            window.location.href = "/admin";
        }
    }

    self.data = ko.observableArray();
    self.getAll = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/user/all",
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
    self.permistions = ko.observableArray();
    self.getPer = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Permission/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.permistions([])
                $.each(data, function (ex, item) {
                    self.permistions.push(self.convertToKoObject(item))
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
        var obj = {
            Email: "",
            Username: "",
            Fullname: "",
            Password: "",
        }
        self.item(self.convertToKoObject(obj))
        $('#list_permistion').select2()
        $('#list_permistion').select2('val',[])
        $('#kt_modal_role').modal('show')
    }

    self.add = function () {
        var obj = self.convertToJSObject(self.item);
        if (obj.Email.length == 0 || obj.Username.length == 0 || obj.Fullname.length == 0 || obj.Password.length == 0) {
            self.showtoastError("Bạn không được để rỗng")
        } else {
            obj.ListPermistions = $('#list_permistion').val().map(i => Number(i))

            $.ajax({
                method: "POST",
                url: backendUrl + "/api/user/add",
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
                    self.showtoastError(err.responseJSON.message)
                }
            });
        }
    }

    self.openModalEdit = function (item) {
        self.mode('edit')

        self.item(item);
        var array = []
        $.each(item.Permissions(), function (ex, r) {
            console.log(r)
            array.push(r.Id())
        })
        $('#list_permistion').select2()
        $('#list_permistion').val(array).change()
        $('#kt_modal_role').modal('show')
    }

    self.edit = function () {
        var obj = self.convertToJSObject(self.item);
        if (obj.Email.length == 0 || obj.Username.length == 0 || obj.Fullname.length == 0 || obj.Password.length == 0) {
            self.showtoastError("Bạn không được để rỗng")
        } else {
            obj.ListPermistions = $('#list_permistion').val().map(i => Number(i))
            self.deletePermistionUser(obj);
        }
    }

    self.deletePermistionUser = function (obj) {
        $.ajax({
            method: "get",
            url: backendUrl + "/api/user/remove/permistionuser/" + self.item().Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {

                    // update
                    $.ajax({
                        method: "POST",
                        url: backendUrl + "/api/user/update/" + self.item().Id(),
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
            url: backendUrl + "/api/user/delete/" + item.Id(),
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

    self.openModalEditPassword = function (item) {
        self.item(item)
        $('#modal_pass').modal('show')
    }

    self.updatePassword = function () {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/user/password/" + self.item().Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(self.convertToJSObject(self.item())),
            success: function (data) {
                if (data.status == true) {
                    self.showtoastState(data.message)
                    $('#modal_pass').modal('hide')
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