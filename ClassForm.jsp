<%@ include file='/main/head.jsp'%>
<form id="frm_class" method="post">
	<table cellspacing="10" style="width: 100%; padding: 4px;">
		<tr id="TR_EAF_ID">
			<td>ID:</td>
			<td><input id="EAF_ID" name="EAF_ID" /></td>
		</tr>
		<tr id="TR_EAF_PID">
			<td>父关联:</td>
			<td><input id="EAF_PID" name="EAF_PID" /></td>
		</tr>
		<tr>
			<td>类名称:</td>
			<td><input id="EAF_NAME" name="EAF_NAME" class="easyui-textbox" />
			</td>
		</tr>
		<tr id='TR_EAF_PERSIST'>
			<td>存储类型:</td>
			<td><select id="EAF_PERSIST" name="EAF_PERSIST"
				class="easyui-combobox" style="width: 152px;">
					<option value="0">动态类</option>
					<option value="1">存储类</option>
			</select></td>
		</tr>
		<tr id='TR_EAF_TNAME'>
			<td>表名称:</td>
			<td><input id="EAF_TNAME" name="EAF_TNAME"
				class="easyui-textbox"></td>
		</tr>
		<tr id='TR_EAF_DATASOURCE'>
			<td>数据源:</td>
			<td><input id="EAF_DATASOURCE" name="EAF_DATASOURCE"
				class="easyui-textbox"></td>
		</tr>
		<tr id="TR_EAF_CREATOR">
			<td>创建人:</td>
			<td><input id="EAF_CREATOR" name="EAF_CREATOR" /></td>
		</tr>
		<tr id="TR_EAF_CREATETIME">
			<td>创建时间:</td>
			<td><input id="EAF_CREATETIME" type="text"
				class="easyui-datetimebox"></input></td>
		</tr>
		<tr id="TR_EAF_MODIFIER">
			<td>修改人:</td>
			<td><input id="EAF_MODIFIER" name="EAF_MODIFIER" /></td>
		</tr>
		<tr id="TR_EAF_MODIFYTIME">
			<td>修改时间:</td>
			<td><input id="EAF_MODIFYTIME" type="text"
				class="easyui-datetimebox"></td>
		</tr>
		<tr id="TR_EAF_GROUP">
			<td>分组:</td>
			<td><input id="EAF_GROUP" name="EAF_GROUP" /></td>
		</tr>
		<tr id='TR_EAF_TYPE'>
			<td>类型:</td>
			<td><select id="EAF_TYPE" name="EAF_TYPE"
				class="easyui-combobox" style="width: 153px;">
					<option value="1">普通关联</option>
					<option value="2">依赖关联</option>
					<option value="3">实例关联</option>
			</select></td>
		</tr>
		<tr id='TR_EAF_LEFTCLASSID'>
			<td>左类ID:</td>
			<td><input id="EAF_LEFTCLASSID" name="EAF_LEFTCLASSID" /></td>
		</tr>
		<tr id='TR_EAF_RIGHTCLASSID'>
			<td>右类:</td>
			<td><input id="EAF_RIGHTCLASSID" name="EAF_RIGHTCLASSID" /></td>
		</tr>
		<tr id='TR_EAF_HASCHILD'>
			<td>是否有子类:</td>
			<td><input id="EAF_HASCHILD" name="EAF_HASCHILD" type="hidden" />
			</td>
		</tr>
		<tr id="TR_EAF_DEPENDENCY">
			<td>依赖类型:</td>
			<td><input id="EAF_DEPENDENCY" name="EAF_DEPENDENCY" /></td>
		</tr>
		<tr id="TR_EAF_VERSIONTYPE">
			<td>版本类型:</td>
			<td><select id="EAF_VERSIONTYPE" name="EAF_VERSIONTYPE"
				class="easyui-combobox" style="width: 153px;">
					<option value="0">无版本</option>
					<option value="1">单层线性版本</option>
					<option value="2">双层线性版本</option>
					<option value="3">双层树状版本</option>
			</select></td>
		</tr>
		<tr>
			<td>参数:</td>
			<td><input id="EAF_ARG" name="EAF_ARG" class="easyui-textbox" />
			</td>
		</tr>
		<tr>
			<td>描述:</td>
			<td><input id="EAF_DESC" name="EAF_DESC" class="easyui-textbox"
				data-options="multiline:true,height:50" /></td>
		</tr>
		<tr>
			<td>排序:</td>
			<td><input id="Text1" name="EAF_ORDER"
				class="easyui-numberspinner" /></td>
		</tr>
	</table>
