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
        } else {
            window.location.href = "/admin";
        }
    }
    self.item = ko.observable();
    self.total = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(20);
    self.pageNumber = ko.observable(1)
    self.data = ko.observableArray();
    self.getAll = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/comment/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                self.data([])
                self.total(res.count);
                for (var i = 1; i <= Number((res.count / self.sizeNumber()).toFixed(0)); i++) {
                    self.pageTotals.push(i)
                }
                if (self.pageTotals().length == 0) {
                    self.pageTotals.push(1)
                }
                $.each(res.data, function (ex, item) {
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
            url: backendUrl + `/api/comment/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                self.data([])
                $.each(res.data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.prevNumberProduct = function () {
        self.pageNumber(self.pageNumber() - 1)
        if (self.pageNumber() > 1) {
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/comment/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (res) {
                    self.data([])
                    $.each(res.data, function (ex, item) {
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
    self.nextNumberProduct = function () {
        self.pageNumber(self.pageNumber() + 1)
        if (self.pageNumber() <= self.pageTotals().length) {
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/comment/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (res) {
                    self.data([])
                    $.each(res.data, function (ex, item) {
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

    self.selectedItem = ko.observable();
    
    self.showModalComment = function () {
        self.mode('add')
        var obj = {
            CustomerId: 0,
            Description: "",
            Vote: 0,
            IsShow: false
        }
        self.selectedItem(self.convertToKoObject(obj))
        $('#customer').select2()
        $('#product').select2()
        $('#product').val([]).change();
        $('#kt_comment').modal('show')
    }
    self.closeModalComment = function () {
        $('#kt_comment').modal('hide')
    }

    self.customer = ko.observableArray()
    self.getCustomers = function () {
        self.customer([])
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/customer/all`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                self.customer([])
                $.each(res.data, function (ex, item) {
                    self.customer.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }

    self.product = ko.observableArray();
    self.getProduct = function () {
        self.product([])
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/product/all`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.product([])
                $.each(data, function (ex, item) {
                    self.product.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }

    self.addNew = function () {
        if (self.selectedItem().Description().length == 0) {
            self.showtoastError("Bạn chưa nhập nội dung bình luận")
        } else if (self.selectedItem().CustomerId() == null || self.selectedItem().CustomerId() == undefined) {
            self.showtoastError("Bạn chưa chọn người bình luận")
        } else if ($('#product').val().length == 0) {
            self.showtoastError("Bạn chưa chọn bài viết")
        }

        else {
            var obj = self.convertToJSObject(self.selectedItem());
            obj.ListProduct = $('#product').val().map(i => Number(i))
            $.ajax({
                method: "post",
                url: backendUrl + `/api/comment/add`,
                contentType: "application/json",
                data: JSON.stringify(obj),
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    if (data.status == true) {
                        self.showtoastState("Thành công")
                        self.closeModalComment();
                        self.getAll();
                    }
                },
                error: function (err) {
                }
            });
        }
    }
    self.openModalEdit = function (item) {
        console.log(item.Products())
        self.selectedItem(item)
        var array =[]
        $.each(item.Products(), function (ex, item) {
            array.push(item.Id())
        })
        console.log(array)
        $('#product').select2()
        $('#product').val(array).change()
        $('#customer').select2();
        $('#customer').val(item.CustomerId());
        self.mode('edit')
        $('#kt_comment').modal('show')
    }
    self.update = function () {
        if (self.selectedItem().Description().length == 0) {
            self.showtoastError("Bạn chưa nhập nội dung bình luận")
        } else if (self.selectedItem().CustomerId() == null || self.selectedItem().CustomerId() == undefined) {
            self.showtoastError("Bạn chưa chọn người bình luận")
        } else if ($('#product').val().length == 0) {
            self.showtoastError("Bạn chưa chọn bài viết")
        } else {
            var obj = self.convertToJSObject(self.selectedItem());
            if (obj.IsShow == null) {
                obj.IsShow = false
            }
            obj.ListProduct = $('#product').val().map(i => Number(i))
            $.ajax({
                method: "post",
                url: backendUrl + `/api/comment/update/`+ obj.Id,
                contentType: "application/json",
                data: JSON.stringify(obj),
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    if (data.status == true) {
                        self.showtoastState("Thành công")
                        self.closeModalComment();
                        self.getAll();
                    }
                },
                error: function (err) {
                }
            });
        }
    }

    self.removeComment = function (item) {
        $.ajax({
            method: "post",
            url: backendUrl + `/api/comment/remove/` + item.Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.showtoastState("Thành công")
                    self.closeModalComment();
                    self.getAll();
                }
            },
            error: function (err) {
            }
        });
    }

}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    viewModal.getCustomers()
    viewModal.getProduct();
    ko.applyBindings(viewModal);
});