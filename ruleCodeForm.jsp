<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/main/UserInterface/form.js" type="text/javascript"></script>
    <form id="ruleForm" action="" style="margin:20px 0px 20px 0px;font-size:12px">
    <div style="padding:5px;">
    <label for="ruleName" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;规则名称：</label>
    <input id="ruleName" class="easyui-validatebox" type="text" name="ruleName" style="width:180px">
    </div>
    <div style="padding:5px;">
    <label for="mainCode" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;是否为主编码：</label>
    <input id="mainCode" type="checkbox" name="mainCode">
    </div>
    <div style="padding:5px;">
    <label for="bornStyle" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;生成方式：</label>
    <select id="bornStyle" class="easyui-combobox"  name="bornStyle" style="width:185px;" data-options="panelHeight:42,valueField:'label',
    textField: 'value',
    data: [{
    label: '0',
    value: '自动',
    selected:true
    },{
    label: '1',
    value: '手动'
    }]">
    </select>
    </div>
    <div style="padding:5px;">
    <label for="bornPublish" style="margin-left:50px;width:110px;display:inline-block">是否在发布时生成：</label>
    <input id="bornPublish" type="checkbox" name="bornPublish">
    </div>
    <div style="padding:5px;">
    <label for="example" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;编码样例：</label>
    <input id="example" class="easyui-validatebox" type="text" style="width:180px">
    </div>
    </form>
    <!--上面是input checkbox|| 下面是datadgrid-->
    <div class="easyui-panel" style="width:585px;height:250px;">
     <table id="ruleGrid" style="width:575px;position:" data-options="singleSelect:true,idField:'itemid'">
    </table>
    </div>
    <div id="waterGrid" closed="true">
    <form style="margin: 15px 0px 0px 30px">
    <div style="margin-top:7px">&nbsp;初始值：<input id="wgInit" type="text" style="text-align:center"></div>
    <div style="margin-top:7px">&nbsp;&nbsp;长度：<input id="wgLength" type="text"  style="text-align:center"></div>
    <div style="margin-top:7px">&nbsp;&nbsp;步长：<input id="wgStep" type="text"  style="text-align:center"></div>
    <div style="margin-top:7px">最后流水：<input id="wgLast" type="text"  style="text-align:center"></div>
    </form>
    </div>
<script type="text/javascript" src="ruleCodeForm.js"></script>
<%@ include file='/main/footer.jsp' %>