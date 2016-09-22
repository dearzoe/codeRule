/**
 * Created by huwenzhe on 2016/9/20.
 */
//模拟真实数据 之后删除   描述待写完之后完善，现在不知道怎么描述 EAF_CONTENT为ID时候以及EAF_ID和EAF_MID
//为一个对象，
// 当KEY为"MAIN"时值为一个对象，此对象中是KEY为"EAF_NAME"（规则名称），"EAF_ISMAIN"（是否为主编码），"EAF_WAY"（生成方式），"EAF_WHENPUBLISH"（是否在发布时生成），"EAF_SAMPLE"（编码样例）。
//当KEY为"SECTIONS"时值为一个数组，此数组中的每一项为一个对象，每个对象为表格中每一行的数据，其中的KEY为"EAF_NAME"（名称），"EAF_TYPE"（类型），"EAF_ORDER"（排序）。"EAF_CONTENT"（内容）(*接下*)
//（*接上*）"EAF_CONTENT"（内容）其中有三种值，当"EAF_TYPE"为0时候，"EAF_CONTENT"为string,当"EAF_TYPE"为1时候，"EAF_CONTENT"为parentData["SNS"].EAF_ID（流水表格ID）,当"EAF_TYPE"为2时候，"EAF_CONTENT"为类ID（引用属性ID）
//当KEY为"SNS"时值为一个数组，此数组中的每一项为一个对象，每个对象为当表格为流水的时候流水表格的数据，其中的KEY"EAF_ID"与parentData["SECTIONS"]["EAF_CONTENT"]的值相等，其中KEY为"EAF_INIT"（初始值），"EAF_LENGTH"（长度），"EAF_STEP"（步长），"EAF_LAST"（最后流水）
var parentData = {
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
};
/**************************************************************/
var ruleString = eaf.getLabel('eaf_rule_string')
var ruleWater = eaf.getLabel('eaf_rule_water')
var ruleReference = eaf.getLabel('eaf_rule_reference')
var ruleDatagridName = eaf.getLabel('eaf_rule_datagridName')
var ruleDatagridType = eaf.getLabel('eaf_rule_datagridType')
var ruleDatagridSort = eaf.getLabel('eaf_rule_datagridSort')
var ruleDatagridContent = eaf.getLabel('eaf_rule_datagridContent')
var ruleDatagridWater = eaf.getLabel('eaf_rule_datagridWater')
var ruleDatagridReset = eaf.getLabel('eaf_rule_datagridReset')
var ruleDatagridOk = eaf.getLabel('eaf_rule_datagridOk')
var ruleDatagridCancel = eaf.getLabel('eaf_rule_datagridCancel')
var ruleDatagridAdd = eaf.getLabel('eaf_rule_datagridAdd')
var ruleDatagridRemove = eaf.getLabel('eaf_rule_datagridRemove')
var ruleAuto = eaf.getLabel('eaf_rule_auto')
var ruleManual = eaf.getLabel('eaf_rule_manual')

