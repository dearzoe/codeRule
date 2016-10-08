/**
 * Created by huwenzhe on 2016/9/20.
 */
//类元模型ID
var clsId=eaf.getUrlParam('clsid');
//表单界面id
var uiId = eaf.getUrlParam('uiid');
//属性ID
var codeRule= eaf.getUrlParam('coderule');
//获取编码规则表格的ID
var dataId = eaf.getUrlParam('dataid');
//获取属性列表
var attrs = eaf.ajaxGet(eaf.getObjsToFrameUrl('DataModel', 'GetAttrsByClassId') + '&clsid=' + clsId + '&uiid=' + uiId);
//类型为引用属性时的下拉框数据
var productsAttr;
//获取表格数据
var dataDgData = [];
//构造新的表格数据
var dataDgDataNew = {};
//form表单主数据；
dataDgDataNew["MAIN"] = {};
//form表单表格数据
dataDgDataNew["SECTIONS"] = [];
//form表单流水数据
dataDgDataNew["SNS"] = [];
//总数据列表
// 当KEY为"MAIN"时值为一个对象，此对象中是KEY为"EAF_NAME"（规则名称），"EAF_ISMAIN"（是否为主编码），"EAF_WAY"（生成方式），"EAF_WHENPUBLISH"（是否在发布时生成），"EAF_SAMPLE"（编码样例）。
//当KEY为"SECTIONS"时值为一个数组，此数组中的每一项为一个对象，每个对象为表格中每一行的数据，其中的KEY为"EAF_NAME"（名称），"EAF_TYPE"（类型），"EAF_ORDER"（排序）。"EAF_CONTENT"（内容）(*接下*)
//（*接上*）"EAF_CONTENT"（内容）其中有三种值，当"EAF_TYPE"为0时候，"EAF_CONTENT"为string,当"EAF_TYPE"为1时候，"EAF_CONTENT"为parentData["SNS"].EAF_ID（流水表格ID）,当"EAF_TYPE"为2时候，"EAF_CONTENT"为类ID（引用属性ID）
//当KEY为"SNS"时值为一个数组，此数组中的每一项为一个对象，每个对象为当表格为流水的时候流水表格的数据，其中的KEY"EAF_ID"与parentData["SECTIONS"]["EAF_CONTENT"]的值相等，其中KEY为"EAF_INIT"（初始值），"EAF_LENGTH"（长度），"EAF_STEP"（步长），"EAF_LAST"（最后流水）
var parentData;
$(function(){
    //流水保存
    var flag = true;
    if(!dataId){
        dataId = eaf.guid();
    }

//获取父级页面数据
var pData=eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).codeUpdataObject;
if(pData.length !== 0){
    for(var j=0;j<pData.length;j++){
        //父级页面的每组数据
        var curPData=pData[j];
        if(curPData["MAIN"]["EAF_ID"] == dataId){
            parentData = curPData;
        }
    }
}
//获取数据库中的数据
if(!parentData){
    //获取总数据列表 为一个对象，
    parentData = eaf.readData('DataModel', 'GetEncodingRule',{ruleId:dataId}).result;
}
//类型的下拉框数据
var products = [
    {productid: '0', name: eaf.getLabel('eaf_rule_fixString')},
    {productid: '1', name: eaf.getLabel('eaf_rule_water')},
    {productid: '2', name: eaf.getLabel('eaf_rule_reference')}
];
//表格样式
var dataGridColumn = [[
    {field: 'EAF_NAME', title: eaf.getLabel('eaf_rule_datagridName'), width: 136, align: 'center', editor: 'text'},
    {field: 'EAF_TYPE', title: eaf.getLabel('eaf_rule_datagridType'), width: 143, align: 'center', formatter: function(value){
        for (var i = 0; i < products.length; i++) {
            if (products[i].productid == value) return products[i].name;
        }
        return value;
    }, editor: {
        type: 'combobox',
        options: {
            valueField: 'productid',
            textField: 'name',
            data: products,
            onChange: onChangeHandeler,
            panelHeight: 62
        }
    }
    },
    {field: 'EAF_ORDER', title: eaf.getLabel('eaf_rule_datagridSort'), width: 143, align: 'center', editor: {
        type: 'numberbox'
    }
    },
    {field: 'EAF_CONTENT', title: eaf.getLabel('eaf_rule_datagridContent'), width: 143, align: 'center', formatter: function(value, row, index){
        productsAttr=[];
        //获取引用属性的下拉框数据
        getProductsAttr(attrs);
        //判断“动态下拉框”为引用属性的时候，把value替换成 productsAttr中对应的值；
        if (row.EAF_TYPE == 2) {
            for (var i = 0; i < productsAttr.length; i++) {
                if (productsAttr[i].id == value) return productsAttr[i].text;
            }
        }
        return value;
    }, editor: {
        type: 'text'
    }
    }
]];
    //获取eaf_bornStyle_form下拉框
    $("#eaf_bornStyle_form").combobox({
        panelHeight:42,
        valueField:'label',
        textField: 'value',
        data: [{
            label: '0',
            value: eaf.getLabel('eaf_rule_auto'),
            selected:true
        },{
            label: '1',
            value: eaf.getLabel('eaf_rule_manual')
        }]
    });
    //获取表格数据
    getDgData(parentData);
    //最后点击的索引
    var lastIndex;
    //创建默认排序
    var orderNumber;
    if(parentData && parentData["SECTIONS"].length !== 0){
        //获取数据库中编码段的个数
        var length=parentData["SECTIONS"].length;
        orderNumber = parentData["SECTIONS"][length-1]["EAF_ORDER"]+1;
    }else{
        orderNumber = 1;
    }
    $('#eaf_rule_grid').datagrid({
        onBeforeEdit: onBeforeEditHandeler,
        striped: true,
        toolbar: [{
            text: eaf.getLabel('eaf_rule_datagridAdd'),
            iconCls: 'icon-add',
            handler: function (e) {
                //重置流水
                flag = true;
                $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                $('#eaf_rule_grid').datagrid('appendRow', {
                    EAF_NAME: '',
                    EAF_TYPE: '0',
                    EAF_ORDER: orderNumber,
                    EAF_CONTENT: ''
                });
                lastIndex = $('#eaf_rule_grid').datagrid('getRows').length - 1;
                $('#eaf_rule_grid').datagrid('selectRow', lastIndex);
                $('#eaf_rule_grid').datagrid('beginEdit', lastIndex);
                orderNumber++;
            }
        }, '-', {
            text: eaf.getLabel('eaf_rule_datagridRemove'),
            iconCls: 'icon-remove',
            handler: function () {
                upDataCode();
                //获取所选行的数据
                var row = $('#eaf_rule_grid').datagrid('getSelected');
                if (row) {
                    //获取所选行的索引
                    var index = $('#eaf_rule_grid').datagrid('getRowIndex', row);
                    $('#eaf_rule_grid').datagrid('deleteRow', index);
                    //如果为流水删除对应的流水
                    for(var i=0;i<dataDgDataNew["SNS"].length;i++){
                        if(row["EAF_CONTENT"] == dataDgDataNew["SNS"][i]["EAF_ID"]){
                            dataDgDataNew["SNS"].splice(i,1)
                        }
                    }
                }
            }
        }],
        onBeforeLoad: function () {
            $(this).datagrid('rejectChanges');
        },
        onDblClickRow: function (rowIndex, row) {
                flag=true;
                $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                $('#eaf_rule_grid').datagrid('beginEdit', rowIndex);
            lastIndex = rowIndex;
        },
        onClickRow:function(rowIndex, row){
            $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
        },
        //表格样式
        columns: dataGridColumn,
        //表格数据
        data: dataDgData
    });
    $.parser.parse();
    $("#rule_water_grid").dialog({
        title: eaf.getLabel('eaf_rule_water'),
        width: 300,
        height: 200,
        buttons: [
            {
                text: eaf.getLabel('eaf_rule_datagridReset'),
                plain: true,
                iconCls: "icon-reload",
                handler: function () {
                    $("#water_grid_last").val("");
                    //获取行的数据
                    var rows = $('#eaf_rule_grid').datagrid("getRows");
                    eaf.readData('DataModel', 'ResetSn',{id:rows[0]["EAF_CONTENT"]}).result;
                }
            },
            {
                text: eaf.getLabel('eaf_rule_datagridOk'),
                plain: true,
                iconCls: "icon-ok",
                handler: function () {
                    //保存流水数据
                    var snsObj = {};
                    //获取所选行的数据
                    var selRow = $('#eaf_rule_grid').datagrid('getSelected');
                    //获取所选行的索引
                    var index = $('#eaf_rule_grid').datagrid('getRowIndex', selRow);
                    //获取行的数据
                    var rows = $('#eaf_rule_grid').datagrid("getRows");
                    //获取所选行的ID
                    var selRowId = selRow.EAF_CONTENT;
                    if(flag){
                        if(parentData && parentData["SNS"]){
                            dataDgDataNew["SNS"]=parentData["SNS"]
                        }
                        //无值的话赋值一个新值
                        if(!selRow.EAF_CONTENT) {
                            rows[index]["EAF_CONTENT"] = eaf.guid();
                            snsObj.EAF_ID = rows[index]["EAF_CONTENT"];
                        }else{
                            snsObj.EAF_ID = selRow.EAF_CONTENT;
                        }
                        snsObj.EAF_INIT = $("#water_grid_init").val();
                        snsObj.EAF_LENGTH = $("#water_grid_length").val();
                        snsObj.EAF_STEP = $("#water_grid_step").val();
                        //snsObj.EAF_LAST = $("#water_grid_last").val();
                        if(selRow.EAF_CONTENT){
                            for(var j=0;j<dataDgDataNew["SNS"].length;j++){
                                if(dataDgDataNew["SNS"][j].EAF_ID==snsObj.EAF_ID){
                                    dataDgDataNew["SNS"][j]=snsObj;
                                    snsObj = {};
                                    flag = false;
                                    $("#rule_water_grid").dialog('close');
                                    return;
                                }
                            }
                        }
                        dataDgDataNew["SNS"].push(snsObj);
                        snsObj = {};
                        flag = false;
                    }

                    $('#eaf_rule_grid').datagrid('updateRow',{
                        index: index,
                        row: {
                            EAF_CONTENT : rows[index]["EAF_CONTENT"],
                            EAF_NAME : rows[index]["EAF_NAME"],
                            EAF_ORDER : rows[index]["EAF_ORDER"],
                            EAF_TYPE : rows[index]["EAF_TYPE"]
                        }
                    });
                    $("#rule_water_grid").dialog('close');
                }
            }]
    });
    $("#btn").linkbutton({
          text:eaf.getLabel('eaf_rule_production')
    });
});
/**
 * 获取表格数据
 * @param parentData  传入的主数据
 * @returns {Array}   表格数据
 */
