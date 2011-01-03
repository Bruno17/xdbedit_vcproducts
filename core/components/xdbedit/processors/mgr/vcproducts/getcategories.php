<?php

if (!$modx->user->isAuthenticated('mgr')) return $modx->error->failure($modx->lexicon('permission_denied'));
$config=$modx->xdbedit->customconfigs;
$packageName = $config['packageName'];
$packagepath = $modx->getOption('core_path') . 'components/'.$packageName.'/';
$modelpath = $packagepath.'model/';

$modx->addPackage($packageName,$modelpath);

if (!isset($modx->visioncart) || $modx->visioncart == null) {
	$modx->addPackage('visioncart', $modelpath);
    $modx->visioncart = $modx->getService('visioncart', 'VisionCart', $modelpath.'visioncart/');	
}



//, array('parent' => (int) $_REQUEST['parent'], 'shopid' => $_REQUEST['shopId'])

$shopId = $modx->getOption('shop',$scriptProperties,'all');
$categories=array(array('name'=>'all','id'=>'all'));
//$categories = $all;

function getCategoryChilds($config,$level=0){
    global $modx;
	$vc =& $modx->visioncart;
    $parentcategories = $vc->getCategories($config['shopId'],$config);
	$categories = array();
	if (count($parentcategories)>0){
		$childs=array();
		$level++;
		foreach ($parentcategories as $category){
			$childIds=array($category['id']);
			$category['name'] = str_repeat('-',$level-1).$category['name'];
			$config['parent'] = $category['id'];
			$childs = getCategoryChilds($config,$level);		
			if (count($childs)>0){
				foreach ($childs as $child){
					$childIds[]=$child['id'];
				}
			}
			$category['catIds']=implode(',',$childIds);
			$categories[] = $category; 
			$categories = array_merge($categories,$childs);
		}
	}
	
    return $categories;	
}

if ($shopId != 'all'){
    $config['asArray'] = true;
    $config['parent'] = 0;
    $config['shopId'] = $shopId;
    $childs = getCategoryChilds($config);
	$categories = array_merge($categories,$childs);
}	



/* 
$categories = $modx->getCollection('vcCategory'); 
$list = array();
$list[]=array('name'=>'all','id'=>'all');
foreach ($categories as $category) {
	$categoryArray = $category->toArray();
    $list[] = $categoryArray;
}
*/
return $this->outputArray($categories, sizeof($categories));

/*
({"total":"4","results":[
{"name":"all","id":"all"},
{"id":3,"shopid":1,"name":"1-Testschmuck","alias":"testschmuck","description":"Schmucktest","parent":0,"sort":1,"config":{"chunk":0,"resource":0},"customfields":{"laenge":{"type":"textfield","mandatory":0,"values":""},"breite":{"type":"textfield","mandatory":0,"values":""}},"pricechange":0,"pricepercent":false,"active":true},
{"id":4,"shopid":1,"name":"1-Steine","alias":"steine","description":"","parent":0,"sort":0,"config":{"chunk":0,"resource":0},"customfields":"","pricechange":0,"pricepercent":false,"active":true,"0":
{"id":7,"shopid":1,"name":"2-Amethyste","alias":"amethyste","description":"","parent":4,"sort":0,"config":{"chunk":0,"resource":0},"customfields":"","pricechange":0,"pricepercent":false,"active":true,"0":
{"id":9,"shopid":1,"name":"3-runde Amethyste","alias":"runde-amethyste","description":"","parent":7,"sort":0,"config":{"chunk":0,"resource":0},"customfields":"","pricechange":0,"pricepercent":false,"active":true}},"1":
{"id":10,"shopid":1,"name":"2-Turmaline","alias":"turmaline","description":"","parent":4,"sort":0,"config":{"chunk":0,"resource":0},"customfields":"","pricechange":0,"pricepercent":false,"active":true}},
{"id":8,"shopid":1,"name":"1-wachsmodelle","alias":"wachsmodelle","description":"","parent":0,"sort":0,"config":{"chunk":0,"resource":0},"customfields":"","pricechange":0,"pricepercent":false,"active":true}]})
*/