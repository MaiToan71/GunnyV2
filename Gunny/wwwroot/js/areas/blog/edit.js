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

    self.id = ko.observable()
    self.mode = ko.observable("");

    self.checkToken = function () {
        var token = $.cookie("admin_token")
        if (token != undefined) {
            self.id(Number($('#blogId').val()))
            self.getCategory()
        } else {
            window.location.href = "/admin";
        }
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

                self.getByid(self.id())
            },
            error: function (err) {
            }
        });
    }

    self.item = ko.observable()
    self.itemRuntime = ko.observable()
    self.getByid = function (id, upload) {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/blog/"+ id,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.inputImgs();
                self.itemRuntime(self.convertToKoObject(data))
                self.item(self.convertToKoObject(data))
                self.getImgByBlogId(data.ImageId);
                self.Body(self.item().Body())
                self.getTiny();
                self.suggestProduct([])
                var count = 0;
                $.each(data.Products, function (ex, item) {
                    count++
                    self.getProductPos(item, data.Products.length, count,'byid')
                })

            },
            error: function (err) {
            }
        });
    }
    self.Body = ko.observable()
    self.getTiny = function () {
        tinymce.init({
            selector: 'textarea#tinymce-body',
            menubar: true,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            a11y_advanced_options: true,
            a11ychecker_html_version: 'html5',
            a11ychecker_level: 'aaa',
            encoding: 'xml',
            entity_encoding: 'named+numeric+raw',
            entities: '160,nbsp',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            height: "4800",
            setup: function (editor) {
                editor.on('Paste Change input Undo Redo', function () {
                    self.getChange()
                });
            }
        });

        $('.tox-statusbar__branding').css('display','none')
    }

    self.getChange = function (item) {
        self.itemRuntime().Title($('#title-body').val())
        self.itemRuntime().Description($('#description-body').val())
        self.itemRuntime().Body(tinymce.get("tinymce-body").getContent())
    }
    self.update = function (check) {
        var suggestProduct=[]
        $.each(self.suggestProduct(), function (ex, item) {
            suggestProduct.push(item.Id)

        })
        
        if (self.item().CategoryId() == undefined || self.item().CategoryId() == null) {
            self.showtoastError("Bạn chưa chọn danh mục")
        } else if (self.item().Title().length == 0) {
            self.showtoastError("Bạn chưa nhập tiêu đề")
        } else {
            var save = true
            if (check == "upload") {
                save = true
            } else {
                if (self.inputImgs().length == 0) {
                    self.showtoastError("Bạn chưa cập nhật ảnh sản phẩm")
                    save = false
                }
            }
            if (save == true) {
                self.item().Body(tinymce.get("tinymce-body").getContent())
                self.item().ImageId(self.inputImgs()[0].Id())
                var obj = self.convertToJSObject(self.item())
                obj.SuggestProductIds = suggestProduct
                $.ajax({
                    method: "post",
                    url: backendUrl + "/api/blog/update/" + self.id(),
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                    success: function (data) {
                        if (data.status == true) {
                            self.getByid(self.id())
                            self.showtoastState("Đã cập nhật thành công")
                        }
                    },
                    error: function (err) {
                        self.showtoastError("Có lỗi hệ thống")
                    }
                });
            }
        }
    }

    // image
    self.categoryImages = ko.observableArray();
    self.getCategoryImage = function () {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Storage/category/false",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.categoryImages([])
                $.each(data, function (ex, item) {
                    self.categoryImages.push(self.convertToKoObject(item))
                })
            },
            error: function (err) {
            }
        });
    }
    self.closeModalImageSelect = function () {
        $('#kt_modal_image').modal('hide')
    }
    self.modalImage = function () {
        self.getImages()
        $('#kt_modal_image').modal('show')
    }
    self.images = ko.observableArray()
    self.totalImgages = ko.observable()
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(20);
    self.pageNumber = ko.observable(1);
    self.getImages = function () {
        self.pageNumber(1)
        self.pageTotals([])
        if (self.categoryImages().length > 0) {
            $.ajax({
                method: "get",
                url: backendUrl + `/api/Storage/category/${self.categoryImages()[0].Id()}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    
                    self.images([])
                    self.totalImgages(data.count)
                    for (var i = 0; i <= Number((data.count / self.sizeNumber()).toFixed(0)); i++) {
                        self.pageTotals.push(i + 1)
                    }
                    if (self.pageTotals().length == 0) {
                        self.pageTotals.push(1)
                    }

                    $.each(data.data, function (ex, item) {
                        item.Selected = true;
                        self.images.push(self.convertToKoObject(item))
                    })
                    self.selectedImage()
                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });

        }
    }
    self.prevNumberProduct = function () {
        self.pageNumber(self.pageNumber() - 1)
        if (self.pageNumber() >= 1) {
            if (self.categoryImages().length > 0) {
                $.ajax({
                    method: "get",
                    url: backendUrl + `/api/Storage/category/${Number($('#selectImage').val())}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                    contentType: "application/json",
                    headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                    success: function (data) {
                        self.images([])
                        $.each(data.data, function (ex, item) {
                            item.Selected = true;
                            self.images.push(self.convertToKoObject(item))
                        })
                    },
                    error: function (err) {
                        self.showtoastError("Lỗi hệ thống")
                    }
                });

            }
        } else {
            self.pageNumber(1)
        }
    }
    self.nextNumberProduct = function () {
        self.pageNumber(self.pageNumber() + 1)
        if (self.pageNumber() <= self.pageTotals().length) {
            if (self.categoryImages().length > 0) {
                $.ajax({
                    method: "get",
                    url: backendUrl + `/api/Storage/category/${Number($('#selectImage').val())}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                    contentType: "application/json",
                    headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                    success: function (data) {
                        self.images([])
                        $.each(data.data, function (ex, item) {
                            item.Selected = true;
                            self.images.push(self.convertToKoObject(item))
                        })
                    },
                    error: function (err) {
                        self.showtoastError("Lỗi hệ thống")
                    }
                });

            }
        } else {
            self.pageNumber(self.pageTotals().length)
        }
    }
    self.numberProduct = function (item) {
        self.pageNumber(item)
        if (self.categoryImages().length > 0) {
            $.ajax({
                method: "get",
                url: backendUrl + `/api/Storage/category/${Number($('#selectImage').val())}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.images([])
                    $.each(data.data, function (ex, item) {
                        item.Selected = true;
                        self.images.push(self.convertToKoObject(item))
                    })
                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });

        }
    }

    self.selectedImage = function () {
        $('#selectImage').change(function () {
            $.ajax({
                method: "get",
                url: backendUrl + `/api/Storage/category/${Number($('#selectImage').val())}/pageNumber/${self.pageNumber()}/pageSize/${self.sizeNumber()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.images([])
                    self.totalImgages(data.count)
                    $.each(data.data, function (ex, item) {
                        item.Selected = true;
                        self.images.push(self.convertToKoObject(item))
                    })

                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        });
    }
    self.onSelectedAttach = function (item) {
        item.Selected(!item.Selected());
    }
    self.inputImgs = ko.observableArray();
    self.addImage = function () {
        self.inputImgs([])
        $.each(self.images(), function (ex, item) {
            var check = false;
            $.each(self.inputImgs(), function (ex, input) {
                if (input.Id() == item.Id()) {
                    check = true
                }
            })
            if (check == false) {
                if (item.Selected()) {
                    self.inputImgs.push(item)
                }
            }
        })
        if (self.inputImgs().length == 1) {

            $('#kt_modal_image').modal('hide')
        } else {
            self.inputImgs([])
            self.showtoastError("Bạn chỉ được chọn 1 ảnh")
        }
    }
    self.removeAttachFile = function (item) {
        console.log(item)
        self.inputImgs.remove(item)
    }
    self.addModalImage = function () {
        self.mode('add')
        $('#kt_image').modal('show')
    }
    self.closeModalUpload = function () {
        $('#kt_image').modal('hide')
    }
    self.getImgByBlogId = function (id) {
        if (id != null) {
            self.inputImgs([])
            $.ajax({
                method: "get",
                url: backendUrl + `/api/image/${self.item().ImageId()}`,
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                success: function (data) {
                    self.inputImgs.push(self.convertToKoObject(data))
                },
                error: function (err) {
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        }
    }
    self.addNewImage = function () {
        var formData = new FormData();
        // add assoc key values, this will be posts values
        var fileInput = document.getElementById('file');
        for (i = 0; i < fileInput.files.length; i++) {
            //Appending each file to FormData object
            formData.append("File", fileInput.files[i]);
            formData.append("Size", fileInput.files[i].size);
            formData.append("IsMobile", 0);
            formData.append("CategoryImageId", Number($('#categories-img').val()));
        }

        $.ajax({
            method: "post",
            url: backendUrl + `/api/Storage/image/upload/blog/` + self.id(),
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status) {
                    self.inputImgs([])
                    self.inputImgs.push(self.convertToKoObject(data.value))
                    self.showtoastState("Thành công")
                    self.update("upload")
                    self.closeModalUpload();
                }
            },
            error: function (err) {
                console.log(err)
                self.showtoastError("Lỗi hệ thống")
            }
        });
    }

    self.addProduction = function () {
        self.pageTotals([])
        self.searchProductSelected();
        self.getProduct();
        $('#kt_modal_production').modal('show')
       
    }


    self.totalProduct = ko.observable()
    self.product = ko.observableArray();
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(10);
    self.pageNumber = ko.observable(1)
    self.getProduct = function () {
        var obj = {
            pageSize: self.sizeNumber(),
            pageNumber: self.pageNumber(),
            isPublish: 1,
            search: "",
            isSale: 0,
        }
        $.ajax({
            method: "POST",
            url: backendUrl + `/api/product/all`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                self.product([])
                self.pageTotals();
                self.totalProduct(res.count)
                for (var i = 0; i <= Number((res.count / self.sizeNumber()).toFixed(0)); i++) {
                    self.pageTotals.push(i + 1)
                }
                if (self.pageTotals().length == 0) {
                    self.pageTotals.push(1)
                }

                var count = 0;
                $.each(res.data, function (ex, item) {
                    count++
                    self.getProductPos(item, res.data.length, count)
                })
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.getProductPos = function (value, total, count, check) {

        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/variations?api_key=${posToken}&search=${value.PosCode}`,
            contentType: "application/json",
            success: function (res) {
                count++;
                value.total = 0
                value.retail_price = 0
                if (value.Sale == null) {
                    value.Sale = 0
                }
                value.retail_price = value.Price;
                $.each(res.data, function (ex, item) {
                    $.each(item.variations_warehouses, function (ex, warehouse) {
                        value.total += warehouse.actual_remain_quantity
                    })
                })
                value.sale_retail_price = value.retail_price - (value.retail_price * value.Sale / 100).toFixed(0)
                value.isSelected = false;
                self.product.push(value)
                if (check == 'byid') {
                    self.suggestProduct.push(value)
                }
                if (count - 1 == total) {
                    self.changeVnd()
                }

              

            },
            error: function (err) {
                self.showtoastError(err)
            }
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
    self.numberProduct = function (item) {
        self.pageNumber(item)
        var obj = {
            pageSize: self.sizeNumber(),
            pageNumber: self.pageNumber(),
            isPublish: 1,
            search: "",
            isSale: 0,
        }
        $.ajax({
            method: "POST",
            url: backendUrl + `/api/product/all`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                self.product([])
                var count = 0;
                $.each(res.data, function (ex, item) {
                    count++
                    self.getProductPos(item, res.data.length, count)
                })
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.nextNumberProduct = function () {
        self.pageNumber(self.pageNumber() + 1)
        if (self.pageNumber() <= self.pageTotals().length) {
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: 1,
                search: "",
                isSale: 0,
            }
            $.ajax({
                method: "POST",
                url: backendUrl + `/api/product/all`,
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (res) {
                    self.product([])
                    var count = 0;
                    $.each(res.data, function (ex, item) {
                        count++
                        self.getProductPos(item, res.data.length, count)
                    })
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        } else {
            self.pageNumber(self.pageTotals().length)
        }
    }
    self.prevNumberProduct = function () {
        self.pageNumber(self.pageNumber() - 1)
        if (self.pageNumber() >= 1) {
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: 1,
                search: "",
                isSale: 0,
            }
            $.ajax({
                method: "POST",
                url: backendUrl + `/api/product/all`,
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (res) {
                    self.product([])
                    var count = 0;
                    $.each(res.data, function (ex, item) {
                        count++
                        self.getProductPos(item, res.data.length, count)
                    })
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        } else {
            self.pageNumber(1)
        }
    }
    self.closeModalPOS = function () {
        $('#kt_modal_production').modal('hide')
    }
    self.searchProductSelected = function () {
        $("#seacrh-production").on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                if ($('#seacrh-production').val().length > 0) {
                    var obj = {
                        pageSize: self.sizeNumber(),
                        pageNumber: self.pageNumber(),
                        isPublish: 1,
                        search: $('#seacrh-production').val(),
                        isSale: 0,
                    }
                    $.ajax({
                        method: "POST",
                        url: backendUrl + `/api/product/all`,
                        headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function (res) {
                            self.product([])
                            var count = 0;
                            self.pageTotals([])
                            self.totalProduct(res.count)
                            for (var i = 0; i <= Number((res.count / self.sizeNumber()).toFixed(0)); i++) {
                                self.pageTotals.push(i + 1)
                            }
                            if (self.pageTotals().length == 0) {
                                self.pageTotals.push(1)
                            }
                            $.each(res.data, function (ex, item) {
                                count++
                                self.getProductPos(item, res.data.length, count)
                            })
                        },
                        error: function (err) {
                            self.showtoastError(err)
                        }
                    });
                } else {
                    self.getProduct();
                }
            }
        })
    }

    self.suggestProduct = ko.observableArray();
    self.selectedProduction = function ( item) {
        $('#production-' + item.Id).text("Đã chọn")
        $('#production-' + item.Id).css("display",'none')
        self.showtoastState("Đã chọn")
        self.suggestProduct.push(item)
    }
    self.removeProduction = function (item) {
        self.suggestProduct.remove(item)
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    viewModal.getCategoryImage();
    ko.applyBindings(viewModal);
});