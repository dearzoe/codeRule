<%@ include file='/main/head.jsp' %>
<table cellspacing="5" style="width: 100%; padding: 4px;">
    <tr>
        <td>
            关联类:
        </td>
        <td>
            <input id="EAF_RELATECLSID" name="EAF_RELATECLSID">
        </td>
    </tr>
    <tr>
        <td>
            关联属性:
        </td>
        <td>
            <input id="EAF_RELATEATTRID" name="EAF_RELATEATTRID" />
            <input id="EAF_RELATEVALUE" name="EAF_RELATEVALUE" type="hidden" />
        </td>
    </tr>
    <tr>
        <td>
            显示属性:
        </td>
        <td height="200px">
            <table id="dgd_Attrs" class="easyui-datagrid" data-options="fit:true,singleSelect:true">
            </table>
            <input id="EAF_RELATESHOW" name="EAF_RELATESHOW" type="hidden" />
        </td>
    </tr>
    <tr>
        <td>
            资源序号：
        </td>
        <td>
            <input id="EAF_SN" name="EAF_SN" class="easyui-textbox" editable="false" />
        </td>
    </tr>
    <tr>
        <td>
            级联属性：
        </td>
        <td>
            <input id="EAF_FILTERATTR" name="EAF_FILTERATTR" class="easyui-textbox" />
        </td>
    </tr>
    <tr>
        <td>
            数据来源：
        </td>
        <td height="50px">
            <input id="EAF_FILTER" name="EAF_FILTER" class="easyui-textbox" data-options="multiline:true,fit:true" /><a
                href="#" onclick="window.open('ResourceHelper.html')">帮助</a>
        </td>
    </tr>
</table>
<script type="text/javascript">
    // 资源id
    var resId;
    // 资源类id
    var resClsId = 'DF7013366ECCB153161F6492222EC0AE';
    $(function () {
        resId = eaf.getUrlParam('id');
        // 资源对象
        var resobj = eaf.ajaxGet(eaf.getObjByIdUrl(resId, resClsId), null);
        if (!resobj.EAF_ID) {
            resobj = null;
        }
        //关联类初始化
        $('#EAF_RELATECLSID').combotree({
            url: eaf.getComboTreeAllByClsUrl('51D9A19482AFE43B895AEA9BA76CEFCD'), //类元模型ID
            onChange: function (newValue, oldValue) {
                var cid = newValue;
                if (!cid) { cid = resobj.EAF_RELATECLSID; }
                if (cid) {
                    //更新关联属性列表
                    var attrdata = eaf.ajaxGet(eaf.getAttrsByClassToPage(cid));
                    $('#EAF_RELATEATTRID').combobox('loadData', attrdata.rows);
                    var selattrid = "E13728B6B24D4AB29DC9F06B0FDBC315"; //系统默认ID属性
                    if (resobj) { selattrid = resobj.EAF_RELATEATTRID };
                    $('#EAF_RELATEATTRID').combobox('select', selattrid);
                    //更新显示属性列表
                    $('#dgd_Attrs').datagrid('loadData', attrdata);
                    if (resobj) {
                        var displayAttrsObj = eaf.strToJson(resobj.EAF_DISPLAYATTRS.substr(8,
					resobj.EAF_DISPLAYATTRS.length - 7));
                        for (var i = 0; i < displayAttrsObj.length; i++) {
                            $('#dgd_Attrs').datagrid('selectRecord', displayAttrsObj[i]);
                        }
                        $('#EAF_RELATESHOW').val(resobj.EAF_RELATESHOW);
                        // 获取所有的行
                        var rows=$('#dgd_Attrs').datagrid('getSelections');
                        for(var i=0;i<rows.length;i++){
                            // 当前行
                            var row =rows[i];
                            row.displayName = "RES_" + resobj.EAF_RELATEVALUE + "_" + resobj.EAF_RELATESHOW;
                            if(row.displayName.length+5>30){
                                row.displayName= "RES_" +resobj.EAF_SN+"_1";
                            }
                            $('#dgd_Attrs').datagrid('refreshRow',$('#dgd_Attrs').datagrid('getRowIndex',row));
                        }
                    }
                    else {
                        $('#dgd_Attrs').datagrid('selectRow', 0);
                    }
                }
            }
        });
        //关联属性初始化
        $('#EAF_RELATEATTRID').combobox({
            valueField: 'EAF_ID',
            textField: 'EAF_NAME',
            onSelect: function (rec) {
                if (rec) {
                    $('#EAF_RELATEVALUE').val(rec.EAF_CNAME);
                }
            }
        });
        //显示属性初始化
        $('#dgd_Attrs').datagrid({
            idField: 'EAF_ID',
            valueField: 'EAF_ID',
            textField: 'EAF_NAME',
            columns: [[{ field: 'EAF_ID', title: '属性ID', checkbox: true },
            { field: 'EAF_CNAME', title: '名称', width: 120 },
            { field: 'EAF_NAME', title: '显示名', width: 140},
            { field: 'displayName', title: '资源显示名', width: 190}
            ]]
        });
        if (resobj) {
            $('#EAF_RELATECLSID').combotree('setValue', resobj.EAF_RELATECLSID);
        }
        //初始化过滤属性
        if (resobj) {
            $('#EAF_FILTERATTR').textbox('setValue', resobj.EAF_FILTERATTR);
            $('#EAF_FILTER').textbox('setValue', resobj.EAF_FILTER);
            $('#EAF_SN').textbox('setValue', resobj.EAF_SN);
        }
    });
    //保存资源
    function getResult() {
    //类元模型ID
    var clsId=eaf.getUrlParam('clsid');
    //表单对象
    var resFormObj = {};
        resFormObj.EAF_ID = resId;
        resFormObj.EAF_RELATECLSID = $('#EAF_RELATECLSID').combotree('getValue');
        if (resFormObj.EAF_RELATECLSID) {
            resFormObj.EAF_RELATEATTRID = $('#EAF_RELATEATTRID').combotree('getValue');
            resFormObj.EAF_FILTER = eaf.escapejsonstr($('#EAF_FILTER').val());
            resFormObj.EAF_RELATEVALUE = $('#EAF_RELATEVALUE').val();
            resFormObj.EAF_FILTERATTR = $('#EAF_FILTERATTR').val();
            resFormObj.EAF_DISPLAYATTRS = 'display:[';
            // 选中的行
            var checkedRows = $('#dgd_Attrs').datagrid('getChecked');
            for (var i = 0; i < checkedRows.length; i++) {
                if (i > 0) {
                    resFormObj.EAF_DISPLAYATTRS = resFormObj.EAF_DISPLAYATTRS + ',';
                }
                else {
                    resFormObj.EAF_RELATESHOW = checkedRows[i].EAF_CNAME;
                }
                resFormObj.EAF_DISPLAYATTRS = resFormObj.EAF_DISPLAYATTRS + '"' + checkedRows[i].EAF_ID + '"';
            }
            resFormObj.EAF_DISPLAYATTRS = resFormObj.EAF_DISPLAYATTRS + ']';
            resFormObj.EAF_DISPLAYATTRS = eaf.escapejsonstr(resFormObj.EAF_DISPLAYATTRS);
            //更新添加
            eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).updateObjects.push(resFormObj);
        }
        else {
            //删除
            eaf.getIframWin(top.window.frames["ifmbimcenter"].document.getElementById(""+clsId)).deleteObjects.push(resId);
        }
        return resId;
    };
</script>
<%@ include file='/main/footer.jsp' %>
