var myCenter, //地图开始显示坐标
    mapProp, //地图的相关信息
    map, //创建当前地图
    marker, //添加当前位置的图标
    infowindow; //显示对应坐标详细信息
var markerArr = [];//标记数组
$(function () {
    fullScreen();//全屏模式
    $("#seaBtn").on("click", function() {
        var comboboxlist = $('#comboboxlist').combobox('getValue');
        var text = $('#text').textbox('getValue');
        if (comboboxlist != "无") {
            searchByTrainState(comboboxlist);
        } else if (comboboxlist == "无" && text !== "") {
            searchByTrainCode(text);
        } else if (comboboxlist == "无" && text === "") {
            $.messager.alert('错误', "搜索内容不能为空！");
        }
    });
    //获取机车数据
    agent.askToServer("TrainWorkingOperation", "GetAllTrainInf", null, function(r) {
        if (r.EAF_ERROR) {
            $.messager.alert('提示', r.EAF_ERROR, null, null);
            return;
        }
        if(r.rows.length>0){
            createMap(r.rows);//创建地图
        }
    });

    //定时操作
    clearInterval(timer);//清除定时器的操作
    var timer=setInterval( function() {
        //重新获取所有机车信息
        agent.askToServer("TrainWorkingOperation", "GetAllTrainInf", null, function(r) {
            if (r.EAF_ERROR) {
                $.messager.alert('提示', r.EAF_ERROR, null, null);
                return;
            }
            if(r.rows.length>0){
                //clearMarker(markerArr);//清空地图上的标记
                //markerArr.length = 0;//清空标记数组
                //addMarker(r.rows);//向标记数据增加新的标记
                //render(r.rows);//datagrid
                render(data);
            }
        });
    },5000);
});

