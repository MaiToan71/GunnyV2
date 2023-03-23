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
                    
                    self.user(self.convertToKoObject(data))
                    self.getAll();
                },
                error: function (err) {
                }
            });
        } else {
            window.location.href = "/admin";
        }
    }

    self.totalProduct = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(10);
    self.pageNumber = ko.observable(1)

    self.data = ko.observableArray();
    self.getAll = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/Customer/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.totalProduct(data.count)
                for (var i = 0; i <= Number((data.count / self.sizeNumber()).toFixed(0)); i++) {
                    self.pageTotals.push(i + 1)
                }
                if (self.pageTotals().length == 0) {
                    self.pageTotals.push(1)
                }

                self.data([])
                $.each(data.data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.numberProduct = function (item) {
        self.pageNumber(item)
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/Customer/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.totalProduct(data.count)
                self.data([])
                $.each(data.data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.nextNumberProduct = function () {
        self.pageNumber(self.pageNumber() + 1)
        if (self.pageNumber() <= self.pageTotals().length) {
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/Customer/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.totalProduct(data.count)
                    self.data([])
                    $.each(data.data, function (ex, item) {
                        self.data.push(self.convertToKoObject(item))
                    })
                },
                error: function (err) {
                }
            });
        } else {
            self.pageNumber(self.pageTotals().length)
        }
    }
    self.prevNumberProduct = function () {
        self.pageNumber(self.pageNumber() - 1)
        if (self.pageNumber() >= 1) {
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/Customer/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.totalProduct(data.count)
                    self.data([])
                    $.each(data.data, function (ex, item) {
                        self.data.push(self.convertToKoObject(item))
                    })
                },
                error: function (err) {
                }
            });
        } else {
            self.pageNumber(1)
        }
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
            IsClone: false,
            Phone: "",
            Address:""
        }
        self.item(self.convertToKoObject(obj))
        $('#kt_modal_role').modal('show')
    }

    self.add = function () {
        var obj = self.convertToJSObject(self.item);
        if (obj.Email.length == 0 || obj.Username.length == 0 || obj.Fullname.length == 0 || obj.Password.length == 0) {
            self.showtoastError("Bạn không được để rỗng")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/Customer/add",
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
        $('#kt_modal_role').modal('show')
    }

    self.edit = function () {
        var obj = self.convertToJSObject(self.item);
        if (obj.Email.length == 0  || obj.Fullname.length == 0 || obj.Password.length == 0) {
            self.showtoastError("Bạn không được để rỗng")
        } else {
            self.updateItem(obj)
        }
    }

    self.updateItem = function (obj) {
        // update
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/customer/edit/" + self.item().Id(),
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

    self.delete = function (item) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/customer/delete/" + item.Id(),
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
            url: backendUrl + "/api/customer/password/" + self.item().Id(),
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

    self.closeModalPassword = function () {
        $('#modal_pass').modal('hide')
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    ko.applyBindings(viewModal);
});