/**
 * Created by U10K on 2016/9/20.
 */

//真实数据
var parentData={
    "MAIN": {
        "EAF_ID": "38D2D1829CEB35B1827D36C6186A157A",
        "EAF_WHENPUBLISH": "1",
        "EAF_WAY": "0",
        "EAF_SAMPLE": "",
        "EAF_ATTRID": "DC82E7BFA34449DDFAF02AB8B56D286D",
        "EAF_NAME": "测试规则1",
        "EAF_ISMAIN": "1"
    },
    "SECTIONS": [
        {
            "EAF_ID": "038ED95751D23E96FA3756356B36AD0F",
            "EAF_NAME": "固定字符串编码",
            "EAF_TYPE": "0",
            "EAF_MID": "38D2D1829CEB35B1827D36C6186A157A",
            "EAF_ORDER": 1,
            "EAF_CONTENT": "LMZ_"
        },
        {
            "EAF_ID": "E40161BC5F5AEF925C8E34ECE1AA6483",
            "EAF_NAME": "流水编码段1",
            "EAF_TYPE": "1",
            "EAF_MID": "38D2D1829CEB35B1827D36C6186A157A",
            "EAF_ORDER": 2,
            "EAF_CONTENT": "A87529E7375DC2ADA118B4F82BCEF965"
        },
        {
            "EAF_ID": "3C1938ABE7B233654F95B51219FC40E8",
            "EAF_NAME": "分隔符",
            "EAF_TYPE": "0",
            "EAF_MID": "38D2D1829CEB35B1827D36C6186A157A",
            "EAF_ORDER": 3,
            "EAF_CONTENT": "_"
        },
        {
            "EAF_ID": "BA657F08875DA9687B7C57A9A3059A96",
            "EAF_NAME": "引用属性",
            "EAF_TYPE": "2",
            "EAF_MID": "38D2D1829CEB35B1827D36C6186A157A",
            "EAF_ORDER": 4,
            "EAF_CONTENT": "A9C922B5FBD91067BDF56FD469E7DFB9"
        }
    ],
    "SNS": [
        {
            "EAF_ID": "A87529E7375DC2ADA118B4F82BCEF965",
            "EAF_STEP": 2,
            "EAF_INIT": 1,
            "EAF_LENGTH": 5,
            "EAF_LAST": 100,
        }
    ]
}

/*****************************************/
//获取类ID
clsid = eaf.getUrlParam('clsid');
//获取属性列表
var attrs = ctl.getAttrExByCls(clsid);
console.log(attrs);
var productsAttr=[];
var curProductsAttr={};
for(var i=0; i<attrs.length;i++){
    if(attrs[i].EAF_ISCODE == "Y"){
        curProductsAttr.
    }
}





/*****************************************/
//构造新的表格数据
var dataDgDataNew = [];
//这里构造form表单上半段的数据；
dataDgDataNew["MAIN"]={};
dataDgDataNew["SECTIONS"]=[];
dataDgDataNew["SNS"]=[];

//删除数据
var dataDgDelete=[];

/*****************************************/
//类型的下拉框数据
var products = [
    {productid: '0', name: '固定字符串'},
    {productid: '1', name: '流水'},
    {productid: '2', name: '引用属性'}
];
//类型为引用属性时的下拉框数据
var productsAttr = [
    {id: '0', text: 'EAF_ID'},
    {id: '1', text: 'EAF_NAME'},
    {id: '2', text: 'EAF_HEIGHT'},
    {id: '3', text: 'EAF_WIDTH'},
    {id: '4', text: 'EAF_COLOR'}
]
//类型为引用属性时的下拉框数据
//var selcombodata = {};
//表格数据
var dataDgData = [];
function getDgData(parentData){
    var obj={};
    for(var i=0;i<parentData["SECTIONS"].length;i++){
        for(var key in parentData["SECTIONS"][i]){
            obj[key]=parentData["SECTIONS"][i][key]
        }
        dataDgData.push(obj)
        obj={};
    }
    return dataDgData
}
getDgData(parentData);




