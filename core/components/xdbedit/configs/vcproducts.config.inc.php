<?php
        
        /*
         * the packageName where you have your classes
         * this can be used in processors
         */        
        $this->customconfigs['packageName']='visioncart';
        $this->customconfigs['classname']='vcProduct';
        /*
         * the table-prefix for your package
         */
		$this->customconfigs['prefix']='';
        /*
         * the tablename of the maintable
         * this can be used in processors - see example processors
         */
		//$this->customconfigs['tablename']='mediaman_items';
		/*
		 * xdbedit-taskname
		 * xdbedit uses the grid and the processor-pathes with that name
		 */
		$this->customconfigs['task']='vcproducts';
        /*
         * the caption of xdbedit-form
         */		
		$this->customconfigs['formcaption']='Produkt Item';
		/*
		 * the tabs and input-fields for your xdbedit-page
		 * outerarray: caption for Tab and fields
		 * innerarray of fields:
		 * field - the tablefield
		 * caption - the form-caption for that field
		 * inputTV - the TV which is used as input-type
		 * without inputTV or if not found it uses text-type
		 * 
		 */
		if (!empty($this->shopid)){
		$this->customconfigs['tabs']=			
			array(
                array(
                    'caption'=>'Info',
                    'fields'=>array(
                    array(
                        'field'=>'name',
                        'caption'=>'Name'
                    ),
                    array(
                        'field'=>'alias',
                        'caption'=>'Alias',
                    ),
					array(
                        'field'=>'ow_alias',
                        'caption'=>'Alias',
						'inputTV'=>'overwrite'
                    ),
                    array(
                        'field'=>'articlenumber',
                        'caption'=>'Article Number'
                    ),
                    array(
                        'field'=>'productcategories',
                        'caption'=>'Categories',
                        'inputTV'=>'productcategories'
                    ))),
                array(
                    'caption'=>'Publishing',
                    'fields'=>array(
                    array(
                        'field'=>'publishdate',
                        'caption'=>'Publish on',
						'inputTV'=>'datum'
                    ),array(
                        'field'=>'unpublishdate',
                        'caption'=>'Unpublish on',
						'inputTV'=>'datum'
                    ),
                    array(
                        'field'=>'active',
                        'caption'=>'Active',
						'inputTV'=>'news_published'
                 ))),
                array(
                    'caption'=>'Images',
                    'fields'=>array(
                    array(
                        'field'=>'images',
                        'caption'=>'Images',
						'inputTV'=>'multiitemsgrid'
                    ))));
		}		
		
		

/*);

/*
* here you can load your package(s) or in the processors
* 
*/
/*
$prefix = $this->customconfigs['prefix'];
$packageName = $this->customconfigs['packageName'];
       
$packagepath = $modx->getOption('core_path') . 'components/'.$packageName.'/';
$modelpath = $packagepath.'model/';

$modx->addPackage($packageName,$modelpath,$prefix);
$classname = $this->getClassName($tablename);

if ($this->modx->lexicon)
{
    $this->modx->lexicon->load($packageName.':default');
}
*/			