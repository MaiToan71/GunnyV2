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
    self.convertToJSObject = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return ko.mapping.toJS(item);
        }
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
    self.dataProduct = ko.observable();
    self.totalOrderPrice = ko.observable();
    self.getProduct = function () {
        var obj = {
            start: moment().subtract(7, 'd').format('YYYY_MM_DD'),
            end: moment().format('YYYY_MM_DD'),
            search: $('#seacrh-pos').val()
        }
        $.ajax({
            method: "post",
            url: backendUrl + `/api/order/search/orderDetail/time`,
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.totalOrder(data.count)
               var totalPrice =0
                $.each(data.data, function (ex, item) {
                    totalPrice += item.total
                })
                self.totalOrderPrice(totalPrice)
                self.dataProduct(data.data)
                self.changeVnd()
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
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
    self.dataTotal = ko.observable();
    self.getToday = function () {
        var obj = {
            start: moment().format('YYYY_MM_DD'),
            end: moment().format('YYYY_MM_DD'),
            search: $('#seacrh-pos').val()
        }
        $.ajax({
            method: "post",
            url: backendUrl + `/api/order/search/time`,
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.dataTotal(data)
                self.changeVnd()
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.time = ko.observable();
    self.getData = function () {
        var obj = {
            start: moment().subtract(7, 'd').format('YYYY_MM_DD'),
            end: moment().format('YYYY_MM_DD'),
            search: $('#seacrh-pos').val()
        }
        var objFormat = {
            start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
            end: moment().format('YYYY-MM-DD'),
            search: $('#seacrh-pos').val()
        }
        self.time({
            start: moment().subtract(7, 'd').format('DD-MM-YYYY'),
            end: moment().format('DD-MM-YYYY'),
            search: $('#seacrh-pos').val()
        })

        $.ajax({
            method: "post",
            url: backendUrl + `/api/order/search/time`,
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.getChart(data.data, objFormat)
                self.changeVnd()

                $("#kt_daterangepicker_5").daterangepicker();

                self.searchPosSelected();
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }
    self.totalOrder = ko.observable(0)
/*    self.getOrder = function (time) {
        var obj = { "posCode": "", "start": time.start, "end": time.end }
        $.ajax({
            method: "post",
            url: backendUrl + `/api/Order/search`,
            contentType: "application/json",
            data: JSON.stringify(obj),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.totalOrder(data.count)


            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }*/

    self.searchPosSelected = function () {
        $("#seacrh-pos").keydown(function (e) {
            if (e.keyCode == 13) {
                var objFormat = {
                    start: "",
                    end: "",
                    search: $('#seacrh-pos').val()
                }
                var time = {
                    start: "",
                    end: "",
                }

                if ($('.drp-selected').text().length == 0) {
                    objFormat.start = moment().format('YYYY_MM_DD');
                    objFormat.end = moment().format('YYYY_MM_DD')

                    time.start = moment().format('YYYY-MM-DD');
                    time.end = moment().format('YYYY-MM-DD');
                    self.time({
                        start: moment().format('DD-MM-YYYY'),
                        end: moment().format('DD-MM-YYYY'),
                        search: $('#seacrh-pos').val()
                    })
                }
                else {
                    objFormat.start = moment($('.drp-selected').text().split('-')[0]).format('YYYY_MM_DD');
                    objFormat.end = moment($('.drp-selected').text().split('-')[1]).format('YYYY_MM_DD');


                    time.start = moment($('.drp-selected').text().split('-')[0]).format('YYYY-MM-DD');
                    time.end = moment($('.drp-selected').text().split('-')[1]).format('YYYY-MM-DD');

                    self.time({
                        start: moment($('.drp-selected').text().split('-')[0]).format('DD-MM-YYYY'),
                        end: moment($('.drp-selected').text().split('-')[1]).format('DD-MM-YYYY'),
                        search: $('#seacrh-pos').val()
                    })
                }

                self.getDataSelect(objFormat, time);

            }
        });
        $('.applyBtn').on('click', function (event) {
            var objFormat = {
                start: "",
                end: "",
                search: $('#seacrh-pos').val()
            }
            var time = {
                start: "",
                end: "",
            }
            if ($('.drp-selected').text().length == 0) {
                objFormat.start = moment().format('YYYY_MM_DD');
                objFormat.end = moment().format('YYYY_MM_DD')

                time.start = moment().format('YYYY-MM-DD');
                time.end = moment().format('YYYY-MM-DD');
                self.time({
                    start: moment().format('DD-MM-YYYY'),
                    end: moment().format('DD-MM-YYYY'),
                    search: $('#seacrh-pos').val()
                })
            }
            else {
                objFormat.start = moment($('.drp-selected').text().split('-')[0]).format('YYYY_MM_DD');
                objFormat.end = moment($('.drp-selected').text().split('-')[1]).format('YYYY_MM_DD');


                time.start = moment($('.drp-selected').text().split('-')[0]).format('YYYY-MM-DD');
                time.end = moment($('.drp-selected').text().split('-')[1]).format('YYYY-MM-DD');

                self.time({
                    start: moment($('.drp-selected').text().split('-')[0]).format('DD-MM-YYYY'),
                    end: moment($('.drp-selected').text().split('-')[1]).format('DD-MM-YYYY'),
                    search: $('#seacrh-pos').val()
                })
            }

            self.getDataSelect(objFormat, time);

        })

        $("#selectedTime").change(function () {
            //  $('#kt_daterangepicker_5').val(`${moment(time.start).format('MM/DD/YYYY')} - ${moment(time.end).format('MM/DD/YYYY')}`)
            if ($("#selectedTime").val() == "time7") {
                var end = moment().format('MM/DD/YYYY')
                var start = moment().subtract(7, 'd').format('MM/DD/YYYY')
                $('#kt_daterangepicker_5').val(`${start} - ${end}`)
            }
            if ($("#selectedTime").val() == "time30") {
                var end = moment().format('MM/DD/YYYY')
                var start = moment().subtract(30, 'd').format('MM/DD/YYYY')
                $('#kt_daterangepicker_5').val(`${start} - ${end}`)
            }
            if ($("#selectedTime").val() == "time90") {
                var end = moment().format('MM/DD/YYYY')
                var start = moment().subtract(90, 'd').format('MM/DD/YYYY')
                $('#kt_daterangepicker_5').val(`${start} - ${end}`)
            }
            var objFormat = {
                start: "",
                end: "",
                search: $('#seacrh-pos').val()
            }
            var time = {
                start: "",
                end: "",
            }
            objFormat.start = moment(start).format('YYYY_MM_DD');
            objFormat.end = moment(end).format('YYYY_MM_DD');


            time.start = moment(start).format('YYYY-MM-DD');
            time.end = moment(end).format('YYYY-MM-DD');

            self.time({
                start: moment(start).format('DD-MM-YYYY'),
                end: moment(end).format('DD-MM-YYYY'),
                search: $('#seacrh-pos').val()
            })
            self.getDataSelect(objFormat, time);
        });
    }

    self.getDataSelect = function (objFormat, time ) {
        $.ajax({
            method: "post",
            url: backendUrl + `/api/order/search/time`,
            contentType: "application/json",
            data: JSON.stringify(objFormat),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.getChart(data.data, time)
                self.changeVnd()
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
        $.ajax({
            method: "post",
            url: backendUrl + `/api/order/search/orderDetail/time`,
            contentType: "application/json",
            data: JSON.stringify(objFormat),
            headers: { "Authorization": `Bearer ${$.cookie("admin_token")}` },
            success: function (data) {
                self.totalOrder(data.count)
                var totalPrice = 0
                $.each(data.data, function (ex, item) {
                    totalPrice += item.total
                })
                self.totalOrderPrice(totalPrice)
                self.dataProduct(data.data)
                self.changeVnd()
            },
            error: function (err) {
                self.showtoastError("Có lỗi hệ thống")
            }
        });
    }

    self.getChart = function (dataValues, time) {
        $('#kt_chartjs_2').replaceWith($('<canvas id="kt_chartjs_2"></canvas>'));
        var ctx = document.getElementById('kt_chartjs_2');
       

        // Define colors
        var primaryColor = KTUtil.getCssVariableValue('--bs-primary');
        var dangerColor = KTUtil.getCssVariableValue('--bs-danger');

        // Define fonts
        var fontFamily = KTUtil.getCssVariableValue('--bs-font-sans-serif');

        // Chart labels

        var getDaysArray = function (start, end) {
            for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt).getDate());
            }
            return arr;
        };

       
        var dataMoney = []
        $('#kt_daterangepicker_5').val(`${moment(time.start).format('MM/DD/YYYY')} - ${moment(time.end).format('MM/DD/YYYY')}`)
        // Chart labels
        const labels = getDaysArray(time.start, time.end)
        console.log(labels)
        $.each(labels, function (ex, label) {
            var total = 0;
            $.each(dataValues, function (ex, dataValue) {
                if (label == dataValue.date) {
                    total = dataValue.total
                }
            })
            dataMoney.push(total)
        })
        console.log(dataMoney)
        // Chart data
        const data = {
            labels: labels,
            datasets: [{
                label: 'Doanh thu theo ngày',
                data: dataMoney,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
        // Chart config
        const config = {
            type: 'line',
            data: data,
            options: {
                plugins: {
                    title: {
                        display: false,
                    }
                },
                responsive: true,
            },
            defaults: {
                global: {
                    defaultFont: fontFamily
                }
            }
        };

        // Init ChartJS -- for more info, please visit: https://www.chartjs.org/docs/latest/
        var myChart = new Chart(ctx, config);
        myChart.destroy();
        myChart = new Chart(ctx, config);
    }
}
$(function () {
    var viewModal = new ViewModal();
    viewModal.getToday();
    viewModal.getData();
   
    viewModal.getProduct();
    ko.applyBindings(viewModal);
});