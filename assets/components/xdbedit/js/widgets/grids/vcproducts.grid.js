Xdbedit.grid.Object = function(config) {
    config = config || {};
    this.sm = new Ext.grid.CheckboxSelectionModel();
	Ext.applyIf(config,{
        url: Xdbedit.config.connector_url
        ,baseParams: { 
		    action: 'mgr/xdbedit/getList',
			shop: 'all',
			configs: config.configs}
        ,fields: ['id','shopid','name','articlenumber','active','deleted']
        ,paging: true
		,autosave: false
        ,remoteSort: true
        ,primaryKey: 'id'
		,isModified : false
        ,sm: this.sm		
        ,columns: [this.sm,{
            header: 'id'
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 50
        },{
            header: 'Shop'
            ,dataIndex: 'shopid'
            ,sortable: true
            ,width: 80
        },{
            header: 'Name'
            ,dataIndex: 'name'
            ,sortable: true
            ,width: 200
        },{
            header: 'Articlenumber'
            ,dataIndex: 'articlenumber'
            ,sortable: true
            ,width: 300
        },{
            header: 'Active'
            ,dataIndex: 'active'
            ,sortable: true
            ,width: 200
        }]
,tbar: [{
				xtype: 'buttongroup',
				id: 'filter-buttongroup',
				title: 'Filter',
				columns: 8,
				defaults: {
					scale: 'large'
				},
				items: [{
					text: 'Shop:'
				}, {
					xtype: 'xdbedit-combo-shop',
					id: 'xdbedit-filter-shop',
					itemId: 'shop',
					value: 'all',
					width: 120,
					listeners: {
						'select': {
							fn: this.changeShop,
							scope: this
						}
					}
				},{
					text: 'Category:'
				}, {
					xtype: 'xdbedit-combo-category',
					id: 'xdbedit-filter-category',
					itemId: 'category',
					value: 'all',
					width: 120,
					listeners: {
						'select': {
							fn: this.changeCategory,
							scope: this
						}
					}
				}]
			}, {
				xtype: 'buttongroup',
				title: 'Actions',
				columns: 3,
				defaults: {
					scale: 'large'
				},
				items: [{
					text: _(Xdbedit.customconfigs.task + '.bulk_actions') || _('xdbedit.bulk_actions'),
					menu: [{
						text: _(Xdbedit.customconfigs.task + '.publish_selected') || _('xdbedit.publish_selected'),
						handler: this.publishSelected,
						scope: this
					}, {
						text: _(Xdbedit.customconfigs.task + '.unpublish_selected') || _('xdbedit.unpublish_selected'),
						handler: this.unpublishSelected,
						scope: this
					}, {
						text: _(Xdbedit.customconfigs.task + '.delete_selected') || _('xdbedit.delete_selected'),
						handler: this.deleteSelected,
						scope: this
					}]
				},{
                    text: _(Xdbedit.customconfigs.task + '.show_trash') || _('xdbedit.show_trash')
                    ,handler: this.toggleDeleted
                    ,enableToggle: true
                    ,scope: this
        },{
                    text: _(Xdbedit.customconfigs.task+'.create')||_('xdbedit.create')
                    ,handler: this.createObject
                    ,scope: this
        }]
			
			}]     
		,viewConfig: {
            forceFit:true,
            //enableRowBody:true,
            //showPreview:true,
            getRowClass : function(rec, ri, p){
                var cls = 'xdbedit-object';
                if (!rec.data.active) cls += ' xdbedit-unpublished';
                if (rec.data.deleted) cls += ' xdbedit-deleted';

                return cls;
            }
        }
    });
	
    Xdbedit.grid.Object.superclass.constructor.call(this,config)
	this.getStore().on('load',this.onStoreLoad,this);
};
Ext.extend(Xdbedit.grid.Object,MODx.grid.Grid,{
    _renderUrl: function(v,md,rec) {
        return '<a href="'+v+'" target="_blank">'+rec.data.pagetitle+'</a>';
    }
    ,editObject: function() {
		formpanel=Ext.getCmp('xdbedit-panel-object');
        formpanel.autoLoad.params.object_id=this.menu.record.id;
		formpanel.autoLoad.params['shop']=this.menu.record.shopid;
		formpanel.doAutoLoad();
		
		//location.href = '?a='+MODx.request.a+'&action=editorpage&object_id='+this.menu.record.id;
    }
    ,createObject: function() {
		var shop = this.getStore().baseParams['shop'];
		if ( shop == 'all'){
		    Ext.Msg.alert(_('warning'), 'Filter by shop before create new products!');
		}
		else{
		    formpanel=Ext.getCmp('xdbedit-panel-object');
            formpanel.autoLoad.params.object_id='neu';
		    formpanel.autoLoad.params['shop']=shop;
		    formpanel.doAutoLoad();		
            //location.href = '?a='+MODx.request.a+'&action=editorpage&object_id=neu';			
		}

    }
	,publishObject: function() {
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/xdbedit/update'
				,task: 'publish'
                ,object_id: this.menu.record.id
				,configs: this.config.configs
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }
	,deleteObject: function() {
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/xdbedit/update'
				,task: 'delete'
                ,object_id: this.menu.record.id
				,configs: this.config.configs
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    },recallObject: function() {
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/xdbedit/update'
				,task: 'recall'
                ,object_id: this.menu.record.id
				,configs: this.config.configs
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    },removeObject: function() {
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/'+Xdbedit.customconfigs.task+'/remove'
				,task: 'removeone'
                ,object_id: this.menu.record.id
				,configs: this.config.configs
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }		
	,unpublishObject: function() {
 		MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/xdbedit/update'
				,task: 'unpublish'
                ,object_id: this.menu.record.id
				,configs: this.config.configs
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    },toggleDeleted: function(btn,e) {
        var s = this.getStore();
        if (btn.pressed) {
            s.setBaseParam('showtrash',1);
            btn.setText(_(Xdbedit.customconfigs.task + '.show_normal') || _('xdbedit.show_normal'));
        } else {
            s.setBaseParam('showtrash',0);
            btn.setText(_(Xdbedit.customconfigs.task + '.show_trash') || _('xdbedit.show_trash'));
        }
        this.getBottomToolbar().changePage(1);
        s.removeAll();
        this.refresh();
    }
	,getSelectedAsList: function() {
        var sels = this.getSelectionModel().getSelections();
        if (sels.length <= 0) return false;

        var cs = '';
        for (var i=0;i<sels.length;i++) {
            cs += ','+sels[i].data.id;
        }
        cs = Ext.util.Format.substr(cs,1,cs.length-1);
        return cs;
    },publishSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;
        
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/'+Xdbedit.customconfigs.task+'/bulkupdate'
				,configs: this.config.configs
				,task: 'publish'
                ,objects: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    },unpublishSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;
        
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/'+Xdbedit.customconfigs.task+'/bulkupdate'
				,configs: this.config.configs
				,task: 'unpublish'
                ,objects: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    },deleteSelected: function(btn,e) {
        var cs = this.getSelectedAsList();
        if (cs === false) return false;
        
        MODx.Ajax.request({
            url: this.config.url
            ,params: {
                action: 'mgr/'+Xdbedit.customconfigs.task+'/bulkupdate'
				,configs: this.config.configs
				,task: 'delete'
                ,objects: cs
            }
            ,listeners: {
                'success': {fn:function(r) {
                    this.getSelectionModel().clearSelections(true);
                    this.refresh();
                },scope:this}
            }
        });
        return true;
    }
	,changeShop: function(cb,nv,ov) {
        this.setFilterParams({
			shop:cb.getValue()
		});      		
    }
	,changeCategory: function(cb,nv,ov) {
        this.setFilterParams({
			category:cb.getValue()
		});      		
    }	
   ,onStoreLoad: function() {

        this.isModified=false;
        /*
		var s = this.getStore();
        if (s) {
            //if (y) {s.baseParams['year'] = y;}
            //if (m) {s.baseParams['month'] = m || 'all';}
            //s.removeAll();
        }
        */
        //this.getBottomToolbar().changePage(1);
        //this.refresh();
    }
    ,setFilterParams: function(params) {
        var tb = this.getTopToolbar();
        if (!tb) {return false;}
        var ccb = null;

        if (params.shop) {
			params.category = params.category||'all';
			Ext.getCmp('xdbedit-filter-shop').setValue(params.shop);
            //ycb = tb.getComponent('year');
			
			ccb = Ext.getCmp('xdbedit-filter-category');
            if (ccb) {
                ccb.store.baseParams['shop'] = params.shop;
                ccb.store.load({
                    callback: function() {
                        ccb.setValue('all');
                    }
                });
            }	
        } 
        if (params.category) {
            params.month = params.month||'all';
			params.year = params.year||'all';
			Ext.getCmp('xdbedit-filter-category').setValue(params.category);

        } 
        

        var s = this.getStore()
        if (s) {
			if (params.shop) {s.baseParams['shop'] = params.shop ;}
            if (params.category) {s.baseParams['categories'] = params.category ;}			
            s.removeAll();
        }
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,getMenu: function() {
        //this.store.on('load', this.reloadDateCombos(this)); 
		//console.log(this.store);
		var n = this.menu.record; 
        //var cls = n.cls.split(',');
        var m = [];
        m.push({
            text: _(Xdbedit.customconfigs.task+'.edit')||_('xdbedit.edit')
            ,handler: this.editObject
        });
        m.push('-');
        m.push({
            text: _(Xdbedit.customconfigs.task+'.create')||_('xdbedit.create')
            ,handler: this.createObject
        });
        m.push('-');
        if (n.active == 0) {
            m.push({
                text: _(Xdbedit.customconfigs.task+'.publish')||_('xdbedit.publish')
                ,handler: this.publishObject
            })
        } else if (n.active == 1) {
            m.push({
                text:_(Xdbedit.customconfigs.task+'.unpublish')||_('xdbedit.unpublish')
                ,handler: this.unpublishObject
            });
        }
        m.push('-');
        if (n.deleted == 1) {
        m.push({
            text: _(Xdbedit.customconfigs.task+'.recall')||_('xdbedit.recall')
            ,handler: this.recallObject
        });
		m.push('-');
        m.push({
            text: _(Xdbedit.customconfigs.task+'.remove')||_('xdbedit.remove')
            ,handler: this.removeObject
        });						
        } else if (n.deleted == 0) {
        m.push({
            text: _(Xdbedit.customconfigs.task+'.delete')||_('xdbedit.delete')
            ,handler: this.deleteObject
        });		
        }		
		
        this.addContextMenuItem(m);
    }
});
Ext.reg('xdbedit-grid-objects',Xdbedit.grid.Object);