function getDgData(parentData) {
    //创建一个新的临时对象
    var obj = {};
    //从数据库或者父级页面中获取
    if(parentData) {
        if(parentData["MAIN"]["EAF_ISMAIN"] == 1){
            $("#eaf_mainCode_form").prop("checked",true);
        }
        if(parentData["MAIN"]["EAF_WHENPUBLISH"] == 1){
            $("#eaf_bornPublish_form").prop("checked",true);
        }
        if(parentData["MAIN"]["EAF_WAY"]){
            $("#eaf_bornStyle_form").combobox("setValue",parentData["MAIN"]["EAF_WAY"]);
        }
        if(parentData["MAIN"]["EAF_NAME"]){
            $("#eaf_ruleName_form").val(parentData["MAIN"]["EAF_NAME"]);
        }
        for (var i = 0; i < parentData["SECTIONS"].length; i++) {
            for (var key in parentData["SECTIONS"][i]) {
                obj[key] = parentData["SECTIONS"][i][key];
            }
            dataDgData.push(obj);
            obj = {};
        }
        return dataDgData;
    }
}
/**
 * “动态下拉框”改变的时候触发
 * @param newValue   改变后动态下拉框的数据ID
 * @param oldValue   改变前动态下拉框的数据ID
 */
function onChangeHandeler(newValue, oldValue) {
    //初次点击时候，oldValue为空，直接返回
    if (oldValue === '') {
        return;
    }
    //获取“动态下拉框”改变前的行数据
    var selRow = $('#eaf_rule_grid').datagrid('getSelected');
    //获取所选行的索引
    var selRowIndex = $('#eaf_rule_grid').datagrid('getRowIndex', selRow);
    $('#eaf_rule_grid').datagrid('endEdit', selRowIndex);
    //非初次点击，直接清空动态编辑器框中的值
    selRow.EAF_CONTENT = '';
    $('#eaf_rule_grid').datagrid('beginEdit', selRowIndex);
}
//打开流水窗口并且加载数据
function openDialogHandeler() {
    $('#rule_water_grid').dialog('open');
    //获取所选行的数据
    var selRow = $('#eaf_rule_grid').datagrid('getSelected');
    //获取所选行的ID
    var selRowId = selRow.EAF_CONTENT;
    //从数据库或者父级页面中获取
    if(parentData){
        for (var i = 0; i < parentData["SNS"].length; i++) {
            //获取流水列表的ID
            var curId = parentData["SNS"][i].EAF_ID;
            //如果数据中的流水ID等等于所选行的EAF_CONTENT（流水ID）更新流水数据
            if (curId == selRowId) {
                $("#water_grid_init").val(parentData["SNS"][i]["EAF_INIT"]);
                $("#water_grid_length").val(parentData["SNS"][i]["EAF_LENGTH"]);
                $("#water_grid_step").val(parentData["SNS"][i]["EAF_STEP"]);
                $("#water_grid_last").val(parentData["SNS"][i]["EAF_LAST"]);
            }
        }
    }
    //获取当前页面缓存
    if(dataDgDataNew["SNS"]){
        for(var e=0;e<dataDgDataNew["SNS"].length;e++){
            if(dataDgDataNew["SNS"][e]["EAF_ID"] == selRowId){
                $("#water_grid_init").val(dataDgDataNew["SNS"][e]["EAF_INIT"]);
                $("#water_grid_length").val(dataDgDataNew["SNS"][e]["EAF_LENGTH"]);
                $("#water_grid_step").val(dataDgDataNew["SNS"][e]["EAF_STEP"]);
            }
        }
    }
}
/**
 * 获取类型为引用属性时的下拉数据
 * @param attrs  属性列表
 * @returns {Array} 返回值分两层，第一层为索引所对应的是对象，每个对象中有两个KEY分别为id和text
 */