//表格样式
var dataGridColumn = [[
    {field: 'EAF_NAME', title: '名称', width: 136, align: 'center', editor: 'text',},
    {field: 'EAF_TYPE', title: '类型', width: 143, align: 'center', formatter: productFormatter, editor: {
        type: 'combobox',
        options: {
            valueField: 'productid',
            textField: 'name',
            data: products,
            onChange:onChangeHandeler,
            panelHeight: 62
        }
    }
    },
    {field: 'EAF_ORDER', title: '排序', width: 143, align: 'center', editor: {
        type: 'numberbox'
    }
    },
    {field: 'EAF_CONTENT', title: '内容', width: 143, align: 'center', formatter: productsAttrFormatter, editor: {
        type: 'text'
    }
    }
]];
/**
 * “动态下拉框”改变的时候触发
 * @param newValue   改变后动态下拉框的数据ID
 * @param oldValue   改变前动态下拉框的数据ID
 */
function onChangeHandeler(newValue,oldValue) {
    //初次点击时候，oldValue为空，直接返回
    if(oldValue==''){
        return;
    }
    //获取“动态下拉框”改变前的行数据
    var selrow = $('#ruleGrid').datagrid('getSelected');
    //行的索引
    var selrowindex = $('#ruleGrid').datagrid('getRowIndex', selrow);
    $('#ruleGrid').datagrid('endEdit',selrowindex);
    //非初次点击，直接清空动态编辑器框中的值
    selrow.EAF_CONTENT='';
    $('#ruleGrid').datagrid('beginEdit',selrowindex);
}
function productFormatter(value) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].productid == value) return products[i].name;
    }
    return value;
}
//if (selcombodata[row.EAF_ID])value = selcombodata[row.EAF_ID];
//渲染“动态编辑框”
function productsAttrFormatter(value, row, index) {
    //判断“动态下拉框”为引用属性的时候，把value替换成 productsAttr中对应的值；
    if (row.EAF_TYPE == 2) {
        for (var i = 0; i < productsAttr.length; i++) {
            if (productsAttr[i].id == value) return productsAttr[i].text;
        }
    }
    return value;
}
function seleCom(p) {
    var selrow = $('#ruleGrid').datagrid('getSelected');
    var selrowindex = $('#ruleGrid').datagrid('getRowIndex', selrow);
    $('#ruleGrid').datagrid('endEdit',selrowindex);
    $('#ruleGrid').datagrid('beginEdit',selrowindex);
}
$("#waterGrid").dialog({
    title: "流水",
    width: 300,
    height: 200,
    buttons: [
        {
            text: "重置",
            plain: true,
            iconCls: "icon-reload",
            handler: function () {
                alert("我点击了流水的reset键！")
            }
        },
        {
            text: "确定",
            plain: true,
            iconCls: "icon-ok",
            handler: function () {
                //保存流水数据
                var snsObj={};
                var selrow = $('#ruleGrid').datagrid('getSelected');
                var selrowId=selrow.EAF_CONTENT
                if(!selrowId){
                //赋值一个，这个是我给的假的，所以只能添加一条流水
                var selrowId="";
                for(var i=0; i<32;i++){
                    selrowId+=Math.floor(Math.random()*10)
                }
                snsObj.EAF_ID = selrowId;
                snsObj.EAF_INIT = $("#wgInit").val()
                snsObj.EAF_LENGTH = $("#wgLength").val()
                snsObj.EAF_STEP = $("#wgStep").val()
                snsObj.EAF_LAST = $("#wgLast").val()
                dataDgDataNew["SNS"].push(snsObj);
                snsObj={}
                }
                $("#waterGrid").dialog('close')
            }
        }, {
            text: "取消",
            plain: true,
            iconCls: "icon-cancel",
            handler: function () {
                $("#waterGrid").dialog('close')
            }
        }]
});
//打开流水窗口并且加载数据
function openDialog(){
    $('#waterGrid').dialog('open');
    //更新流水数据
    var selrow = $('#ruleGrid').datagrid('getSelected');
    var selrowId=selrow.EAF_CONTENT
    if(selrowId){
        for(var i=0;i<parentData["SNS"].length;i++){
            var curId=parentData["SNS"][i].EAF_ID;
            //如果数据中的流水ID等等于所选行的EAF_CONTENT（流水ID）
            if(curId == selrowId){
                $("#wgInit").val(parentData["SNS"][i]["EAF_INIT"])
                $("#wgLength").val(parentData["SNS"][i]["EAF_LENGTH"])
                $("#wgStep").val(parentData["SNS"][i]["EAF_STEP"])
                $("#wgLast").val(parentData["SNS"][i]["EAF_LAST"])
            }
        }
    }
}
//关闭流水窗口的时候清空数据
function closeDialog() {
    $('#waterGrid').dialog({
        onClose: function () {
            $("#wgInit").val("");
            $("#wgLength").val("");
            $("#wgStep").val("");
            $("#wgLast").val("");
        }
    });
}
closeDialog()

