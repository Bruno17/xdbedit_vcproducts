<?php

if (!$modx->user->isAuthenticated('mgr')) return $modx->error->failure($modx->lexicon('permission_denied'));
$config=$modx->xdbedit->customconfigs;
$packageName = $config['packageName'];
$packagepath = $modx->getOption('core_path') . 'components/'.$packageName.'/';
$modelpath = $packagepath.'model/';

$modx->addPackage($packageName,$modelpath);
$shops = $modx->getCollection('vcShop');
        
$list = array(array('name'=>'all','id'=>'all'));
foreach ($shops as $shop) {
	$shopArray = $shop->toArray();
    $list[] = $shopArray;
}

return $this->outputArray($list, sizeof($list));