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

    self.searchPosSelected = function () {
        self.loadData()
    }
    self.data = ko.observableArray();
    self.loadData = function () {
          $.ajax({
              method: "get",
              url: "/api/GoogleSheet/all",
              contentType: "application/json",
              success: function (res) {
                    self.data([])
                  $.each(res, function (ex, item) {
                        self.data.push(self.convertToKoObject(item))
                    })
                  self.changeVnd()
                }
            })
    }
    self.item = ko.observable();
    self.openModal = function (item) {
        self.item(item)
        $('#kt_modal').modal('show')
    }
    self.closeModal = function () {
        $('#kt_modal').modal('hide')
    }

    self.confirm = function () {
        var items = []
        var item = self.convertToJSObject(self.item())
        item.OrerDetailId = 0;
        if (item.SenderCustomerPrice.length == 0) {
            item.SenderCustomerPrice = "_"
        }
        if (item.SenderCustomerDebt.length == 0) {
            item.SenderCustomerDebt = "_"
        }
        if (item.SenderCustomerNote.length == 0) {
            item.SenderCustomerNote = "_"
        }
        if (item.SenderCustomerCalled.length == 0) {
            item.SenderCustomerCalled = "_"
        }
        if (item.SenderShipingCode.length == 0) {
            item.SenderShipingCode = "_"
        }
        if (item.SenderShiped.length == 0) {
            item.SenderShiped = "_"
        }
        if (item.SenderTotalDays.length == 0) {
            item.SenderTotalDays = "_"
        }
        if (item.SenderEmailSupport.length == 0) {
            item.SenderEmailSupport = "_"
        }
        items.push(self.convertToJSObject(item))
        console.log(items)
        $.ajax({
            method: "POST",
            url: `/api/GoogleSheet/sucess`,
            contentType: "application/json",
            data: JSON.stringify(items),
            success: function (res) {
                self.closeModal();
                self.loadData()
            },
            error: function (err) {
            }
        });
    }

    self.remove = function () {
        var items = []
        var item = self.convertToJSObject(self.item())
        item.OrerDetailId = 0;
        if (item.SenderCustomerPrice.length == 0) {
            item.SenderCustomerPrice = "_"
        }
        if (item.SenderCustomerDebt.length == 0) {
            item.SenderCustomerDebt = "_"
        }
        if (item.SenderCustomerNote.length == 0) {
            item.SenderCustomerNote = "_"
        }
        if (item.SenderCustomerCalled.length == 0) {
            item.SenderCustomerCalled = "_"
        }
        if (item.SenderShipingCode.length == 0) {
            item.SenderShipingCode = "_"
        }
        if (item.SenderShiped.length == 0) {
            item.SenderShiped = "_"
        }
        if (item.SenderTotalDays.length == 0) {
            item.SenderTotalDays = "_"
        }
        if (item.SenderEmailSupport.length == 0) {
            item.SenderEmailSupport = "_"
        }
        items.push(self.convertToJSObject(item))
        $.ajax({
            method: "POST",
            url: `/api/GoogleSheet/delete`,
            contentType: "application/json",
            data: JSON.stringify(items),
            success: function (res) {
                self.closeModal();
                self.loadData()
            },
            error: function (err) {
            }
        });
    }
    self.searching = function () {
        $("#seacrh-pos").keyup(function () {
            var rows = $("#fbody").find("tr").hide();
            var data = this.value.split(" ");
            $.each(data, function (i, v) {
                rows.filter(":contains('" + v + "')").show();
            });
        });
       
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
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.loadData();
    viewModal.searching();
    ko.applyBindings(viewModal);
});