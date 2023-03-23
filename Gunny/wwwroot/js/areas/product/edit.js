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
    self.addClass = function () {
        $('#loading').removeClass('loading')
    }
    self.removeClass = function () {
        $('#loading').removeClass('loading')
    }
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
           
            self.getWarehouses()
        } else {
            window.location.href = "/admin";
        }
    }

  
    function getGroupModel(data, selected) {
        SampleJSONData2 = getNestedGroupLoad(0, data);
        //<remove duplicates, for infinity nesting only>   
        for (var i = 0; i < SampleJSONData2.length; i++) {
            if (SampleJSONData2[i].used) {
                SampleJSONData2.splice(i, 1);
                i--;
            }
        }
        var selectedInput = []
        $.each(selected, function (ex, item) {
            selectedInput.push(item.Id)
        })
        var obj = {
            source: SampleJSONData2,
            isMultiple: true,
            cascadeSelect: false,
            selected: selectedInput,

        }
        self.initComboTreePlace(obj);
    };
    function getNestedGroupLoad(index, all) {
        var root = all[index];
        if (!root) {
            return all;
        }
        if (!all[index].subs) {
            all[index].subs = [];
        }
        for (var i = 0; i < all.length; i++) {
            //<infinity nesting?>
            //put subs inside it's parent
            if (all[index].id == all[i].parentID) {
                all[index].subs.push(all[i]);
                all[i].used = true;
            }
            //</infinity nesting?>
        }
        if (all[index].subs.length == 0) {
            delete all[index].subs;
        }
        //all[index].order = index;
        return getNestedGroupLoad(++index, all);
    };
    
    self.initComboTreePlace = function (obj) {
        $("#InputSelectPlace").remove();
        $("#combo-place").append('<input type="text" id="InputSelectPlace" />');
        comboTree =  $('#InputSelectPlace').comboTree(obj);
    }
    self.categories = ko.observableArray();
    self.getCategory = function (selected) {
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Category/all",
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.categories([])
                $.each(data, function (ex, item) {
                    self.categories.push(self.convertToKoObject(item))
                })

                self.loadTreeView(selected)
            },
            error: function (err) {
            }
        });
    }
    var comboTree;
    self.loadTreeView = function (selected) {
        var data = [];
        $.each(self.categories(), function (idx, item) {
            data.push({ id: item.Id(), title: item.Name(), parentID: item.ParentId() });
        });
        getGroupModel(data, selected)
        console.log(data)
    }
    self.categorySelected = ko.observable()


    // lấy dữ liệu từ pos
    self.modalPOS = function () {
        $('#kt_modal_pos').modal('show')
        
        self.getPOS()
    }
    self.warehouses = ko.observableArray();
    self.getWarehouses = function () {
        
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/warehouses?api_key=${posToken}`,
            contentType: "application/json",
            success: function (res) {
                self.warehouses([])
                $.each(res.data, function (ex, item) {
                    self.warehouses.push(item)
                })
                self.addClass();
              
            },
            error: function (err) {
                self.removeClass()
                self.showtoastError(err)
            }
        });
    }
    self.pos = ko.observableArray();
    self.total = ko.observable(0)
    self.getPOS = function () {

        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&&page_number=1&&page_size=100`,
            contentType: "application/json",
            success: function (res) {
                self.total(res.total_entries)
                self.pos([])
                $.each(res.data, function (ex, item) {
                    $.each(item.variations_warehouses, function (ex, warehouse) {
                        $.each(self.warehouses(), function (ex, item_warehouse) {
                            if (warehouse.warehouse_id == item_warehouse.id) {
                                warehouse.name = item_warehouse.name
                            }
                        })
                    })
                    self.pos.push(item)
                })
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }

    self.closeModalPOS = function () {
        $('#kt_modal_pos').modal('hide')
    }

    self.getTiny = function (data) {
        $('#default-editor').html(data.Description)
        tinymce.init({
            selector: 'textarea#default-editor',
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
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        });
    }

    self.productItem = ko.observable();
    self.id = ko.observable()
    self.inputImgsMobile = ko.observableArray();
    self.getProductId = function () {
        var string = window.location.href
        var id = Number(string.split('=')[1]);
        self.id(id)
        $.ajax({
            method: "GET",
            url: backendUrl + "/api/Product/"+ id,
            contentType: "application/json",
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.getCategory(data.Categories);
                
                if (data.Sale == null) {
                    data.Sale = 0;
                }
              
                self.getPosById(data,data.PosCode)
               
                self.inputImgs([])
                self.inputImgsMobile([])
                $.each(data.Images.sort(function (l, r) { return l.Index > r.Index ? 1 : -1 }), function (ex, item) {
                    item.Selected = true;
                    if (item.IsMobile == 0) {
                      
                        self.inputImgs.push(self.convertToKoObject(item))
                    } else {
                        self.inputImgsMobile.push(self.convertToKoObject(item))
                    }
                })
                console.log(self.inputImgs())
                $("#sortable").sortable();
                self.removeClass()
                self.sortableEvent()

               
            },
            error: function (err) {
            }
        });
    }
    ko.bindingHandlers.sortable.afterMove = function (args) {
        self.inputImgs()
        self.inputImgsMobile()
    };
    self.sortableEvent = function () {
        $("#sortable").sortable({
            update: function (event, ui) {
               
                /*$.each(self.inputImgs(), function (i, obj) {
                    console.log(obj.Name())
                })*/
            },
        });
    }
   
    // lấy danh sách pos theo display_id
    self.posItems = ko.observableArray();
    self.getPosById = function (data,search) {
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&search=${search}&is_promotion=false&last_imported_price=false&limit_quantity_to_warn=false&nearly_out=false&page_size=100&page=1`,
            contentType: "application/json",
            success: function (res) {
                self.posItems([])
                if (res.data.length > 0) {
                    data.LinkPosName = res.data[0].name
                    self.productItem(self.convertToKoObject(data))
                    self.getTiny(data);
                }

                $.each(res.data, function (ex, list) {
                   
                    var id = 0
                    if (list.custom_id != null) {
                        id = list.custom_id
                    } else {
                        id = list.display_id
                    }

                    if (search == id) {
                        $.each(list.variations, function (ex, item) {
                            item.actual_remain_quantity = 0;
                            $.each(item.variations_warehouses, function (ex, warehouse) {
                                item.actual_remain_quantity += warehouse.actual_remain_quantity
                                $.each(self.warehouses(), function (ex, item_warehouse) {
                                    if (warehouse.warehouse_id == item_warehouse.id) {
                                        warehouse.name = item_warehouse.name
                                    }
                                })
                            })
                            console.log(item)
                            self.posItems.push(item)
                        })
                    }
                })
                self.changeVnd()
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
            x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
            money.innerHTML = x;
        });
    }

    //image
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

        $('#kt_modal_image').modal('hide')
    }
    self.removeAttachFile = function (item) {
        self.inputImgs.remove(item)
    }
    self.removeAttachFileMobile = function (item) {
        self.inputImgsMobile.remove(item)
    }
    self.updateProduct = function () {
        var ListImgs = []
        var count = 0;
        $.each(self.inputImgs(), function (ex, img) {
            count++;
            var obj = {
                index: count,
                imgId: img.Id()
            }
            ListImgs.push(obj)
        })
        $.each(self.inputImgsMobile(), function (ex, img) {
            count++;
            var obj = {
                index: count,
                imgId: img.Id()
            }
            ListImgs.push(obj)
        })
        console.log(ListImgs)
        var ListCates = []
        $.each(comboTree._selectedItems, function (ex, item) {
            ListCates.push(Number(item.id))
        })
      //  console.log(self.productItem().Description())
        self.productItem().Description(tinymce.get("default-editor").getContent())
        if (self.productItem().Name() == null || self.productItem().Name().length == 0) {
            self.showtoastError("Bạn chưa nhập tên sản phẩm")
        } else if (ListCates.length == 0) {
            self.showtoastError("Bạn chưa chọn danh mục")
        } else if (ListImgs.length == 0) {
            self.showtoastError("Bạn chưa chọn ảnh sản phẩm")
        } else {
            var obj = {
                ListImgs: ListImgs,
                ListCates: ListCates,
                Description: self.productItem().Description(),
                Name: self.productItem().Name(),
                Sale: self.productItem().Sale(),
                IsPublish: self.productItem().IsPublish(),
                Price: self.productItem().Price()
            }
            self.removeProductImage(obj)
           
        }
    }
    self.removeProductImage = function (obj) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/product/remove/ProductImage/" + self.productItem().Id(),
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.removeProductCategory(obj)
                }
            },
            error: function (err) {
            }
        });
    }
    self.removeProductCategory = function (obj) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/product/remove/ProductCategory/" + self.productItem().Id(),
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.updateProductToDb(obj)
                }
            },
            error: function (err) {
            }
        });
    }
    self.updateProductToDb = function (obj) {
        $.ajax({
            method: "POST",
            url: backendUrl + "/api/product/edit/" + self.productItem().Id(),
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                if (data.status == true) {
                    self.showtoastState("Cập nhật thành công")
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
        self.addClass();
        var listFormData = []
       
        // add assoc key values, this will be posts values
        var fileInput = document.getElementById('file');
        for (i = 0; i < fileInput.files.length; i++) {
            //Appending each file to FormData object

            var formData = new FormData();
            formData.append("File", fileInput.files[i]);
            formData.append("Size", fileInput.files[i].size);
            formData.append("CategoryImageId", Number($('#categories').val()));
            formData.append("IsMobile", self.isMobile());
            listFormData.push(formData)
          
        }
        var count = 0;
        $.each(listFormData, function (ex, data) {
            count++
            $.ajax({
                method: "post",
                url: backendUrl + `/api/Storage/image/upload/product/` + self.id(),
                contentType: "application/json",
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (count == listFormData.length) {
                        if (data.status) {
                            console.log(data)
                            if (data.img.IsMobile == 0) {
                                self.inputImgs.push(self.convertToKoObject(data.img))
                            } else {
                                self.inputImgsMobile.push(self.convertToKoObject(data.img))
                            }
                            self.removeClass()
                            self.closeModalImage();
                            self.getWarehouses();
                        }
                        self.removeClass()
                    }
                },
                error: function (err) {
                    self.removeClass()
                    self.showtoastError("Lỗi hệ thống")
                }
            });
        })
      
    }

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

  
    
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.checkToken();
    viewModal.getProductId()
    viewModal.getCategoryImage();
    ko.applyBindings(viewModal);
});