function getProductsAttr(attrs) {
    //创建一个临时对象储存每个下拉属性
    var curProductsAttr = {};
    for (var i = 0; i < attrs["rows"].length; i++) {
        if (attrs["rows"][i].EAF_ISCODE == "Y" && attrs["rows"][i].EAF_ID !== codeRule) {
            curProductsAttr.id = attrs["rows"][i].EAF_ID;
            curProductsAttr.text = attrs["rows"][i].EAF_NAME;
            productsAttr.push(curProductsAttr);
            curProductsAttr = {};
        }
    }
    return productsAttr;
}
//关闭流水窗口的时候清空数据
function closeDialogHandeler() {
    $('#rule_water_grid').dialog({
        onClose: function () {
            $("#water_grid_init").val("");
            $("#water_grid_length").val("");
            $("#water_grid_step").val("");
        }
    });
}
closeDialogHandeler();
/**
 * 在编辑之前编译
 * @param rowIndex 所选行的索引
 * @param rowData  所选行的数据
 */
function onBeforeEditHandeler(rowIndex, rowData) {
    //返回所选行的“EAF_CONTENT”的属性
    var col = $(this).datagrid('getColumnOption', 'EAF_CONTENT');
    //返回所选行的“EAF_TYPE”类型
    var type = $('#eaf_rule_grid').datagrid('getSelected').EAF_TYPE;
    if (type == '0') {
        col.editor.type = 'text';
    }
    else if (type == '1') {
        col.editor.type = 'textbox';
        col.editor.options = {
            icons: [{
                iconCls: 'icon-edit',
                handler: openDialogHandeler
            }],
            iconWidth: 138
        };
    }
    else if (type == '2') {
        col.editor.type = 'combobox';
        col.editor.options = {
            valueField: 'id',
            textField: 'text',
            data: productsAttr,
            panelHeight: 0
        };
    }
}
/**
 * 更新整理最新的编码字符串
 * @returns {{}} 返回为JSON字符串
 */
