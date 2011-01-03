<?php
/**
 * @package modx
 * @subpackage processors.element.tv.renders.mgr.input
 */
$this->xpdo->lexicon->load('tv_widget');

$tvconfig['connectorUrl']=$this->xpdo->getOption('assets_url').'components/visioncart/connector.php';
$tvconfig['productId']=$_REQUEST['object_id'];
$tvconfig['shop']=$_REQUEST['shop'];
$tvconfig['sku']='';

$this->xpdo->smarty->assign('tvconfig',$tvconfig);
$this->xpdo->smarty->assign('tvitems',$items);
return $this->xpdo->smarty->fetch('element/tv/renders/input/vccategorytree.tpl');