/**************************************************************/
//获取类ID
var clsid = eaf.getUrlParam('clsid');
//表单界面id
var uiid = eaf.getUrlParam('uiid');
//获取属性列表
var attrs = eaf.ajaxGet(eaf.getObjsToFrameUrl('DataModel', 'GetAttrsByClassId') + '&clsid=' + clsid + '&uiid=' + uiid);
//类型为引用属性时的下拉框数据
var productsAttr = [];
//获取表格数据
var dataDgData = [];
//构造新的表格数据
var dataDgDataNew = [];
//form表单主数据；
dataDgDataNew["MAIN"] = {};
//form表单表格数据
dataDgDataNew["SECTIONS"] = [];
//form表单流水数据
dataDgDataNew["SNS"] = [];
//删除数据数组
var dataDgDelete = [];
//类型的下拉框数据
var products = [
    {productid: '0', name: eaf.getLabel('eaf_rule_fixString')},
    {productid: '1', name: eaf.getLabel('eaf_rule_water')},
    {productid: '2', name: eaf.getLabel('eaf_rule_reference')}
];
//表格样式
var dataGridColumn = [[
    {field: 'EAF_NAME', title: eaf.getLabel('eaf_rule_datagridName'), width: 136, align: 'center', editor: 'text',},
    {
        field: 'EAF_TYPE', title: eaf.getLabel('eaf_rule_datagridType'), width: 143, align: 'center', formatter: productFormatter, editor: {
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
    {
        field: 'EAF_ORDER', title: eaf.getLabel('eaf_rule_datagridSort'), width: 143, align: 'center', editor: {
        type: 'numberbox'
    }
    },
    {
        field: 'EAF_CONTENT', title: eaf.getLabel('eaf_rule_datagridContent'), width: 143, align: 'center', formatter: productsAttrFormatter, editor: {
        type: 'text'
    }
    }
]];
/**
 * 获取表格数据
 * @param parentData  传入的主数据
 * @returns {Array}   表格数据
 */
function getDgData(parentData) {
    //创建一个新的临时对象
    var obj = {};
    for (var i = 0; i < parentData["SECTIONS"].length; i++) {
        for (var key in parentData["SECTIONS"][i]) {
            obj[key] = parentData["SECTIONS"][i][key]
        }
        dataDgData.push(obj)
        obj = {};
    }
    return dataDgData;
}
/**
 * “动态下拉框”改变的时候触发
 * @param newValue   改变后动态下拉框的数据ID
 * @param oldValue   改变前动态下拉框的数据ID
 */
function onChangeHandeler(newValue, oldValue) {
    //初次点击时候，oldValue为空，直接返回
    if (oldValue == '') {
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
/**
 * 格式化类型下拉框
 * @param value  为所选值的ID
 * @returns {*}  
 */
function productFormatter(value) {
    for (var i = 0; i < products.length; i++) {
        if (products[i].productid == value) return products[i].name;
    }
    return value;
}
// **暂留** if (selcombodata[row.EAF_ID])value = selcombodata[row.EAF_ID];
/**
 *  格式化引用属性下拉框
 * @param value  为所选值的ID
 * @param row    表格中所选行的数据对象
 * @param index  表格中所选行的索引
 * @returns {*}
 */
function productsAttrFormatter(value, row, index) {
    //获取引用属性的下拉框数据
    getProductsAttr(attrs);
    //判断“动态下拉框”为引用属性的时候，把value替换成 productsAttr中对应的值；
    if (row.EAF_TYPE == 2) {
        for (var i = 0; i < productsAttr.length; i++) {
            if (productsAttr[i].id == value) return productsAttr[i].text;
        }
    }
    return value;
}
$("#rule_water_grid").dialog({
    title: eaf.getLabel('eaf_rule_datagridWater'),
    width: 300,
    height: 200,
    buttons: [
        {
            text: eaf.getLabel('eaf_rule_datagridReset'),
            plain: true,
            iconCls: "icon-reload",
            handler: function () {
                alert("我点击了流水的reset键！")
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
                //获取所选行的ID
                var selRowId = selRow.EAF_CONTENT
                if (!selRowId) {
                    //赋值一个，这个是我给的假的，所以只能添加一条流水
                    var selRowId = "";
                    for (var i = 0; i < 32; i++) {
                        selRowId += Math.floor(Math.random() * 10)
                    }
                    snsObj.EAF_ID = selRowId;
                    snsObj.EAF_INIT = $("#water_grid_init").val()
                    snsObj.EAF_LENGTH = $("#water_grid_length").val()
                    snsObj.EAF_STEP = $("#water_grid_step").val()
                    snsObj.EAF_LAST = $("#water_grid_last").val()
                    dataDgDataNew["SNS"].push(snsObj);
                    snsObj = {}
                }
                $("#rule_water_grid").dialog('close')
            }
        }, {
            text: eaf.getLabel('eaf_rule_datagridCancel'),
            plain: true,
            iconCls: "icon-cancel",
            handler: function () {
                $("#rule_water_grid").dialog('close')
            }
        }]
})
//打开流水窗口并且加载数据
function openDialogHandeler() {
    $('#rule_water_grid').dialog('open');
    //获取所选行的数据
    var selRow = $('#eaf_rule_grid').datagrid('getSelected');
    //获取所选行的ID
    var selRowId = selRow.EAF_CONTENT;
    if (selRowId) {
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
}
//获取类型为引用属性时的下拉数据
function getProductsAttr(attrs) {
    //创建一个临时对象储存每个下拉属性
    var curProductsAttr = {};
    for (var i = 0; i < attrs["rows"].length; i++) {
        //暂时写N 是因为想页面展示一下，以后改成“Y”
        if (attrs["rows"][i].EAF_ISCODE == "N") {
            curProductsAttr.id = attrs["rows"][i].EAF_ID;
            curProductsAttr.text = attrs["rows"][i].EAF_NAME;
            productsAttr.push(curProductsAttr);
            curProductsAttr = {};
        }
    }
    return productsAttr
}
//关闭流水窗口的时候清空数据
function closeDialogHandeler() {
    $('#rule_water_grid').dialog({
        onClose: function () {
            $("#water_grid_init").val("");
            $("#water_grid_length").val("");
            $("#water_grid_step").val("");
            $("#water_grid_last").val("");
        }
    });
}
closeDialogHandeler()
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
        }
    }
}
$(function () {
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
    })
    //获取表格数据
    getDgData(parentData);
    //最后点击的索引
    var lastIndex;
    $('#eaf_rule_grid').datagrid({
        onBeforeEdit: onBeforeEditHandeler,
        striped: true,
        toolbar: [{
            text: eaf.getLabel('eaf_rule_datagridAdd'),
            iconCls: 'icon-add',
            handler: function () {
                $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                $('#eaf_rule_grid').datagrid('appendRow', {
                    EAF_NAME: '',
                    EAF_TYPE: '0',
                    EAF_ORDER: '1',
                    EAF_CONTENT: ''
                });
                lastIndex = $('#eaf_rule_grid').datagrid('getRows').length - 1;
                $('#eaf_rule_grid').datagrid('selectRow', lastIndex);
                $('#eaf_rule_grid').datagrid('beginEdit', lastIndex);
            }
        }, '-', {
            text: eaf.getLabel('eaf_rule_datagridRemove'),
            iconCls: 'icon-remove',
            handler: function () {
                //获取所选行的数据
                var row = $('#eaf_rule_grid').datagrid('getSelected');
                dataDgDelete.push(row.EAF_ID)
                if (row) {
                    //获取所选行的索引
                    var index = $('#eaf_rule_grid').datagrid('getRowIndex', row);
                    $('#eaf_rule_grid').datagrid('deleteRow', index);
                }
            }
        }],
        onBeforeLoad: function () {
            $(this).datagrid('rejectChanges');
        },
        onClickRow: function (rowIndex, row) {
            if (lastIndex != rowIndex) {
                $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                $('#eaf_rule_grid').datagrid('beginEdit', rowIndex);
            }
            lastIndex = rowIndex;
        },
        //表格样式
        columns: dataGridColumn,
        //表格数据
        data: dataDgData
    });
    $.parser.parse();
})
function getResult() {
    //获取列表中的“规则名称”
    dataDgDataNew["MAIN"]["EAF_NAME"] = $("#eaf_ruleName_form").val();
    //获取列表中的“生成方式”
    dataDgDataNew["MAIN"]["EAF_WAY"] = $("#eaf_bornStyle_form").combobox("getValue");
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
    dataDgDataNew["SECTIONS"] = $('#eaf_rule_grid').datagrid("getData");
    var msg=eaf.getLabel('eaf_rule_water');
    console.log(msg)
}