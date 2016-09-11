# 1
- 验证框easyui————required（默认是false）写在editor-options中；
# 2
- 下拉框的高度：editor-options-panelHeight 来设置；
- 下拉框中的值选择到列表中：用formatter与editor配合使用，其中formatter:productFormatter下面写个函数  如下：function productFormatter(value){
                    for(var i=0; i<products.length; i++){
                        if (products[i].productid == value) return products[i].name;
                    }
                    return value;
                };
                editor里面要这么写；与之对应；
                editor:{
                		type:'combobox',
                		options:{
                            valueField:'productid',
                            textField:'name',
                            data:products,
                            required:false,
                            panelHeight:62
                			}
                		};

# 3
- 输入框为number时候的精确值，在行内的话可以在data-options中的editor里的options里的precision：1 。如：editor:{type:'numberbox',options:{precision:1}}
# 4
- 待完成!!!