function onBeforeEditHandeler(rowIndex, rowData){
    var col = $(this).datagrid('getColumnOption','EAF_CONTENT');
    //类型
    var type=$('#ruleGrid').datagrid('getSelected').EAF_TYPE;
    if(type=='0'){
        col.editor.type='text';
    }
    else if(type=='1'){
        col.editor.type='textbox';
        col.editor.options= {
            icons: [{
                iconCls: 'icon-edit',
                handler: openDialog
            }],
            iconWidth: 138
        };
    }
    else if(type=='2'){
        col.editor.type='combobox';
        col.editor.options={
            valueField: 'id',
            textField: 'text',
            data: productsAttr,
            panelHeight: 0
        }
    }
}
$(function () {
    var lastIndex;
    $('#ruleGrid').datagrid({
        onBeforeEdit: onBeforeEditHandeler,
        striped:true,
        toolbar: [{
            text: '添加',
            iconCls: 'icon-add',
            handler: function(){
                $('#ruleGrid').datagrid('endEdit', lastIndex);
                $('#ruleGrid').datagrid('appendRow', {
                    EAF_NAME: '',
                    EAF_TYPE: '0',
                    EAF_ORDER: '1',
                    EAF_CONTENT: ''
                });
                lastIndex = $('#ruleGrid').datagrid('getRows').length - 1;
                $('#ruleGrid').datagrid('selectRow', lastIndex);
                $('#ruleGrid').datagrid('beginEdit', lastIndex);
            }
        }, '-', {
            text: '删除',
            iconCls: 'icon-remove',
            handler:function(){
                var row = $('#ruleGrid').datagrid('getSelected');
                dataDgDelete.push(row.EAF_ID)
                if (row) {
                    var index = $('#ruleGrid').datagrid('getRowIndex', row);
                    $('#ruleGrid').datagrid('deleteRow', index);
                }
            }
        }],
        onBeforeLoad: function () {
            $(this).datagrid('rejectChanges');
        },
        onClickRow: function (rowIndex, row) {
            if (lastIndex != rowIndex) {
                $('#ruleGrid').datagrid('endEdit', lastIndex);
                $('#ruleGrid').datagrid('beginEdit', rowIndex);
            }
            lastIndex = rowIndex;
        },
        //表格样式
        columns: dataGridColumn,
        //表格数据
        data: dataDgData
    });
    $.parser.parse();
});
function getResult(){
    //获取列表中的“规则名称”
    dataDgDataNew["MAIN"]["EAF_NAME"]=$("#ruleName").val();
    //获取列表中的“生成方式”
    dataDgDataNew["MAIN"]["EAF_WAY"]=$("#bornStyle").combobox("getValue");
    //判断并获取列表中的“是否为主编码”
    if($("#mainCode").is(':checked')){
        dataDgDataNew["MAIN"]["EAF_ISMAIN"]=1
    }else{
        dataDgDataNew["MAIN"]["EAF_ISMAIN"]=0
    }
    //判断并获取列表中的“是否在发布时生成”
    if($("#bornPublish").is(':checked')){
        dataDgDataNew["MAIN"]["EAF_WHENPUBLISH"]=1
    }else{
        dataDgDataNew["MAIN"]["EAF_WHENPUBLISH"]=0
    }
    //var selrow = $('#ruleGrid').datagrid('getSelected');
    //debugger;//1
    //var selrowindex = $('#ruleGrid').datagrid('getRowIndex', selrow);
    //$('#ruleGrid').datagrid('endEdit', selrowindex);
    dataDgDataNew["SECTIONS"]= $('#ruleGrid').datagrid("getData");
    debugger;//1
    console.log(dataDgDataNew)
    console.log(dataDgDelete)
}