//绘制地图
function createMap(trainDatas) {
    //地图开始显示坐标
    myCenter = new google.maps.LatLng(trainDatas[0].BOM_POINT_X, trainDatas[0].BOM_POINT_Y);
    //地图的相关信息
    mapProp = {
        center: myCenter,
        zoom: 0,
        minZoom: 3,
        maxZoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //创建当前地图
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    addMarker(trainDatas);//添加标记
    render(trainDatas);//加载datagrid
    mapEvent(trainDatas, markerArr);//绑定地图事件
}
//渲染页面，以及页面的一些相关事件
function render(data) {
    var lastClickRow = {};
    $('#tab').datagrid({
        data: data,
        singleSelect: true,
        fit: true,
        columns: [
            [{field: 'BOM_TRAIN_CODE', title: '机车代码', width: 120, align: 'center'},
                {field: 'BOM_STATE', title: '机车状态', width: 220, align: 'center'},
                {field: 'BOM_TRAIN_MODEL', title: '机车型号', width: 220, align: 'center'},
                {field: 'BOM_POINT_X', title: '经度', width: 120},
                {field: 'BOM_POINT_Y', title: '纬度', width: 120},
                {field: 'BOM_MANUFACTURER', title: '生产厂商', width: 320},
                {field: 'BOM_TRAIN_KM', title: '今日公里数', width: 320, align: 'center'},
                {field: 'EAF_CREATETIME_STR', title: '现在时间', width: 220, align: 'center'}]
        ],
        //tab单击事件：单机某一行，显示相关信息
        onClickRow: function (index, row) {
            marker.setMap(null);
            var Thislat = row.BOM_POINT_X;
            var Thislng = row.BOM_POINT_Y;
            //设置当前的经纬度获取到的地点为地图的中心点
            map.setCenter(new google.maps.LatLng(Thislat, Thislng));
            marker =new MarkerWithLabel({
                position: new google.maps.LatLng(Thislat, Thislng),
                icon:"/TiBom/MapDisplay/img/train_blue.png",
                map: map
            });
            marker.setMap(map);
        },
        //tab表格双击事件：双击某一行，显示相关信息的具体信息
        onDblClickRow: function (index, row) {
            marker.setMap(null);
            var Thislat = row.BOM_POINT_X;
            var Thislng = row.BOM_POINT_Y;
            var arr = '机车代码:' + row.BOM_TRAIN_CODE + '<br/>' +
                '机车状态:' + row.BOM_STATE + '<br/>' +
                '机车型号:' + row.BOM_TRAIN_MODEL + '<br/>' +
                '经度 :' + row.BOM_POINT_X + '<br/>' +
                '纬度:' + row.BOM_POINT_Y + '<br/>' +
                '生产厂商:' + row.BOM_MANUFACTURER + '<br/>' +
                '今日公里数:' + row.BOM_TRAIN_KM + '<br/>' +
                '现在时间:' + row.EAF_CREATETIME_STR;
            $(".info").html(arr).show();
            //3分钟后提示信息消失
            setTimeout(function () {
                $(".info").hide();
            }, 180000);

            //设置当前的经纬度获取到的地点为地图的中心点
            map.setCenter(new google.maps.LatLng(Thislat, Thislng));
            marker =new MarkerWithLabel({
                position: new google.maps.LatLng(Thislat, Thislng),
                icon:"/TiBom/MapDisplay/img/train_blue.png",
                map: map
            });
            marker.setMap(map);
        }
    });
}
//全部变回划过图标的原样子
function allReset(markers) {
    for (var j = 0; j < markers.length; j++) {
        markers[j].icon = "/TiBom/MapDisplay/img/train.png";
        markers[j].setMap(map);
    }
}
//清除地图上所有标记     add by shy 20160912
function clearMarker(markers){
    for (var j = 0; j < markers.length; j++) {
        markers[j].setMap(null);
    }
}
//向标记数组里添加marker  add by shy 20160912
function addMarker(trainDatas){
    for (var i = 0; i < trainDatas.length; i++) {
        if(trainDatas[i].BOM_STATE=="在线"){
            marker = new MarkerWithLabel({
                position: new google.maps.LatLng(trainDatas[i].BOM_POINT_X, trainDatas[i].BOM_POINT_Y),
                draggable: false,
                icon:"/TiBom/MapDisplay/img/train.png",
                map: map,
                labelContent: trainDatas[i].BOM_TRAIN_MODEL,
                labelAnchor: new google.maps.Point(35, 0),
                labelClass: "labels", // the CSS class for the label
                labelStyle: {opacity: 0.9} //文本内容透明度
            });
        }else if(trainDatas[i].BOM_STATE=="离线"){
            marker = new MarkerWithLabel({
                position: new google.maps.LatLng(trainDatas[i].BOM_POINT_X, trainDatas[i].BOM_POINT_Y),
                draggable: false,
                icon:"/TiBom/MapDisplay/img/train.png",
                map: map,
                labelContent: trainDatas[i].BOM_TRAIN_MODEL,
                labelAnchor: new google.maps.Point(35, 0),
                labelClass: "labels_on", // the CSS class for the label
                labelStyle: {opacity: 0.8} //文本内容透明度
            });
        }
        markerArr.push(marker);
    }
}
//地图的点击事件
function mapEvent(tData, markers) {
    allReset(markers);
    for (var i = 0; i < tData.length; i++) {
        (function (i) {
            //为地图上的图标添加点击事件
            google.maps.event.addListener(markers[i], 'click', function (e) {
                $('#tab').datagrid("selectRow", i);
                allReset(markers);
                for(var key in tData[i]){
                    if(tData[i][key]=="BOM_TRAIN_CODE"){}
                    console.log(key);
                    console.log(tData[i][key]==="");


                    var str = '<div id="box">' +
                        '<fieldset>' +
                        '<legend>基本信息</legend>' +
                        '<ul id="list" class="list">' +
                        '<li>机车：' + tData[i].BOM_STATE + '</li>' +
                        '<li>配属：沈局辽段</li>' +
                        '<li>联系方式：13209873456</li>' +
                        '<li>司机工号：1814703</li>' +
                        '<li>司机姓名：潘革</li>' +
                        '<li>值乘辽段：沈局辽段</li>' +
                        '</ul>' +
                        '</fieldset>' +
                        '<fieldset>' +
                        '<legend>LKJ实时信息</legend>' +
                        '<ul id="list" class="list">' +
                        '<li>车次：' + tData[i].BOM_TRAIN_CODE + '</li>' +
                        '<li>速度:0km/h</li>' +
                        '<li>公里标：k403+709</li>' +
                        '<li>容货/本补:货/本</li>' +
                        '<li>计长：140.2</li>' +
                        '<li>总重：2594t</li>' +
                        '<li>路线:通霍线</li>' +
                        '<li>车站：霍林河(621)</li>' +
                        '<li>辆数：112</li>' +
                        '</ul>' +
                        '</fieldset>' +
                        '<fieldset>' +
                        '<legend>卫星定位信息</legend>' +
                        '<ul id="list" class="list">' +
                        '<li>经度：' + tData[i].BOM_POINT_X + '</li>' +
                        '<li>纬度：' + tData[i].BOM_POINT_Y + '</li>' +
                        '<li>海拔：889m</li>' +
                        '<li>线路：通霍</li>' +
                        '<li>车站：霍林河</li>' +
                        '<li>速度:0km/h</li>' +
                        '</ul>' +
                        '</fieldset>' +
                        '<fieldset>' +
                        '<legend>普通状态</legend>' +
                        '<ul id="list" class="list">' +
                        '<li><input type="radio" checked name="state"/> 3G</li>' +
                        '<li><input type="radio"/ name="state"> GMS-R</li>' +
                        '<li><input type="radio"/ name="state"> 北斗</li>' +
                        '</ul>' +
                        '</fieldset>' +
                        '<a href="javasprit:;">更多信息</a>' +
                        '<time style="float: right; padding-right: 20px;">数据下发时间：2016-09-07  21:00:00</time>' +
                        '</div>';
                }
                infowindow = new google.maps.InfoWindow({
                    content: str
                });
                infowindow.open(map, this);
                this.icon = "/TiBom/MapDisplay/img/train_blue.png";
                this.setMap(map);
            });
            //鼠标离开，关闭相关信息
            google.maps.event.addListener(markers[i], 'mouseout', function (e) {
                $('#tab').datagrid("unselectRow", i);
                infowindow.close(map, this);
                this.icon = "/TiBom/MapDisplay/img/train.png";
                this.setMap(map);
            });
        })(i);
    }
}
