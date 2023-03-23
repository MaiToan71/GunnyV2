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

    self.total = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(20);
    self.pageNumber = ko.observable(1)
    self.data = ko.observableArray();
    self.getAll = function () {
        if ($.cookie('admin_page_blog') != undefined) {
            self.pageNumber($.cookie('admin_page_blog'))
        } else {
            self.pageNumber(1)
            $.cookie('admin_page_blog', self.pageNumber())
        }
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/blog/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
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
        $.cookie('admin_page_blog', item)
        self.pageNumber(item)
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/blog/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
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
            $.cookie('admin_page_blog', self.pageNumber() )
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/blog/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
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
            $.cookie('admin_page_blog', self.pageNumber())
            $.ajax({
                method: "GET",
                url: backendUrl + `/api/blog/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
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
    self.modalAddBlog = function () {
        var obj = {
            Title: "",
            CategoryId: 0,
        }
        self.selectedItem(self.convertToKoObject(obj))
        $('#kt_modal_add_blog').modal('show')
    }
    self.categories = ko.observableArray();
    self.getCategory = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/category/blog/all`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                self.categories([])
                $.each(res, function (ex, item) {
                    self.categories.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.closeModalCategory = function () {
        $('#kt_modal_add_blog').modal('hide')
    }

    self.addNewBlog = function () {
        if (self.selectedItem().CategoryId() == 0 || self.selectedItem().CategoryId() == undefined) {
            self.showtoastError("Bạn chưa chọn danh mục")
        } else if (self.selectedItem().Title().length == 0) {
            self.showtoastError("Bạn chưa nhập tiêu đề")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + `/api/blog/add`,
                contentType: "application/json",
                data: JSON.stringify(self.convertToJSObject(self.selectedItem())),
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (res) {
                    if (res.status == true) {
                        self.closeModalCategory();
                        self.getAll();
                        self.showtoastState("Thành công")
                    }
                },
                error: function (err) {
                    self.showtoastError("Có lỗi hệ thống")
                }
            });
        }
    }

    
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    viewModal.getCategory()
    ko.applyBindings(viewModal);
});