function upDataCode(){
    if($.type(dataDgDataNew) == "string"){
        return dataDgDataNew;
    }else if(!dataDgDataNew["MAIN"]["EAF_ID"]){
        //生成EAF_ID
        dataDgDataNew["MAIN"]["EAF_ID"]=dataId;
    }
    //创建临时ID，用于赋值给SECTIONS下的EAF_MID
    var interimId=dataDgDataNew["MAIN"]["EAF_ID"];
    //赋值属性ID
    dataDgDataNew["MAIN"]["EAF_ATTRID"] = codeRule;
    //获取列表中的“规则名称”
    dataDgDataNew["MAIN"]["EAF_NAME"] = $("#eaf_ruleName_form").val();
    //获取列表中的“生成方式”
    dataDgDataNew["MAIN"]["EAF_WAY"] = $("#eaf_bornStyle_form").combobox("getValue");
    //设置一个空的编码样例
    dataDgDataNew["MAIN"]["EAF_SAMPLE"] = "";
    //判断并获取列表中的“是否为主编码”
    if ($("#eaf_mainCode_form").is(':checked')) {
        dataDgDataNew["MAIN"]["EAF_ISMAIN"] = 1;
    } else {
        dataDgDataNew["MAIN"]["EAF_ISMAIN"] = 0;
    }
    //判断并获取列表中的“是否在发布时生成”
    if ($("#eaf_bornPublish_form").is(':checked')) {
        dataDgDataNew["MAIN"]["EAF_WHENPUBLISH"] = 1;
    } else {
        dataDgDataNew["MAIN"]["EAF_WHENPUBLISH"] = 0;
    }
    //获取所选行的数据
    var selRow = $('#eaf_rule_grid').datagrid('getSelected');
    //获取所选行的索引
    var selRowIndex = $('#eaf_rule_grid').datagrid('getRowIndex', selRow);
    $('#eaf_rule_grid').datagrid('endEdit', selRowIndex);
    dataDgDataNew["SECTIONS"] = $('#eaf_rule_grid').datagrid("getData").rows;
    for(var i=0;i<dataDgDataNew["SECTIONS"].length;i++){
        dataDgDataNew["SECTIONS"][i]["EAF_MID"] = interimId;
        dataDgDataNew["SECTIONS"][i]["EAF_ID"]=eaf.guid();
    };
    if(dataDgDataNew["SNS"].length == 0){
        //从数据库或者父级页面中获取
        var pData=eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).codeUpdataObject;
        if(parentData && parentData["SNS"]){
            dataDgDataNew["SNS"]=parentData["SNS"]
        }
    }
    return dataDgDataNew;
}
//生成编码样例
function codeSample(){
    //获取最新的编码字符串
    upDataCode();
    var codeingSample = eaf.readData('DataModel', 'GenerateSampleCode',{encodingRule:JSON.stringify(dataDgDataNew)}).result;
    $("#eaf_example_form").val(codeingSample)
}
//点击确定保存数据
function getResult() {
    //创建选择权限
    var flg=true;
    //获取最新的编码字符串
    upDataCode();
    //获得父级页面数据
    var pData=eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).codeUpdataObject;
    //如果父页面又的话就是替换
    for(var i in pData){
        if(pData[i]["MAIN"]["EAF_ID"] == dataDgDataNew["MAIN"]["EAF_ID"]){
            pData[i]=dataDgDataNew;
            flg=false;
        }
    }
    //如果父页面没有dataDgDataNew就添加
    if(flg){
        pData.push(dataDgDataNew);
    }
    eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).encodingName[dataDgDataNew["MAIN"]["EAF_ID"]]=dataDgDataNew["MAIN"]["EAF_NAME"]
    dataDgDataNew={};
    return dataId;
}

