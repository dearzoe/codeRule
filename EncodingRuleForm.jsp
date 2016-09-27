<%@ include file='/main/head.jsp' %>
<script src="<%=eafapppath %>/main/UserInterface/control.js" type="text/javascript"></script>
<script src="<%=eafapppath %>/main/UserInterface/form.js" type="text/javascript"></script>
    <form id="eaf_rule_form" action="" style="margin:20px 0px 20px 0px;font-size:12px">
        <div style="padding:5px;">
            <label for="eaf_ruleName_form" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_ruleName")%>:</label>
            <input id="eaf_ruleName_form" class="easyui-validatebox" type="text" name="eaf_ruleName_form" style="width:180px">
        </div>
            <div style="padding:5px;">
            <label for="eaf_mainCode_form" style="margin-left:50px;width:110px;display:inline-block">&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_isMainCode")%>:</label>
            <input id="eaf_mainCode_form" type="checkbox" name="eaf_mainCode_form">
        </div>
        <div style="padding:5px;">
            <label for="eaf_bornStyle_form" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_bornStyle")%>:</label>
            <select id="eaf_bornStyle_form" class="easyui-combobox"  name="eaf_bornStyle_form" style="width:185px;">
            </select>
        </div>
        <div style="padding:5px;">
            <label for="eaf_bornPublish_form" style="margin-left:50px;width:110px;display:inline-block"><%= I18nHelper.GetLabel(request,"eaf_rule_generate")%>:</label>
            <input id="eaf_bornPublish_form" type="checkbox" name="eaf_bornPublish_form">
        </div>
        <div style="padding:5px;">
            <label for="eaf_example_form" style="margin-left:50px;width:110px;display:inline-block">&nbsp;&nbsp;&nbsp;&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_codeSample")%>:</label>
            <input id="eaf_example_form" class="easyui-validatebox" type="text" readonly="readonly" style="width:180px;">
            <a href="#" id="btn" iconCls="icon-search" onclick="codeSample()" style="height:21px;position:relative;top:-2px"></a>
        </div>
    </form>
    <div class="easyui-panel" style="width:585px;height:250px;">
        <table id="eaf_rule_grid" style="width:575px;position:" data-options="singleSelect:true,idField:'itemid'">
        </table>
    </div>
    <div id="rule_water_grid" closed="true">
        <form style="margin: 15px 0px 0px 30px">
            <div style="margin-top:7px">&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_star")%>:<input id="water_grid_init" type="text" style="text-align:center"></div>
            <div style="margin-top:7px">&nbsp;&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_length")%>:<input id="water_grid_length" type="text"  style="text-align:center"></div>
            <div style="margin-top:7px">&nbsp;&nbsp;<%= I18nHelper.GetLabel(request,"eaf_rule_step")%>:<input id="water_grid_step" type="text"  style="text-align:center"></div>
            <div style="margin-top:7px"><%= I18nHelper.GetLabel(request,"eaf_rule_end")%>:<input id="water_grid_last" type="text"  readonly="readonly" style="text-align:center"></div>
        </form>
    </div>
<script type="text/javascript" src="EncodingRuleForm.js"></script>
<%@ include file='/main/footer.jsp' %>