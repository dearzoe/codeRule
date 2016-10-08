<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/main/UserInterface/form.js" type="text/javascript"></script>
<div data-options="region:'west'" style="width: 260px;">
    <form id="uie_div_form" style=" height:100%; ">
    </form>
</div>
<div data-options="region: 'center',title: '' " style="padding: 1px;">
    <iframe id="uie_ifm_rel" name="uie_ifm_rel" src="" frameborder="0" style="border: 0;
        width: 100%; height: 99%;"></iframe>
</div>
<script type="text/javascript">
    // 资源类id
    var resclsid = 'DF7013366ECCB153161F6492222EC0AE';
    // 添加对象列表  由保存资源页面传递来； 对象数组分为两层，第一层为对象，第二层为键值对，包括键为EAF_ID，EAF_RELATEATTRID，EAF_RELATEclsid等；
    var insertObjects = [];
    // 修改对象列表  由保存资源页面传递来； 对象数组分为两层，第一层为对象，第二层为键值对，包括键为EAF_ID，EAF_RELATEATTRID，EAF_RELATEclsid等；
    var updateObjects = [];
    // 删除对象列表  由保存资源页面传递来； 为字符串数组，每个字符串为删除行的resId
    var deleteObjects = [];
    // 类ID
    var clsid = eaf.getUrlParam('clsid');
    // 表单界面id
    var uiId = eaf.getUrlParam('uiid');
    // 对象ID
    var objid = eaf.getUrlParam('objid');
    // div form表单
    var divform = $('#uie_div_form');
    var eafform;
    // arg预留参数
    var arg = eaf.getUrlParam('arg');
    // 添加编码规则对象列表
    var codeUpdataObject=[];
    // 删除编码规则
    var codeDeleteArray=[];
    //编码规则缓存你名称
    var encodingName={};
    $(function () {
        //创建参数对象
        var param = {};
        //获取属性组
        param.groups = ctl.getAttrGroupByCls(clsid);
        //获取属性
        param.attrs = ctl.getAttrExByCls(clsid);
        //获取操作
        param.tools = ctl.getFormOpersByCls(clsid, uiId);
        for (var i = 0; i < param.tools.length; i++) {
            if (param.tools[i].EAF_ID == "C8D374979B252F9E9D0EF19500DE05CB")
                param.tools[i].EAF_EVENT = "uie_frm_clsui()";
            if (param.tools[i].EAF_ID == "93BA2A79E810E59E8F48738B2AC709B7")
                param.tools[i].EAF_EVENT = "uie_frm_clsoper()";
        }
        //获取单个对象（包括默认值）
        //var fromobj = ctl.getObjDefaultById(objid, clsid, param.attrs);
		var fromobj;
		if (objid) {
			url = eaf.getObjByIdToFrameUrl('ObjectService', 'GetObjectById', objid) + '&clsid=' + clsid + '&isReturnResource=1&arg=' + arg;
			fromobj = eaf.ajaxGet(url);
			if (fromobj.EAF_ERROR) {
				return;
			}
			//填写默认值
			if (!fromobj || !fromobj.EAF_ID) {
				fromobj = ctl.getColsDefault(param.attrs);
			}
		}
		//添加情况下，父类ID
        var frompclsid = "";
        //如果类型为空，表示是类，要隐藏的关联相关列
        if (!fromobj.EAF_TYPE) {
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_TYPE").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_LEFTCLASSID").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_LEFTCLASSNAME").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RIGHTCLASSID").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RIGHTCLASSNAME").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RELTYPE").EAF_FORMSHOW = 'N';
            if (!fromobj.EAF_NAME) { frompclsid = fromobj.EAF_PID; } //添加
        }
        else {
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_PERSIST").EAF_FORMSHOW = 'N';
            eaf.findArray(param.attrs, "EAF_CNAME", "EAF_VERSIONTYPE").EAF_FORMSHOW = 'N';
            if (!fromobj.EAF_NAME) { frompclsid = '1F31E3CDC454FF32CCCE6EACC4E7EBFE'; } //关联暂时默认不继承             //添加
            if (objid == '1F31E3CDC454FF32CCCE6EACC4E7EBFE') {
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_LEFTCLASSID").EAF_FORMSHOW = 'N';
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_LEFTCLASSNAME").EAF_FORMSHOW = 'N';
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RIGHTCLASSID").EAF_FORMSHOW = 'N';
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RIGHTCLASSNAME").EAF_FORMSHOW = 'N';
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_TYPE").EAF_FORMSHOW = 'N';
                eaf.findArray(param.attrs, "EAF_CNAME", "EAF_RELTYPE").EAF_FORMSHOW = 'N';
            }
        }
        //显示类ID
        var eaf_id=eaf.findArray(param.attrs, "EAF_CNAME", "EAF_ID");
        eaf_id.EAF_FORMSHOW = 'Y';
        eaf_id.EAF_NOEDIT='Y';
        eaf_id.EAF_CTLTYPE='noedit';
        eafform = new eaf_form(divform, param, clsid, objid, fromobj);
        //设置属性列表
        var relurl = 'Cls2RelAttr.jsp?uiid=8E484453AC6F6ABE08678490ACEA397E&clsid=DD9D7BCD45E2B002B64D372A04F31798&fromclsid=' + objid + '&frompclsid=' + frompclsid;
        window.frames["uie_ifm_rel"].location.href = relurl;
        //父类有版本，子类和父类一致   
        //var pFromObj = eaf.getObjById(fromobj.EAF_PID, clsid); //获取父对象
		var pFromObj;
		if (objid) {
			url = eaf.getObjByIdToFrameUrl('ObjectService', 'GetObjectById', fromobj.EAF_PID) + '&clsid=' + clsid + '&isReturnResource=1&arg={"operationId":"viewall0000000000000000000000001"}';
            pFromObj = eaf.ajaxGet(url);
        }
        if(pFromObj.EAF_VERSIONTYPE){
	        if (pFromObj.EAF_VERSIONTYPE != '0') {
	            $("#EAF_VERSIONTYPE").combobox('setValue', pFromObj.EAF_VERSIONTYPE);
	            $("#EAF_VERSIONTYPE").combobox('disable');
	        }      	
        }
        //父类是否多语言，子类和父类一直
        if (pFromObj.EAF_MUL== '1') {
            $("#EAF_MUL").combobox('setValue', pFromObj.EAF_MUL);
            $("#EAF_MUL").combobox('disable');
        }
        var EAF_LEFTCLASSID = eaf.getUrlParam('EAF_LEFTCLASSID');
        if (EAF_LEFTCLASSID == "(EAF_ID)" && !(fromobj && fromobj.EAF_LEFTCLASSID != "(EAF_ID)")) {
            $("#EAF_LEFTCLASSID").combobox('clear');
        }
        if (frompclsid=="(EAF_ID)") {  eaf.msg("请先选择父类。"); }
    });
    //删除当前类
    function uie_frm_delete() {
        $.messager.confirm('确认对话框', '您确定要删除这个类吗？', function (r) {
            if (r) {
                var rs = eaf.readData("DataModel", "DeleteClass", { clsid: objid });
                if (rs.EAF_ERROR) {
                    eaf.msg(rs.EAF_ERROR);
                    return;
                }
                //更新页面数据
                var ifmtree = parent.frames["ifm8A0553ADAE0DEFB9299263A63E463655"];
                eaf.getIframWin(ifmtree).eaftree.reload(objid);
                parent.closeSelTab();
            }
        });
    }
    //保存表单数据
    function uie_frm_save() {
    	if(insertObjects.length!=0&&updateObjects.length!=0&&deleteObjects.length!=0){   		
       		eaf.saveObjects(resclsid , insertObjects ,  updateObjects , eaf.jsonToStr(deleteObjects));
    	}
       insertObjects=[];
       updateObjects=[];
       deleteObjects=[];
        //ajax保存编码规则数据
        for(var i=0;i<codeUpdataObject.length;i++){
            $.ajax({
                type: "POST",
                url: eaf.saveObjByIdToFrameUrl('DataModel', 'UpdateEncodingRule'),
                async: false,
                dataType: "json",
                data:{encodingRule:eaf.jsonToStr(codeUpdataObject[i])}
            });
        }
        //删除编码规则数据
        for(var j=0;j<codeDeleteArray.length;j++){
            eaf.readData('DataModel', 'DeleteEncodingRule',{id:codeDeleteArray[j]}).result;
        }

		top.overrideAttrs=window.frames["uie_ifm_rel"].getSaveJson(); 
		// 是否存在被覆盖的属性
    	var isExistAttrOverride=eaf.readData('DataModel', 'IsExistAttrOverride',{'clsId':objid});
		if(isExistAttrOverride.isExistAttrOverride=="1"&&(eaf.strToJson(top.overrideAttrs.updateObjects).length>0)){		
       		//选择要传递的属性窗口
   	    	ctl.openDialog("main/DataModel/AttrSynchronize.jsp", "属性传递", true,function(v){
   	    		var cacheData=window.frames["uie_ifm_rel"].dataCache
   	    		// 过滤未修改的元属性
   	    		eaf.getChangeAttrs(cacheData,v,'EAF_ID',['EAF_ID','EAF_CLASSID','EAF_PATTRID','EAF_CNAME','IsOverride']);
   	    		uie_frm_save2(eaf.jsonToStr(v))
   	    	}, 800,590);   		        	
    	}else{
    		uie_frm_save2(top.overrideAttrs.updateObjects);
    	}
    }
  	//保存表单数据
    function uie_frm_save2(r){
    	if (!divform.form('validate')) {
            return;
        }
        // 类表单json
        var formJson = eaf.jsonToStr(divform.serializeObject());
        var gridJson = top.overrideAttrs;
        // 组织参数
        var data = {
            clsid: objid,
            classObj: formJson,
            insertAttrs: gridJson.insertObjects,
            updateAttrs: r,
            deleteAttrs: gridJson.deleteObjects,
            arg:eaf.jsonToStr({'isCheckOverride':'1'})
        };
        eaf.saveClass2(data, function (result) {
        	if (result.EAF_ERROR) {
            	if(result.EAF_ERROR.includes('被子类覆盖')){
            		data.arg=eaf.jsonToStr({'isCheckOverride':'0'})
    	        	$.messager.confirm('确认对话框', '被删除的属性中存在被子类覆盖的属性，您确定要删除吗？', function (r) {
    	                if (r) {     
    	                	eaf.saveClass2(data, function (result) {
    	                		//更新页面数据
    	                        var ifmtree = parent.frames["ifm8A0553ADAE0DEFB9299263A63E463655"];
    	                        eaf.getIframWin(ifmtree).eaftree.reload(objid);
    	                        parent.updateTab({ title: $("#EAF_NAME").textbox('getValue') });
    	                	})
    	                }
    	            }); 
    	        	return;
            	}else{
            		$.messager.alert('提示', result.EAF_ERROR);
            		return;                		           		
            	}             
      	 	}
            //更新页面数据
            var ifmtree = parent.frames["ifm8A0553ADAE0DEFB9299263A63E463655"];
            eaf.getIframWin(ifmtree).eaftree.reload(objid);
            parent.updateTab({ title: $("#EAF_NAME").textbox('getValue') });
        });       
    }
    //返回选择行数据
    function getResult() {
        return divform.serializeObject();
    };
    //打开“界面”
    function uie_frm_clsui()
    {
        window.open(eaf.getEafAppPath() + '/main/DataModel/ClsUI.jsp?clsid=01CA6C0A56BD451DA50806E617C5E347&uiid=B77C8CD23AE4EF5DBBD243579F82C9A9&id=' + objid + '&arg=' + arg);
    }
    //打开“操作”
    function uie_frm_clsoper() {
        window.open(eaf.getEafAppPath() + '/main/DataModel/ClsOper.jsp?clsid=F2634390A9D3C5316C1676783C0C0D43&uiid=B77C8CD23AE4EF5DBBD243579F82C9A9&fromclsid=' + objid);
    }
</script>
<%@ include file='/main/footer.jsp' %>
