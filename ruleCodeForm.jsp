<%@ include file='/main/head.jsp' %>
    <form id="ruleForm" action="" style="margin:20px 0px 20px 0px">
    <div style="padding:5px;">
    <label for="ruleName" style="margin-left:50px;width:110px;display:inline-block">RuleName:</label>
    <input class="easyui-validatebox" type="text" name="ruleName" style="width:180px">
    </div>
    <div style="padding:5px;">
    <label for="mainCode" style="margin-left:50px;width:110px;display:inline-block">isMainCode:</label>
    <input class="easyui-validatebox" type="checkbox" name="mainCode">
    </div>
    <div style="padding:5px;">
    <label for="mainCode" style="margin-left:50px;width:110px;display:inline-block">bornStyle:</label>
    <select id="cc" class="easyui-combobox" name="buildAction" style="width:185px;" data-options="panelHeight:42">
    <option>auto</option>
    <option>manual</option>
    </select>
    </div>
    <div style="padding:5px;">
    <label for="bornPublish" style="margin-left:50px;width:110px;display:inline-block">generate:</label>
    <input class="easyui-validatebox" type="checkbox" name="bornPublish">
    </div>
    <div style="padding:5px;">
    <label for="example" style="margin-left:50px;width:110px;display:inline-block">CodeSample:</label>
    <input class="easyui-validatebox" type="text" style="width:180px">
    </div>
    </form>
    <!--上面是input checkbox|| 下面是datadgrid-->
    <table id="ruleGrid" style="width:582px;position:" data-options="singleSelect:true,idField:'itemid'">

    </table>
    <div id="dg1" closed="true">
    <form style="margin: 15px 0px 0px 30px">
    <div style="margin-top:7px">&nbsp;star:<input type="text" style="text-align:center"></div>
    <div style="margin-top:7px">length:<input type="text"  style="text-align:center"></div>
    <div style="margin-top:7px">&nbsp;step:<input type="text"  style="text-align:center"></div>
    <div style="margin-top:7px">&nbsp; end:<input type="text"  style="text-align:center"></div>
    </form>
    </div>
<script type="text/javascript" src="ruleCodeForm.js"></script>
<%@ include file='/main/footer.jsp' %>