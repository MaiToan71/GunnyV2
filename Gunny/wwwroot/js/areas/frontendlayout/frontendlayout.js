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
            self.getCategory();
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

    self.categories = ko.observableArray();
    self.getCategory = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Storage/category/true",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.categories([])
                $.each(data, function (ex, item) {
                    self.categories.push(self.convertToKoObject(item))
                })
                if (self.categories().length > 0) {
                    self.selectedCategory(self.categories()[0])
                } else {
                    var gr = { Id: 0, Name: "Chưa có danh mục", ParentId: 0 };
                    self.selectedCategory(self.convertToKoObject(gr))

                }
                self.getImageByCategory()
                self.loadTreeView();
            },
            error: function (err) {
            }
        });
    }

    self.loadTreeView = function () {
        var data = [];
        $.each(self.categories(), function (idx, item) {
            if (item.ParentId() == item.Id()) {
                item.ParentId(0)
            }
            data.push({ id: item.Id(), text: item.Name(), parentID: item.ParentId() });
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
                var gr = { Id: nodeId, Name: nodeName, ParentId: parentID, Description: "" };
                self.selectedCategory(self.convertToKoObject(gr))
                self.getImageByCategory()
            }
        );
    }
    self.refeshTreeView = function () {
    }
    self.selectedCategory = ko.observable();
    self.mode = ko.observable("")
    self.openModalCategory = function () {
        self.mode('add')
        var gr = { Id: 0, Name: "", ParentId: 0, Description: "" };
        self.selectedCategory(self.convertToKoObject(gr))
        $('#categories').select2()
        $('#kt_category_children').modal('show')
    }

    self.addNewCategory = function () {
        if (self.selectedCategory().Name().length == 0) {
            self.showtoastError("Bạn chưa nhập tên danh mục")
        } else {
            var obj = self.convertToJSObject(self.selectedCategory())
            if (obj.ParentId == undefined) {
                obj.ParentId = 0
            }
            obj.IsFrontEnd = true
            $.ajax({
                method: "post",
                url: backendUrl + "/api/Storage/category/add",
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(obj),
                success: function (data) {
                    if (data.status == true) {
                        $('#kt_category_children').modal('hide')
                        self.showtoastState(data.message)
                        self.getCategory();
                    }
                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        }
    }
    self.closeModalCategory = function () {

        $('#kt_category_children').modal('hide')
    }

    self.openModalEditCategory = function (item) {
        self.mode('edit')
        $('#list_role').val(self.selectedCategory().ParentId()).change();
        $('#kt_category_children').modal('show')
    }

    self.updateCategory = function () {

        if (self.selectedCategory().Name().length == 0) {
            self.showtoastError("Bạn chưa nhập tên danh mục")
        } else {
            var obj = self.convertToJSObject(self.selectedCategory())
            obj.ParentId = 0
            $.ajax({
                method: "post",
                url: backendUrl + "/api/Storage/category/edit/" + obj.Id,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: JSON.stringify(obj),
                success: function (data) {
                    if (data.status == true) {
                        $('#kt_category_children').modal('hide')
                        self.showtoastState(data.message)
                        self.getCategory();
                    }
                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        }
    }

    self.totalImgages = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(20);
    self.pageNumber = ko.observable(1);
    self.imgages = ko.observableArray()
    self.getImageByCategory = function () {
        if (self.selectedCategory().Id() != 0) {
            $.ajax({
                method: "get",
                url: backendUrl + `/api/Storage/category/${self.selectedCategory().Id()}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.imgages([])
                    self.totalImgages(data.count)
                    $.each(data.data, function (ex, item) {
                        self.imgages.push(self.convertToKoObject(item))
                    })
                    $("#sortable").sortable();

                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        }
    }

    ko.bindingHandlers.sortable.afterMove = function (args) {
        self.imgages()
    };

    self.closeModalImage = function () {
        $('#kt_image').modal('hide')
    }
    self.addModalImage = function () {
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
            formData.append("CategoryImageId", self.selectedCategory().Id());
            formData.append("IsMobile", 0);
        }


        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/image/upload/categoryImage`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    self.removeClass()
                    self.closeModalImage();
                    self.getImageByCategory()
                }
                self.pageNumber(1);
                self.getImageByCategory()

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
                    self.getImageByCategory()
                }
                self.pageNumber(1);
                self.getImageByCategory()

            },
            error: function (err) {
                self.removeClass()
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }
    self.removeCategory = function () {
        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/category/delete/` + self.selectedCategory().Id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    self.pageNumber(1);
                    self.getCategory();
                    self.closeModalCategory()
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
        console.log(item)
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
                    self.pageNumber(1);
                    self.closeModalLink()
                    self.showtoastState("Đã cập nhật đường dẫn")
                }
            },
            error: function (err) {
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }

    self.updateIndex = function () {
        var arr = []
        var count = 0;
        $.each(self.imgages(), function (ex, item) {
            console.log(item)
            count++;
            var obj = {
                Id: item.Id(),
                Index:count
            }
            arr.push(obj)

        })
        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/image/index`,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: JSON.stringify({
                ListItems: arr
            }),
            success: function (data) {
                if (data.status) {
                    self.pageNumber(1);
                    self.closeModalLink()
                    self.showtoastState("Đã cập nhật vị trí")
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