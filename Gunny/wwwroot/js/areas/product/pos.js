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
    self.addClass = function () {
        $('#loading').addClass('loading')
    }
    self.removeClass = function () {
        $('#loading').removeClass('loading')
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
            self.getProduct();
        } else {
            window.location.href = "/admin";
        }
    }

    // lấy dữ liệu từ pos
    self.modalPOS = function () {
        self.mode('getposall')
        $('#kt_modal_pos').modal('show')

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
                self.getPOS()
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.searchPosSelected = function () {
        self.posPage(1)
        $("#seacrh-pos").on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                self.addClass()
           
        if (self.mode() == "getzero") {
            self.posSize(100)
        }
        if (self.mode() == "getposall") {
            self.posSize(30)
        }
        var search = $('#seacrh-pos').val()
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&search=${search}`,
            contentType: "application/json",
            success: function (res) {
                self.pos([])
                $.each(res.data, function (ex, item) {
                    item.retail_price = 0
                    item.images = []
                    if (item.variations.length > 0) {
                        item.retail_price = item.variations[0].retail_price
                        item.images = item.variations[0].images
                    }
                   
                    item.product = item
                    if (self.mode() == "getzero") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        if (item.remain_quantity == 0) {
                            self.pos.push(item)
                        }
                    }
                    if (self.mode() == "getposall") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        if (item.remain_quantity != 0) {
                            self.pos.push(item)
                        }
                    }
                    self.removeClass();
                })
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
            }
        })
    }
    self.pos = ko.observableArray();
    self.total = ko.observable(0)

    self.posTotal = ko.observable(0)
    self.posPage = ko.observable(1)
    self.posSize = ko.observable(30)
    self.posPageTotals = ko.observableArray()
    self.getPOS = function () {
        self.pos([])
        //paging
        self.posPageTotals([])
        self.posPage(self.posPage())
        if (self.mode() == "getzero") {
            self.posSize(100)
        }
        if (self.mode() == "getposall") {
            self.posSize(30)
        }
        self.addClass();
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&page=${self.posPage()}&page_size=${self.posSize()}&nearly_out=false&limit_quantity_to_warn=false&last_imported_price=false&is_promotion=false`,
            contentType: "application/json",
            success: function (res) {
                self.total(res.total_entries)
                for (var i = 1; i <= Number((self.total() / self.posSize()).toFixed(0)); i++) {
                        self.posPageTotals.push(i)
                }
                $.each(res.data, function (ex, item) {
                    if (self.mode() == "getzero") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        if (item.remain_quantity == 0) {
                            self.pos.push(item)
                        }
                    }
                    if (self.mode() == "getposall") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        self.pos.push(item)
                    }
                })
                self.removeClass();
                self.changeVnd()
            },
            error: function (err) {
               
            }
        });
    }
    self.prevPosNumberProductFirst = function () {
        self.posPage(1)
        self.getPOS();
    }
    self.nextPosNumberProductLast = function () {
        self.posPage(self.posPageTotals().length)
        console.log(self.posPage())
        self.getPOS();
    }
    self.numberPosProduct = function (item) {
        self.posPage(item)
        self.addClass()
        if (self.mode() == "getzero") {
            self.posSize(100)
        }
        if (self.mode() == "getposall") {
            self.posSize(30)
        }
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&page=${self.posPage()}&page_size=${self.posSize()}&nearly_out=false&limit_quantity_to_warn=false&last_imported_price=false&is_promotion=false`,
            contentType: "application/json",
            success: function (res) {
                self.total(res.total_entries)
                self.pos([])
                //paging
                self.posPageTotals([])
                for (var i = 1; i < Number((self.total() / self.posSize()).toFixed(0)); i++) {
                    self.posPageTotals.push(i)
                }
               
                $.each(res.data, function (ex, item) {
                    if (self.mode() == "getzero") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        if (item.remain_quantity == 0) {
                            self.pos.push(item)
                        }
                    }
                    if (self.mode() == "getposall") {
                        item.remain_quantity = 0;
                        $.each(item.variations, function (ex, variation) {
                            item.remain_quantity += variation.remain_quantity
                        })
                        self.pos.push(item)
                    }
                })
                self.removeClass()
                self.changeVnd()
            },
            error: function (err) {
            }
        });
    }
    self.prevPosNumberProduct = function () {
        if (self.mode() == "getzero") {
            self.posSize(100)
        }
        if (self.mode() == "getposall") {
            self.posSize(30)
        }
        self.addClass()
        self.posPage(self.posPage() - 1)
        if (self.pageNumber() > 1) {
            $.ajax({
                method: "get",
                url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&page=${self.posPage()}&page_size=${self.posSize()}&nearly_out=false&limit_quantity_to_warn=false&last_imported_price=false&is_promotion=false`,
                contentType: "application/json",
                success: function (res) {
                    self.total(res.total_entries)
                    self.pos([])
                    //paging
                    self.posPageTotals([])
                    for (var i = 1; i <= Number((self.total() / self.posSize()).toFixed(0)); i++) {
                        self.posPageTotals.push(i)
                    }
                    console.log(self.posPageTotals())

                    $.each(res.data, function (ex, item) {
                        if (self.mode() == "getzero") {
                            item.remain_quantity = 0;
                            $.each(item.variations, function (ex, variation) {
                                item.remain_quantity += variation.remain_quantity
                            })
                            if (item.remain_quantity == 0) {
                                self.pos.push(item)
                            }
                        }
                        if (self.mode() == "getposall") {
                            item.remain_quantity = 0;
                            $.each(item.variations, function (ex, variation) {
                                item.remain_quantity += variation.remain_quantity
                            })
                            self.pos.push(item)
                        }
                    })
                    self.removeClass()
                    self.changeVnd()
                },
                error: function (err) {
                }
            });
        } else {
            self.posPage(1)
        }
    }
    self.nextPosNumberProduct = function () {
        if (self.mode() == "getzero") {
            self.posSize(100)
        }
        if (self.mode() == "getposall") {
            self.posSize(30)
        }
        self.posPage(self.posPage() + 1)
        self.addClass()
        if (self.pageNumber() <= self.pageTotals().length) {
            $.ajax({
                method: "get",
                url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&page=${self.posPage()}&page_size=${self.posSize()}&nearly_out=false&limit_quantity_to_warn=false&last_imported_price=false&is_promotion=false`,
                contentType: "application/json",
                success: function (res) {
                    self.total(res.total_entries)
                    self.pos([])
                    //paging
                    self.posPageTotals([])
                    for (var i = 1; i <= Number((self.total() / self.posSize()).toFixed(0)); i++) {
                        self.posPageTotals.push(i)
                    }
                    console.log(self.posPageTotals())

                    $.each(res.data, function (ex, item) {
                        if (self.mode() == "getzero") {
                            item.remain_quantity = 0;
                            $.each(item.variations, function (ex, variation) {
                                item.remain_quantity += variation.remain_quantity
                            })
                            if (item.remain_quantity == 0) {
                                self.pos.push(item)
                            }
                        }
                        if (self.mode() == "getposall") {
                            item.remain_quantity = 0;
                            $.each(item.variations, function (ex, variation) {
                                item.remain_quantity += variation.remain_quantity
                            })
                            self.pos.push(item)
                        }
                    })
                    self.removeClass()
                    self.changeVnd()
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        } else {
            self.posPage(self.total().length)
        }
    }

    self.closeModalPOS = function () {
       
        $('#kt_modal_pos').modal('hide')

    }
    function findById(id) {
        var item;
        $.each(self.pos(), function (ex, posItem) {
            if (posItem.custom_id != null) {
                if (posItem.custom_id == id) {
                    item = posItem;

                }
            } else {
                if (posItem.display_id == id) {
                    item = posItem;

                }
            }

        })
        return item
    }
    self.getPosSelected = function () {
            var listItems = []
            var obj = {
                PosCode: "",
                LinkPosName: $('#add-product-name').val(),
                UserId: $.cookie('admin_userid'),
                Fullname: $.cookie('admin_fullname'),
                IsTagBlog: false,
                Price: $('#add-product-price').val(),
            }
            listItems.push(obj)
            $.ajax({
                method: "post",
                data: JSON.stringify({ ListItems: listItems }),
                url: backendUrl + `/api/product/pos/add`,
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                contentType: "application/json",
                success: function (res) {
                       $('#kt_modal_pos').modal('hide')
                        self.getProduct()
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
    }

    self.totalProduct = ko.observable()
    self.product = ko.observableArray();
    self.pageTotals = ko.observableArray()
    self.sizeNumber = ko.observable(10);
    self.pageNumber = ko.observable(1)
    function delay(callback, ms) {
        var timer = 0;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    self.searchProduct = function () {
        
        $("#seacrh-product").on('keyup', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                self.addClass();
                getSearchProduct()
            }
        });

      /*  $("#seacrh-product").on('keyup change', function () {
            if ($("#seacrh-product").val().length >= 2) {
                self.product([])
                getSearchProduct()
            }
        })*/
  function getSearchProduct() {
      $.cookie('isSale', $('#isSale').val())
      $.cookie('selected', $('#selected').val())
      $.cookie('admin_page_product', 1)
      $.cookie('seacrh_product', $('#seacrh-product').val())
      self.pageNumber(1)
    self.addClass();
    var obj = {
        pageSize: self.sizeNumber(),
        pageNumber: self.pageNumber(),
        isPublish: $('#selected').val(),
        search: $('#seacrh-product').val(),
        isSale: $('#isSale').val(),
    }
    $.ajax({
        method: "POST",
        url: backendUrl + `/api/product/all`,
        headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function (res) {
            self.product([])
            self.pageTotals([])
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
            self.removeClass();
        },
        error: function (err) {
            self.showtoastError(err)
        }
    });
}

        $('#selected').change(function () {
            self.addClass()
            self.pageNumber(1)
            $.cookie('isSale', $('#isSale').val())
            $.cookie('selected', $('#selected').val())
            $.cookie('admin_page_product', self.pageNumber())
            $.cookie('seacrh_product', $('#seacrh-product').val())
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: $('#selected').val(),
                search: $('#seacrh-product').val(),
                isSale: $('#isSale').val(),
            }
            $.ajax({
                    method: "POST",
                    url: backendUrl + `/api/product/all`,
                    headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                    contentType: "application/json",
                    data: JSON.stringify(obj),
                    success: function (res) {
                        self.pageTotals([])
                    self.product([])
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
                        self.removeClass()
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        })

        $('#isSale').change(function () {
            self.addClass()
            self.pageNumber(1)
            $.cookie('admin_page_product', self.pageNumber())
            $.cookie('isSale', $('#isSale').val())
            $.cookie('selected', $('#selected').val())
            $.cookie('seacrh_product', $('#seacrh-product').val())
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: $('#selected').val(),
                search: $('#seacrh-product').val(),
                isSale: $('#isSale').val(),
            }
            $.ajax({
                method: "POST",
                url: backendUrl + `/api/product/all`,
                headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
                contentType: "application/json",
                data: JSON.stringify(obj),
                success: function (res) {
                    self.pageTotals([])
                    self.product([])
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
                    self.removeClass();
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        })

    }
    self.loadFirst = ko.observable(true);
    self.getProduct = function () {
        self.addClass();
        var search = "";
        if ($.cookie('seacrh_product') != undefined) {
            var search = $.cookie('seacrh_product');
            $('#seacrh-product').val(search)
        } else {
            $('#seacrh-product').val(search)
        }
        if ($.cookie('isSale') != undefined) {
            if (self.loadFirst()) {
               $('#isSale').val($.cookie('isSale')).change()
            }
        } else {
            $('#isSale').val(0).change()
        }
        if ($.cookie('selected') != undefined) {
            if (self.loadFirst()) {
                $('#selected').val($.cookie('selected')).change()
            }
        } else {
            $('#selected').val(0).change()
        }
        if ($.cookie('admin_page_product') != undefined) {
            self.pageNumber($.cookie('admin_page_product'))
        } else {
            self.pageNumber(1)
            $.cookie('admin_page_product', self.pageNumber())
        }
        var obj = {
            pageSize: self.sizeNumber(),
            pageNumber: self.pageNumber(),
            isPublish: $('#selected').val(),
            search: $('#seacrh-product').val(),
            isSale: $('#isSale').val(),
        }
        $.ajax({
            method: "POST",
            url: backendUrl + `/api/product/all`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                self.product([])
                self.pageTotals([])
                self.totalProduct(res.count)
                for (var i = 0; i < Number((res.count / self.sizeNumber()).toFixed(0)); i++) {
                        self.pageTotals.push(i + 1)
                }
                if (self.pageTotals().length == 0) {
                    self.pageTotals.push(1)
                }
                var count = 0;
                $.each(res.data, function (ex, item) {
                    count++
                    self.product.push(item)
                })
                self.changeVnd()

                self.removeClass();
                if (self.loadFirst()) {
                    self.searchPosSelected();
                }
                self.loadFirst(false)
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.getProductPos = function (value, total, count) {
        $.ajax({
            method: "get",
            url: posUrl + `/shops/${shopId}/products?api_key=${posToken}&search=${value.PosCode}&is_promotion=false&last_imported_price=false&limit_quantity_to_warn=false&nearly_out=false&page_size=100&page=1`,
            contentType: "application/json",
            success: function (res) {
                count++;
                value.total = 0
                value.retail_price = 0
                if (value.Sale == null) {
                    value.Sale = 0
                }
               
                $.each(res.data, function (ex, list) {
                    var id = 0
                    if (list.custom_id != null) {
                        id = list.custom_id
                    } else {
                        id = list.display_id
                    }
                    if (value.PosCode == id) {
                        $.each(list.variations, function (ex, item) {
                            value.total += item.remain_quantity

                            value.retail_price = item.retail_price
                        })
                    }
                })

              
                value.sale_retail_price = value.retail_price - (value.retail_price * value.Sale / 100).toFixed(0)

                self.product.push(value)
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
            if (!isNaN(x)) {
                x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                money.innerHTML = x;
            }

        });
    }
    self.numberProduct = function (item) {
        self.addClass()
        $.cookie('admin_page_product',item)
      
        self.pageNumber(item)

        var obj = {
            pageSize: self.sizeNumber(),
            pageNumber: self.pageNumber(),
            isPublish: $('#selected').val(),
            search: $('#seacrh-product').val(),
            isSale: $('#isSale').val(),
        }
        $.ajax({
            method: "POST",
            url: backendUrl + `/api/product/all`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                self.removeClass()
                self.product([])
                var count = 0;
                $.each(res.data, function (ex, item) {
                    self.product.push(item)
                })
                self.changeVnd()
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.nextNumberProduct = function () {
        self.pageNumber(self.pageNumber() + 1)
        if (self.pageNumber() <= self.pageTotals().length) {
            $.cookie('admin_page_product', self.pageNumber())
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: $('#selected').val(),
                search: $('#seacrh-product').val(),
                isSale: $('#isSale').val(),
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
                        self.product.push(item)
                    })
                    self.changeVnd()
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
            $.cookie('admin_page_product', self.pageNumber())
            var obj = {
                pageSize: self.sizeNumber(),
                pageNumber: self.pageNumber(),
                isPublish: $('#selected').val(),
                search: $('#seacrh-product').val(),
                isSale: $('#isSale').val(),
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
                        console.log(item)
                        self.product.push(item)
                    })
                    self.changeVnd()
                },
                error: function (err) {
                    self.showtoastError(err)
                }
            });
        } else {
            self.pageNumber(1)
        }
    }
    self.prevNumberProducFirst = function () {
        self.pageNumber(1)
        $.cookie('admin_page_product', self.pageNumber())
        self.getProduct();
    }
    self.nextNumberProductLast = function () {
        self.pageNumber(self.pageTotals().length)
        $.cookie('admin_page_product', self.pageNumber())
        self.getProduct();
    }
    self.removeProduct = function (item) {
        $.ajax({
            method: "post",
            url: backendUrl + `/api/product/remove/${item.Id}`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            success: function (res) {
                if (res.status == true) {
                    self.getProduct();
                    self.showtoastState("Đã xóa")
                }
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }

    self.isZero = ko.observableArray();
    self.totalIsZero = ko.observable(0)
    self.pageZero = ko.observable(1)
    self.sizeZero = ko.observable(100)
    self.getPosValueIsZero = function () {
        self.posPage(1)
        self.mode("getzero")
        $('#kt_modal_pos').modal('show')
        self.getWarehouses()
    }

    self.removePublish = function () {
        var arr = []
        var uids = $('input[name="uids[]"]');
        uids.filter(":checked").map(function () {
            arr.push(this.value)
        }).get();
        var obj = {
            "ListPosCode": arr
        }
        $.ajax({
            method: "post",
            url: backendUrl + `/api/product/pos/update/ispublish`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify(obj),
            success: function (res) {
                if (res.status == true) {
                    self.getProduct();
                    self.showtoastState("Đã rút xuất bản")
                }
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.closeModalPOSRemove = function () {
        $('#kt_modal_iszero').modal('hide')
    }

    self.updatePrices = function () {
        var arrary = []
        $.each(self.product(), function (ex, item) {
            var product = {
                Id: item.Id,
                Price: item.retail_price
            }
            arrary.push(product)
        })
        $.ajax({
            method: "post",
            url: backendUrl + `/api/product/pos/update/price`,
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            contentType: "application/json",
            data: JSON.stringify({
                ListPosCode: arrary
            }),
            success: function (res) {
                if (res.status == true) {
                    self.getProduct();
                    self.showtoastState("Đã đồng bộ trang giá trang số " + self.pageNumber())
                }
            },
            error: function (err) {
                self.showtoastError(err)
            }
        });
    }
    self.removeSearch = function () {
        $.cookie('isSale',0)
        $.cookie('selected', 0)
        $.cookie('admin_page_product', 1)
        $.cookie('seacrh_product',"")
        location.reload();
       
    }
}
$(function () {
    var viewModal = new ViewModal();
   
    viewModal.checkToken();
    viewModal.searchProduct();
    ko.applyBindings(viewModal);
});