Xdbedit.combo.Shop = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        name: 'shop'
        ,hiddenName: 'shop'
        ,forceSelection: true
        ,typeAhead: false
        ,editable: false
        ,allowBlank: false
        ,listWidth: 300		
		,resizable: false
        ,pageSize: 0		
        ,url: Xdbedit.config.connector_url
        ,fields: ['id','name']
        ,displayField: 'name'
        ,valueField: 'id'
        ,baseParams: {
		    action: 'mgr/'+Xdbedit.customconfigs.task+'/getshops',
			configs: Xdbedit.config.configs,
        }
    });
    Xdbedit.combo.Shop.superclass.constructor.call(this,config);
};
Ext.extend(Xdbedit.combo.Shop,MODx.combo.ComboBox);
Ext.reg('xdbedit-combo-shop',Xdbedit.combo.Shop);

Xdbedit.combo.Category = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        name: 'category'
        ,hiddenName: 'category'
        ,forceSelection: true
        ,typeAhead: false
        ,editable: false
        ,allowBlank: false
        ,listWidth: 300		
		,resizable: false
        ,pageSize: 0		
        ,url: Xdbedit.config.connector_url
        ,fields: ['catIds','name']
        ,displayField: 'name'
        ,valueField: 'catIds'
        ,baseParams: {
		    action: 'mgr/'+Xdbedit.customconfigs.task+'/getcategories',
			configs: Xdbedit.config.configs,
        }
    });
    Xdbedit.combo.Category.superclass.constructor.call(this,config);
};
Ext.extend(Xdbedit.combo.Category,MODx.combo.ComboBox);
Ext.reg('xdbedit-combo-category',Xdbedit.combo.Category);