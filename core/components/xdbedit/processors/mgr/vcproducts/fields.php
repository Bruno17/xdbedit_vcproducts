<?php

$config=$modx->xdbedit->customconfigs;
//$prefix = $config['prefix'];
$prefix = null;
$packageName = $config['packageName'];
$tablename = $config['tablename'];

$packagepath = $modx->getOption('core_path') . 'components/'.$packageName.'/';
$modelpath = $packagepath.'model/';

$modx->addPackage($packageName,$modelpath,$prefix);
$classname = $modx->xdbedit->getClassName($tablename);
$classname = $config['classname'];

if ($this->modx->lexicon)
{
    $this->modx->lexicon->load($packageName.':default');
}

if (empty($scriptProperties['object_id'])||$scriptProperties['object_id']=='neu') {
	$object = $modx->newObject($classname);
	$object->set('object_id','neu');
}
else
{
    $c = $modx->newQuery($classname, $scriptProperties['object_id']);

    $c->select('
        `'.$classname.'`.*,
    	`'.$classname.'`.`id` AS `object_id`
    ');
    $object = $modx->getObject($classname, $c);
}

//$object->set('pictures',$modx->toJSON($object->get('pictures')));
echo $object->get('name');
echo $object->get('pictures');

$modx->xdbedit->shopid=$scriptProperties['shop'];