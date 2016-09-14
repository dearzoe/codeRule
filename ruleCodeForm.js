/**
 * Created by huwenzhe on 2016/9/14.
 */
//类型的下拉框数据
var products = [
    {productid:'0',name:'固定字符串'},
    {productid:'1',name:'流水'},
    {productid:'2',name:'引用属性'}
];
//表格数据
var dataDgData=[
    {EAF_NAME:'编码1',EAF_TYPE:"固定字符串",EAF_SORT:"1",EAF_CONTENT:""},
    {EAF_NAME:'编码2',EAF_TYPE:"流水",EAF_SORT:"7",EAF_CONTENT:""},
    {EAF_NAME:'编码3',EAF_TYPE:"引用属性",EAF_SORT:"3",EAF_CONTENT:""}
];
//表格样式
var dataGridColumn=[[
    {field:'EAF_NAME',title:'名称',width:143,align:'center',editor:'text',},
    {field:'EAF_TYPE',title:'类型',width:143,align:'center',formatter:productFormatter,editor:{type:'combobox',
        options:{
            valueField:'productid',
            textField:'name',
            data:products,
            onSelect:seleCom,
            panelHeight:62
        }}},
    {field:'EAF_SORT',title:'排序',width:143,align:'center',editor:{type:'numberbox',
        options:{
            required:true
        }

    },},
    {field:'EAF_CONTENT',title:'内容',width:143,align:'center',editor:{type:'text'}}
]];
function productFormatter(value){
    for(var i=0; i<products.length; i++){
        if (products[i].productid == value) return products[i].name;
    }
    return value;
}
function seleCom(p){
    var selrow = $('#ruleGrid').datagrid('getSelected');
    var selrowindex = $('#ruleGrid').datagrid('getRowIndex',selrow);
    var ed = $('#ruleGrid').datagrid('getEditor', {index:selrowindex,field:'EAF_CONTENT'});
    //$(ed.target).parent().parent().parent().parent().parent().parent().parent().find("a").css("display","none")
    $.parser.parse();
    if(p.productid == 0){//.siblings().child("span").find("a")
        $(ed.target).searchbox({
            height:20,
        })
    }else if(p.productid == 1){
        $(ed.target).textbox({
            icons:[{
                iconCls:'icon-edit',
                handler: openDialog,
                iconAlign:"right"
            }],
            height:20,
            iconWidth:130
        })
    }else if(p.productid == 2){
        $(ed.target).combobox({
            valueField:'id',
            textField:'text',
            height:20,
            panelHeight:62
        });
    }
    $.parser.parse();
}
/*function context(b){  //formatter:context,放在第四列
 var ed = $('#ruleGrid').datagrid('getEditor',{index:0,field:'EAF_CONTENT'});
 }*/
$("#dg1").dialog({
    title:"流水",
    width:300,
    height:200,
    buttons:[
        {
            text:"重置",
            plain:true,
            iconCls:"icon-reload",
            handler:function(){
                alert("我点击了流水的reset键！")
            }
        },
        {
            text:"确定",
            plain:true,
            iconCls:"icon-ok",
            handler:function(){
                alert("我点击了流水的OK键！")
            }
        },{
            text:"取消",
            plain:true,
            iconCls:"icon-cancel",
            handler:function(){
                alert("我点击了流水的cancel键！")
            }
        }]
});
function openDialog(){
    $('#dg1').dialog('open');
}
$(function(){
    var lastIndex;
    $('#ruleGrid').datagrid({
        toolbar:[{
            text:'添加',
            iconCls:'icon-add',
            handler:function(){
                $('#ruleGrid').datagrid('endEdit', lastIndex);
                $('#ruleGrid').datagrid('appendRow',{
                    EAF_NAME:'',
                    EAF_TYPE:'0',
                    EAF_SORT:'',
                    EAF_CONTENT:''
                });
                lastIndex = $('#ruleGrid').datagrid('getRows').length-1;
                $('#ruleGrid').datagrid('selectRow', lastIndex);
                $('#ruleGrid').datagrid('beginEdit', lastIndex);
            }
        },'-',{
            text:'删除',
            iconCls:'icon-remove',
            handler:function(){
                var row = $('#ruleGrid').datagrid('getSelected');
                if (row){
                    var index = $('#ruleGrid').datagrid('getRowIndex', row);
                    $('#ruleGrid').datagrid('deleteRow', index);
                }
            }
        },'-',{
            text:'保存',
            iconCls:'icon-save',
            handler:function(){
                $('#ruleGrid').datagrid('acceptChanges');
            }
        }],
        onBeforeLoad:function(){
            $(this).datagrid('rejectChanges');
        },
        onClickRow:function(rowIndex){
            if (lastIndex != rowIndex){
                $('#ruleGrid').datagrid('endEdit', lastIndex);
                $('#ruleGrid').datagrid('beginEdit', rowIndex);
            }
            lastIndex = rowIndex;
        },
        //表格样式
        columns:dataGridColumn,
        //表格数据
        data:dataDgData
    });
    $.parser.parse();
});

/*
//返回选择行数据
function getResult() {
    return "";
};*/
