/**
 * btn按钮事件
 * liuyuru
 */
(function (mybtn, $) {
    //起止日期
    mybtn.date=function (date_start,date_end,types) {
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            var start;
            if(date_end){
                if(types){
                    //日期范围
                    start = laydate.render({
                        elem: date_start,
                        theme: 'blue',
                        type: types,
                        // format: 'yyyyMMddtHHmmssz',
                        // max: 0 ,
                        done: function(value, date) {
                            end.config.min = {
                                year: date.year,
                                month: date.month - 1, //关键
                                date: date.date
                            }
                        }
                    });
                    var end = laydate.render({
                        elem: date_end,
                        theme: 'blue',
                        type: types,
                        // max: 0 ,
                        done: function(value, date) {
                            if (value === '' || value === null) {
                                var nowDate = new Date();
                                start.config.max = {
                                    year: nowDate.getFullYear(),
                                    month: nowDate.getMonth(),
                                    date: nowDate.getDate(),
                                    hours:nowDate.getHours(),
                                    minutes:nowDate.getMinutes(),
                                    seconds:nowDate.getSeconds()
                                };
                                return
                            }
                            start.config.max = {
                                year: date.year,
                                month: date.month - 1, //关键
                                date: date.date
                            }
                        }
                    });
                }else{
                    //日期范围
                    start = laydate.render({
                        elem: date_start,
                        theme: 'blue',
                        max: 0 ,
                        done: function(value, date) {
                            end.config.min = {
                                year: date.year,
                                month: date.month - 1, //关键
                                date: date.date
                            }
                        }
                    });
                    var end = laydate.render({
                        elem: date_end,
                        theme: 'blue',
                        max: 0 ,
                        done: function(value, date) {
                            if (value === '' || value === null) {
                                var nowDate = new Date();
                                start.config.max = {
                                    year: nowDate.getFullYear(),
                                    month: nowDate.getMonth(),
                                    date: nowDate.getDate()
                                };
                                return
                            }
                            start.config.max = {
                                year: date.year,
                                month: date.month - 1, //关键
                                date: date.date
                            }
                        }
                    });
                }
            }else{
                start = laydate.render({
                    elem: date_start,
                    theme: 'blue'
                });
            }
        });
    }

    mybtn.secret=function () {
        app.get('authmodule/sysTbDictCode/selectSysTbDictCodeByfkType', {"type": "ofthem"}, function (res) {
            if(res.state){
                var data = res.rows, origin = $('select[name="archiveLevel"]'), opt;
                for (var key in data) {
                    opt = '<option value="' + data[key].id + '">' + data[key].svalue + '</option>';
                    origin.append(opt);
                }
                layui.form.render('select');
            }
        });
    }
})((window.mybtn = {}), $);
