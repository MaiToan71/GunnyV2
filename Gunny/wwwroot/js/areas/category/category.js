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
    function getGroupModel(data) {
        var items = getNestedGroup(0, data);
        //<remove duplicates, for infinity nesting only>   
        for (var i = 0; i < items.length; i++) {
            if (items[i].used) {
                items.splice(i, 1);
                i--;
            }
        }
        //</remove duplicates, for infinity nesting only>
        //<build root item>
        return items;
    };
    function getNestedGroup(index, all) {
        var root = all[index];
        if (!root) {
            return all;
        }
        if (!all[index].children) {
            all[index].children = [];
        }
        for (var i = 0; i < all.length; i++) {
            //<infinity nesting?>
            //put children inside it's parent
            if (all[index].id == all[i].parentID) {
                all[index].children.push(all[i]);
                all[i].used = true;
            }
            //</infinity nesting?>
        }
        //all[index].order = index;
        return getNestedGroup(++index, all);
    };

    self.data = ko.observableArray();
    self.getAll = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Category/all/config",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.data([])
                $.each(data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item))
                })
                if (self.data().length> 0) {
                    self.selectedItem(self.data()[0])
                } else {
                    var obj = {
                        ParentId: 0,
                        Name: "Chưa có dữ liệu",
                        IsShow: false,
                        Id:0
                    }
                    self.selectedItem(self.convertToKoObject(obj))
                }

                self.imgages([])
                self.imgagesMobile([])
                if (data.length > 0) {
                    $.each(data[0].Images, function (ex, img) {
                        if (img.IsMobile == 0) {
                            self.imgages.push(self.convertToKoObject(img))

                        } else {
                            self.imgagesMobile.push(self.convertToKoObject(img))
                        }
                    })
                }
                self.loadTreeView();
            },
            error: function (err) {
            }
        });
    }
    self.imgagesMobile = ko.observableArray();
    self.selectedItem = ko.observable();
    self.loadTreeView = function () {
        var data = [];
        $.each(self.data(), function (idx, item) {
            data.push({ id: item.Id(), text: item.Name(), parentID: item.ParentId(), isShow: item.IsShow(), isNew: item.IsNew() , topMenu : item.TopMenu()});
        });
        $("#tree_3").jstree("destroy");

        $("#tree_3").jstree({
            // 'plugins': ["wholerow", "checkbox", "types"],
            'core': {
                "themes": {
                    "responsive": false
                },
                'data': getGroupModel(data)
            },
            "types": {
                "default": {
                    "icon": "fa fa-folder icon-state-warning icon-lg"
                },
                "file": {
                    "icon": "fa fa-file icon-state-warning icon-lg"
                },
                "plugins": ["types"]
            },
            expand_selected_onload: true
        });
        $('#tree_3').on('ready.jstree', function () {
            $("#tree_3").jstree("open_all");
        });
        $("#tree_3").on("select_node.jstree",
            function (evt, data) {
                var nodeId = $('#tree_3').jstree().get_selected("id")[0].id;
                var nodeName = $('#tree_3').jstree().get_selected("id")[0].text;
                var parentID = $('#tree_3').jstree().get_selected("id")[0].parent;
                var isShow = $('#tree_3').jstree().get_selected("id")[0].original.isShow
                var isNew = $('#tree_3').jstree().get_selected("id")[0].original.isNew
                var topMenu = $('#tree_3').jstree().get_selected("id")[0].original.topMenu
                var gr = { Id: nodeId, Name: nodeName, ParentId: parentID, IsShow: isShow, IsNew: isNew, TopMenu: topMenu };

                self.selectedItemClick(gr.Id)
               

            }
        );
    }
    self.imgages = ko.observableArray();
    self.selectedItemClick = function (Id) {
        $.ajax({
            method: "get",
            url: backendUrl + "/api/Category/all/config/" + Id,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.imgages([])
                self.imgagesMobile([])
                $.each(data.Images, function (ex, img) {
                    if (img.IsMobile == 0) {
                        self.imgages.push(self.convertToKoObject(img))
                    } else {
                        self.imgagesMobile.push(self.convertToKoObject(img))
                    }
                })
                self.selectedItem(self.convertToKoObject(data))
            },
            error: function (err) {
            }
        });
    }
    self.updateCategory = function () {
        if (self.selectedItem().Name().length == 0) {
            self.showtoastError("Bạn chưa nhập tên danh mục")
        } else {
            var obj = self.convertToJSObject(self.selectedItem());
            if (obj.ParentId == undefined) {
                obj.ParentId =0
            }
            obj.IsBlog = false;
            if (obj.Id == obj.ParentId) {
                self.showtoastError("Không chọn trùng danh mục cha")
            } else {
                $.ajax({
                    method: "post",
                    url: backendUrl + "/api/Category/update/" + obj.Id,
                    contentType: "application/json",
                    headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                    data: JSON.stringify(obj),
                    success: function (data) {
                        if (data.status == true) {
                            self.showtoastState("Thành công")
                        }
                    },
                    error: function (err) {
                    }
                });
            }
        }
    }

    self.showModalAdd = function () {
        var obj = {
            ParentId: 0,
            Name: "",
            IsShow: false,
            Id: 0,
            IsNew: false,
            TopMenu: false
        }
        self.selectedItem(self.convertToKoObject(obj))
        $('#kt_category_children').modal('show')
    }
    self.addNewCategory = function () {
        if (self.selectedItem().Name().length == 0) {
            self.showtoastError("Bạn chưa nhập tên danh mục")
        } else {
            var obj = self.convertToJSObject(self.selectedItem());
            if (obj.ParentId == undefined) {
                obj.ParentId = 0
            }
            obj.IsBlog = false;
            $.ajax({
                method: "post",
                url: backendUrl + "/api/Category/add",
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(obj),
                success: function (data) {
                    if (data.status == true) {
                        self.getAll();
                        self.closeModalCategory()
                    }
                },
                error: function (err) {
                }
            });
        }
    }
    self.closeModalCategory = function () {
        $('#kt_category_children').modal('hide')
    }

    self.removeCategory = function () {
        
        $.ajax({
            method: "post",
            url: backendUrl + "/api/Category/remove/" + self.selectedItem().Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.checkToken()
                    self.showtoastState("Thành công")
                }
            },
            error: function (err) {
            }
        });
    }

    self.closeModalImage = function () {
        $('#kt_image').modal('hide')
    }
    self.isMobile = ko.observable(0)
    self.addModalImage = function () {
        self.isMobile(0)
        self.mode('add')
        $('#kt_image').modal('show')
    }
    self.addModalImageMobile = function () {
        self.isMobile(1)
        self.mode('add')
        $('#kt_image').modal('show')
    }
    self.addNewImage = function () {
        self.addClass()
        var formData = new FormData();
        // add assoc key values, this will be posts values
        var fileInput = document.getElementById('file');
        for (i = 0; i < fileInput.files.length; i++) {
            //Appending each file to FormData object
            console.log(fileInput.files[i])
            formData.append("File", fileInput.files[i]);
            formData.append("Size", fileInput.files[i].size);
            formData.append("IsMobile", self.isMobile());
            formData.append("CategoryImageId", self.selectedItem().Id());
        }


        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/image/upload`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    self.selectedItemClick(self.selectedItem().Id())
                    self.closeModalImage();
                }

            },
            error: function (err) {
                self.removeClass()
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }

    self.addClass = function () {
        $('#loading').addClass('loading')
    }
    self.removeClass = function () {
        $('#loading').removeClass('loading')
    }

    self.removeImage = function (item) {
        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/image/delete/` + item.Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    self.selectedItemClick(self.selectedItem().Id())
                }
              

            },
            error: function (err) {
                self.removeClass()
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }

    self.editLink = ko.observable();
    self.addModalLink = function (item) {
        self.editLink(item)
        $('#kt_image_link').modal('show')
    }
    self.closeModalLink = function () {
        $('#kt_image_link').modal('hide')
    }

    self.updateLink = function () {
        var obj = self.convertToJSObject(self.editLink())
        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/category/edit/linkproduct/` + obj.Id,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify(obj),
            success: function (data) {
                if (data.status) {
                    self.selectedItemClick(self.selectedItem().Id())
                    self.closeModalLink()
                    self.showtoastState("Đã cập nhật đường dẫn")
                }
            },
            error: function (err) {
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    ko.applyBindings(viewModal);
});