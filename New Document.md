![CRRC](http://www.crrcgc.cc/Portals/71/logo.jpg)
### 160928 项目心得
*easyui* 的试用
- 最近写的是一个编码规则的例子
- 其中的*难点*就是一个下拉框，选中其中一个下拉框中的不同值在datagrid中生成不同的显示状态；
效果如![下拉框](http://img.bbs.csdn.net/upload/201609/20/1474364131_900680.png)
| 动态下拉框 | 动态编辑框 |
| :-------: | :-------: |
| 固定字符串 | 1 |
| 流水 | 2 |
| 引用属性 | 3 |
- CSDN问题:<http://bbs.csdn.net/topics/392018364>
之前在formatter这个来实现，发现easyui有很多坑(因为这个功能要在表格中实现)，实现不了，具体已经不可描述了；
**解决方法**
后来用的是表格*dadagrid*中的*onBeforeEdit*方法;
```
/**
 * 在编辑之前编译
 * @param rowIndex 所选行的索引
 * @param rowData  所选行的数据
 */
function onBeforeEdit(rowIndex, rowData) {
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
```
- 还有一个*难点*就是*清空*刚才选的combobox所对应的值；
**解决方法**
后来用的是表格*dadagrid*中*columns*中的*combobox*的*editor*对应的*options*中的*onChange*的方法;

```
/**
 * “动态下拉框”改变的时候触发
 * @param newValue   改变后动态下拉框的数据ID
 * @param oldValue   改变前动态下拉框的数据ID
 */
function onChange(newValue, oldValue) {
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
```
- 最后一个*难点*,其实也不难,只是之前没找到方法;
- easyui中的*datagrid*的行刚编辑完(onEndEdit)是选中状态不能继续编辑此行；
**解决方法**
用*onDblClickRow*事件开始编辑和结束上次一编辑，用*onClickRow*事件结束上一次编辑。
```
    onDblClickRow: function (rowIndex, row) {
                    if (lastIndex != rowIndex) {
                        $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                        $('#eaf_rule_grid').datagrid('beginEdit', rowIndex);
                    }
                        lastIndex = rowIndex;
                },
    onClickRow:function(rowIndex, row){
                    $('#eaf_rule_grid').datagrid('endEdit', lastIndex);
                }
```
