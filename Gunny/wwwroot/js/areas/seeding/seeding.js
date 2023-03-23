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

    self.item = ko.observable({
        value:""
    })
    var connection;

    self.sendMessager = function () {
        $(document).ready(function () {
            connection = new signalR.HubConnectionBuilder()
                .withUrl("/signalServer")
                .configureLogging(signalR.LogLevel.Information)
                .build();
            connection.on('newMessage', (sender, messageText) => {
                $.each(JSON.parse(messageText), function (ex, item) {
                    // toastr.success("Vài giây trước", `${item.Name} <br/> ${item.Note}`)
                })
            });
            connection.start()
                .then(() => console.log('connected!'))
                .catch(console.error);
            setInterval(monitorDevice, self.config().TimeAuto()*1000);

        })
     
    }
    function monitorDevice() {
        if (self.config().IsStart() == true) {
            connection.invoke('SendMessage', JSON.stringify(self.convertToJSObject(self.data())))
        }
    }            
    self.notiSucess = function () {
        self.showtoastState("Đã cập nhật thông báo toàn hệ thống")
    }

    self.data = ko.observableArray();
    self.getSeeding = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Seeding/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.data([])
                $.each(data.data, function (ex, item) {
                    
                    self.data.push(self.convertToKoObject(item))
                })
                if (self.data().length > 0) {
                    self.config(self.data()[0])
                }
                self.sendMessager();
            },
            error: function (err) {
            }
        });
    }
    self.item = ko.observable()
    self.modalAddNew = function () {
        var obj = {
            Name: "",
            Id: 0,
            Date: new Date(),
            Note: "",
            IsStart: true,
            TimeAuto:60,
        }
        self.item(self.convertToKoObject(obj))
        $('#kt_modal').modal('show')
        self.mode('add')
    }
    self.closeModal = function () {
        $('#kt_modal').modal('hide')

    }
    self.addNew = function () {
        var item = self.convertToJSObject(self.item())
        if (item.Name.length == 0 || item.Note.length == 0 || item.Date.length == 0 || item.Date == undefined || item.Date == null) {
            self.showtoastError("Hãy nhập đủ thông tin")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/Seeding/add",
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(item),
                success: function (data) {
                    self.closeModal();
                    self.getSeeding()
                },
                error: function (err) {
                }
            });
        }
    }
    self.openModalEdit = function (item) {
        self.mode('edit')
        self.item(item)
        $('#kt_modal').modal('show')
    }
    self.editItem = function () {
        var item = self.convertToJSObject(self.item())
        if (item.Name.length == 0 || item.Note.length == 0 || item.Date.length == 0 || item.Date == undefined || item.Date == null) {
            self.showtoastError("Hãy nhập đủ thông tin")
        } else {
            $.ajax({
                method: "POST",
                url: backendUrl + "/api/Seeding/update/"+ item.Id,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(item),
                success: function (data) {
                    self.showtoastState("Đã cập nhật")
                    self.closeModal();
                    self.getSeeding()
                },
                error: function (err) {
                    self.showtoastError("Có lỗi hệ thống")
                }
            });
        }
    }
    self.remove = function (item) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/Seeding/delete/" + item.Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(item),
            success: function (data) {
                self.closeModal();
                self.getSeeding()
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }

    self.config = ko.observable()
    self.modalConfig = function () {
        if (self.data().length > 0) {
            self.config(self.data()[0])
            $('#kt_modal_config').modal('show')
        } else {
            self.showtoastError("Chưa có dữ liệu")
        }
    }
    self.closeModalConfig = function () {
        $('#kt_modal_config').modal('hide')
    }
    self.updateConfig = function () {
        var item = self.convertToJSObject(self.config())
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/Seeding/update/all" ,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(item),
            success: function (data) {
                self.closeModalConfig()
                self.getSeeding();
                if (item.IsStart == true) {
                    connection.invoke('SendMessage', JSON.stringify(self.convertToJSObject(self.data())));
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
   
    viewModal.getSeeding()
    ko.applyBindings(viewModal);
});