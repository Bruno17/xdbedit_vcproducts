<div id="tv{$tv->id}-tree"></div>
<input type="hidden" name="shopid" value="{$tvconfig.shop}"/>
<script type="text/javascript">
// <![CDATA[
{literal}
		    var tree{/literal}{$tv->id}{literal} = new Ext.tree.TreePanel({
		    dataUrl: '{/literal}{$tvconfig.connectorUrl}{literal}?action=mgr/products/getnodes&productId={/literal}{$tvconfig.productId}{literal}&shop={/literal}{$tvconfig.shop}{literal}&sku={/literal}{$tvconfig.sku}{literal}',
			border: false,
	        autoScroll: true,
	        animate: false,
			renderTo: {/literal}'tv{$tv->id}-tree'{literal},
	        height: 150,
	        anchor: '100%',
	        autoHeight: true,
	        enableDD: true,
	        useArrows: true,
	        fieldLabel: 'Categories',
	        containerScroll: true,
			root: {
		        nodeType: 'async',
		        text: 'Webshop root',
		        draggable: false,
		        id: 'category:0|parent:0'
		    },
		    listeners: {
		    	expandnode: function() {
		    		if ('{/literal}{$tvconfig.sku}{literal}' != '') {
			    		var checkBoxes = Ext.query('input[class*=x-tree-node-cb]');
			    		
			    		Ext.each(checkBoxes, function(item) {
			    			item.setAttribute('disabled', 'disabled');
			    		});
		    		}
		    	},
		    	checkchange: {
		    		scope: this,
		    		fn: function(node, checked) {
		    			var id = node.id;
						var prodid = '{/literal}{$tvconfig.productId}{literal}';
						
						if (prodid == '' || prodid == 'neu' || prodid == 'new'){
                            var _this=this;
							node.ui.checkbox.checked = false;
		                    Ext.Msg.confirm(_('warning') || '','Save Item as new Product?' || '',function(e) {
                            if (e == 'yes') {
			                    var formpanel=Ext.getCmp('xdbedit-panel-object');
								formpanel.reloadnew = true;
								formpanel.submit();
								//console.log(formpanel);     
                            }
                            }),this;
							
						}
						else {
						 MODx.Ajax.request({
							url: '{/literal}{$tvconfig.connectorUrl}{literal}',
							params: {
								action: 'mgr/products/updatecategory',
								prodid: prodid,
								shopid: '{/literal}{$tvconfig.shop}{literal}',
								catid: id,
								checked: checked
							},
							scope: this,
							success: function(response) {
								var responseObject = Ext.decode(response.responseText);
								
								if (!responseObject.success) {
									Ext.Msg.alert('Error', 'A product must have <b>at least one</b> linked category.');
									node.getUI().toggleCheck(true);
								}
							}
						});							
						} 
						
		    			

		    		}	
		    	}
		    }
		});
		
		tree{/literal}{$tv->id}{literal}.getRootNode().expand();
{/literal}
// ]]>
</script>		