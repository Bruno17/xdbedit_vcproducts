<?php

//if (!$modx->hasPermission('quip.comment_approve')) return $modx->error->failure($modx->lexicon('access_denied'));
$config=$modx->xdbedit->customconfigs;
$prefix = null;
$packageName = $config['packageName'];
$tablename = $config['tablename'];

$packagepath = $modx->getOption('core_path') . 'components/'.$packageName.'/';
$modelpath = $packagepath.'model/';

$modx->addPackage($packageName,$modelpath,$prefix);
//$classname = $modx->xdbedit->getClassName($tablename);
$classname = $config['classname'];

if (empty($scriptProperties['objects'])) {
    return $modx->error->failure($modx->lexicon('quip.comment_err_ns'));
}

$objectIds = explode(',',$scriptProperties['objects']);
$now=time();
foreach ($objectIds as $id) {
    $object = $modx->getObject($classname,$id);
    if ($object == null) continue;

switch ($scriptProperties['task']) {
	case 'publish':
        $object->set('active','1');
        //$object->set('publishedon',strftime('%Y-%m-%d %H:%M:%S'));
        //$object->set('publishedby',$modx->user->get('id'));
		    $unpub=$object->get('unpublishdate');
		    $unpub=strtotime($unpub);
			//echo (time()).' ';
			if($unpub<$now){
		        $object->set('unpublishdate','');
		    }			    		  
	    break;
	case 'delete':
        $object->set('deleted','1');
        //$object->set('deletedon',strftime('%Y-%m-%d %H:%M:%S'));
        //$object->set('deletedby',$modx->user->get('id'));  
	    break;				
	case 'unpublish':
        //$object->set('unpublishedon', strftime('%Y-%m-%d %H:%M:%S'));
        $object->set('active', '0');
		//$object->set('unpublishedby',$modx->user->get('id'));//feld fehlt noch
		    $pub=$object->get('publishdate');
		    $pub=strtotime($pub);
			//echo (time()).' ';
			if($pub<$now){
		        $object->set('publishdate','');
		    }			    
	    break;		
    default:
	break;
	}

    if ($object->save() === false) {
        return $modx->error->failure($modx->lexicon('quip.comment_err_save'));
    }
}

return $modx->error->success();