</form>
<script type="text/javascript">
    // 类id
    var classId;
    // 类型
    var type;
    // 源id
    var sourceId;
    // 命令
    var command;
    $(function () {
        classId = eaf.getUrlParam('id');
        type = eaf.getUrlParam('type');
        command = eaf.getUrlParam('command');
        sourceId = eaf.getUrlParam('sourceId');
        initClassForm();
    });
    // 初始化表单
    function initClassForm() {
        initClassFormControls();
        if (command == 'new') {
            $("#EAF_ID").val(classId);
            $('#EAF_CREATETIME').datetimebox('setValue', '9999');
            $('#EAF_MODIFYTIME').datetimebox('setValue', '9999');
            $('#EAF_PERSIST').combobox('select', '1');
            $("#EAF_HASCHILD").val('0');
            if (type == 'CLS') {
                $("#EAF_PID").val(sourceId);
            } else if (type == 'REL') {
                $("#EAF_LEFTCLASSID").val(sourceId);
                $('#EAF_PID').combotree('setValue',
						'1F31E3CDC454FF32CCCE6EACC4E7EBFE');
            }
        } else {
            form_loadform('frm_class', 'DataModel', 'GetClassById', classId);
        }
    }
    // 初始化表单控件
    function initClassFormControls() {
        $('#TR_EAF_ID').hide();
        $('#TR_EAF_CREATOR').hide();
        $('#TR_EAF_CREATETIME').hide();
        $('#TR_EAF_MODIFIER').hide();
        $('#TR_EAF_MODIFYTIME').hide();
        $('#TR_EAF_GROUP').hide();
        $('#TR_EAF_DEPENDENCY').hide();
        $('#TR_EAF_HASCHILD').hide();
        $('#TR_EAF_DATASOURCE').hide();
        $('#EAF_PERSIST').combobox({
            onSelect: function (rec) {
                if (rec.value == '1') {
                    $('#TR_EAF_DATASOURCE').hide();
                    $('#TR_EAF_TNAME').show();
                }
                else {
                    $('#TR_EAF_TNAME').hide();
                    $('#TR_EAF_DATASOURCE').show();
                }
            }
        });
        //$('#EAF_PERSIST').combobox('select', '0');
        if (type == 'CLS') {
            $('#TR_EAF_TYPE').hide();
            $('#TR_EAF_LEFTCLASSID').hide();
            $('#TR_EAF_RIGHTCLASSID').hide();
            $('#TR_EAF_PID').hide();

        } else if (type == 'REL') {
            $('#TR_EAF_PERSIST').hide();
            $('#TR_EAF_LEFTCLASSID').hide();
            $('#TR_EAF_VERSIONTYPE').hide();
            $('#EAF_RIGHTCLASSID').combotree(
					{
					    url: eaf.getComboTreeUrl('ObjectService',
								'GetObjectsByCls')
								+ '&clsid='
								+ '51D9A19482AFE43B895AEA9BA76CEFCD',
					    required: true
					});
            $('#EAF_PID')
					.combotree(
							{
							    url: eaf.getComboTreeUrlByRootid('ObjectService',
										'GetObjectsByCls','00000000000000000000000000000001')
										+ '&clsid=51D9A19482AFE43B895AEA9BA76CEFCD&rules=connect by prior t.eaf_id =t.eaf_pid start with t.eaf_id=\'1F31E3CDC454FF32CCCE6EACC4E7EBFE\'',
							    required: true,
							    onClick: onClickRelTree
							});
        }
    }
    // 载入表单
    function form_loadform(frmname, taskFramePN, command, id) {
        // 类url
        var url = getObjectUrl(taskFramePN, command, id);
        $('#' + frmname).form('load', url);
        this[frmname + 'savetype'] = 'U';
    }
    //
    //获取单个对象URL
    function getObjectUrl(taskFramePN, command, id) {
        var url = '/txieasyui?taskFramePN=' + taskFramePN + '&command='
				+ command + '&id=' + id + '&refresh=' + eval(Math.random())
				+ '&colname=json&colname1={\'dataform\':\'eui_form_data\'}';
        return url;
    }
    // 获取类表单json
    function getClassFormJson() {
        // 类表单json
        var classFormJson = $('#frm_class').serializeObject();
        return eaf.jsonToStr(classFormJson);
    }
    // 点击关联树节点
    function onClickRelTree(node) {
        parent.window.frames["ifm_attrs"].location.href = '/main/DataModel/Attributes.jsp?id='
				+ classId
				+ '&type='
				+ type
				+ '&command='
				+ command
				+ '&sourceId=' + node.EAF_ID;
    }
</script>
<%@ include file='/main/footer.jsp'%>
