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
            $("#kt_daterangepicker_5").daterangepicker();
            self.getAll();
        } else {
            window.location.href = "/admin";
        }
    }

    self.total = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(30);
    self.pageNumber = ko.observable(1)
    self.data = ko.observableArray();
    self.searchPosSelected = function () {
        $("#seacrh-pos").keydown(function () {
                var obj = {
                    posCode: $('#seacrh-pos').val(),
                    start: "",
                    end: ""
                }
                $.ajax({
                    method: "post",
                    url: backendUrl + `/api/Order/search`,
                    contentType: "application/json",
                    data: JSON.stringify(obj),
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
                     self.pageTotals([])
                        $.each(res.data, function (ex, item) {
                            var totalPrice = 0;
                            $.each(item.OrderDetails, function (ex, detail) {
                                totalPrice += detail.Price * detail.Quantity
                            })
                            item.totalPrice = totalPrice
                            if (item.Status == 0) {
                                item.Status = false
                            } else {
                                item.Status = true
                            }
                            self.data.push(self.convertToKoObject(item))
                        })
                    },
                    error: function (err) {
                    }
                });
        });

        $('.applyBtn').click(function () {
            var obj = {
                posCode:"",
                start: "",
                end: ""
            }
            if ($('.drp-selected').text().length == 0) {
                 obj.start = moment().format('YYYY_MM_DD');
                 obj.end = moment().format('YYYY_MM_DD')
             }
             else {
                 obj.start = moment($('.drp-selected').text().split('-')[0]).format('YYYY_MM_DD');
                 obj.end = moment($('.drp-selected').text().split('-')[1]).format('YYYY_MM_DD')
             }
            $.ajax({
                method: "post",
                url: backendUrl + `/api/Order/search`,
                contentType: "application/json",
                data: JSON.stringify(obj),
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
                    self.pageTotals([])
                    $.each(res.data, function (ex, item) {
                        var totalPrice = 0;
                        $.each(item.OrderDetails, function (ex, detail) {
                            totalPrice += detail.Price * detail.Quantity
                        })
                        item.totalPrice = totalPrice
                        if (item.Status == 0) {
                            item.Status = false
                        } else {
                            item.Status = true
                        }
                        self.data.push(self.convertToKoObject(item))
                    })
                },
                error: function (err) {
                }
            });
        })
        
    }

    self.getAll = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + `/api/Order/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                $('#count').text(res.count)
                $('#countIsStatusDone').text(res.countIsStatusDone)
                $('#countIsStatusNotDone').text(res.countIsStatusNotDone)
                self.data([])
                self.pageTotals([])
                self.total(res.count);
                for (var i = 1; i <= Number((res.count / self.sizeNumber()).toFixed(0)); i++) {
                    self.pageTotals.push(i)
                }
                if (self.pageTotals().length == 0) {
                    self.pageTotals.push(1)
                }
                $.each(res.data, function (ex, item) {
                    var totalPrice = 0;
                    $.each(item.OrderDetails, function (ex, detail) {
                        totalPrice += detail.Price * detail.Quantity
                    })
                    item.totalPrice = totalPrice
                    if (item.Status == 0) {
                        item.Status = false
                    } else {
                        item.Status = true
                    }
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
            url: backendUrl + `/api/Order/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (res) {
                self.data([])
                $.each(res.data, function (ex, item) {
                    var totalPrice = 0;
                    $.each(item.OrderDetails, function (ex, detail) {
                        totalPrice += detail.Price * detail.Quantity
                    })
                    item.totalPrice = totalPrice
                    if (item.Status == 0) {
                        item.Status = false
                    } else {
                        item.Status = true
                    }
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
                url: backendUrl + `/api/Order/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (res) {
                    self.data([])
                    $.each(res.data, function (ex, item) {
                        var totalPrice = 0;
                        $.each(item.OrderDetails, function (ex, detail) {
                            totalPrice += detail.Price * detail.Quantity
                        })
                        item.totalPrice = totalPrice
                        if (item.Status == 0) {
                            item.Status = false
                        } else {
                            item.Status = true
                        }
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
                url: backendUrl + `/api/Order/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (res) {
                    self.data([])
                    $.each(res.data, function (ex, item) {
                        var totalPrice = 0;
                        $.each(item.OrderDetails, function (ex, detail) {
                            totalPrice += detail.Price * detail.Quantity
                        })
                        item.totalPrice = totalPrice
                        if (item.Status == 0) {
                            item.Status = false
                        } else {
                            item.Status = true
                        }
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
    self.changeVnd = function () {

        var moneys = document.querySelectorAll('.money');
        moneys.forEach(money => {

            var x = Number(money.textContent);
            if (!isNaN(x)) {
                x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                money.innerHTML = x;
            }

        });
    }

    self.googleSheetModal = ko.observableArray();
    self.openModalDetail = function (item) {

        self.googleSheetModal([])
        $.each(item.OrderDetails(), function (ex, i) {
            var googleSheet = {
            OrderId: "Ma_"+item.Id(),
            OrerDetailId  : i.Id(),
            RowId: i.RowId(),
            SenderName: item.SenderName(),
            SenderPhonenumber: item.SenderTelephone(),
            SenderAddress: item.SenderAddress() + ", " + item.Wards() + ", " + item.District() + "," + item.Province(),
            SenderProductName: i.Name(),
            SenderSize: i.Size(),
            SenderColor: i.Size(),
            SenderQuantity: i.Quantity(),
            SenderTotalMoney: i.Price() ,
            SenderOrderPrice: i.Price() * i.Quantity(),
            SenderCustomerPrice: " ",
            SenderCustomerDebt: " ",
            SenderCustomerNote: " ",
            SenderCustomerCalled: " ",
            SenderShipingCode: " ",
            SenderShiped: " ",
            SenderTotalDays: " ",
            SenderEmailSupport: " ",
            DateTime: moment(item.CreatedAt()).format('DD-MM-YYYY'),
            }
            if (i.RowId() == null) {
                googleSheet.RowId = 0
            }
             
            self.googleSheetModal.push(self.convertToKoObject(googleSheet))
        }
        )
        self.item(item)
        self.changeVnd();
        $('#kt_modal_role').modal('show')
    }
    self.item = ko.observable();
    self.closeModal = function () {
        $('#kt_modal_role').modal('hide')
    }

    self.confirm = function () {
        console.log(self.convertToJSObject(self.item()))
        $.ajax({
            method: "POST",
            url: backendUrl + `/api/Order/update/${self.item().Id()}`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(self.convertToJSObject(self.item())),
            success: function (res) {
                if (res.status == true) {
                    self.getAll()
                    self.showtoastState("Đã cập nhật")
                    self.closeModal()
                }
            },
            error: function (err) {
            }
        });
    }
  
    self.addGoogleSheet = function () {
        if (self.item().Status() == true) {
            var items = []
                $.each(self.googleSheetModal(), function (ex, item) {
                            if (ex > 0) {
                                item.SenderAddress = " "
                                item.SenderName = " "
                                item.SenderPhonenumber = " "
                                item.OrderId = " "
                                item.DateTime = " "

                            }
                            if (ex == self.googleSheetModal().length - 1) {
                                item.SenderOrderPrice = Number(self.item().totalPrice()) - Number(self.item().SaleTotal())
                            } else {
                                item.SenderOrderPrice = " "
                            }
                            item.SenderCustomerPrice = " "
                            item.SenderCustomerDebt = " "
                            item.SenderCustomerNote = " "
                            item.SenderCustomerCalled = " "
                            item.SenderShipingCode = " "
                            item.SenderShiped = " "
                            item.SenderTotalDays = " "
                            item.SenderEmailSupport = " "
                            items.push(self.convertToJSObject(item))
            })
            console.log(items)
           $.ajax({
                method: "POST",
                url: backendUrl + `/api/GoogleSheet`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(items),
                success: function (res) {
                    self.showtoastState("Đã xuất excel")

                },
                error: function (err) {
                }
            });
        } 
    }

    self.modalAddExport = function () {
        $('#kt_modal_excel').modal('show')
       /* var arr = []
        var uids = $('input[name="uids[]"]');
        uids.filter(":checked").map(function () {
            arr.push(this.value)
        }).get();
       */
    }
    self.closeModalExcel = function () {
        $('#kt_modal_excel').modal('hide')
    }
    self.exportToExcel = function () {
        var srartTime = moment($('#startdate').val()).format('YYYY_MM_DD');
        var endTime = moment($('#enddate').val()).format('YYYY_MM_DD');
        window.location = backendUrl + `/api/Order/export/${srartTime}/${endTime}`
    }

    self.removeOrder = function (item) {
        bootbox.confirm({
            message: "Bạn có muốn xóa ?",
            buttons: {
                confirm: {
                    label: 'Đồng ý',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Hủy bỏ',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $('.bootbox-close-button').hide()


                    $.ajax({
                        method: "post",
                        url: backendUrl + `/api/Order/remove/${item.Id()}`,
                        contentType: "application/json",
                        headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                        success: function (res) {
                            self.getAll()
                        },
                        error: function (err) {
                        }
                    });
                }
            }
                });
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    viewModal.searchPosSelected();
    ko.applyBindings(viewModal);
});