
function miObjectMethodInfo(servicename , servicevalue, callback)
{
	this.servicename = servicename;
	this.servicevalue = servicevalue;
	this.callback = new Array();

	if(callback != null && typeof callback != 'undefined')
	{
		this.callback[this.callback.length] = callback;
	}
	
}
miObjectMethodInfo.prototype.addCallback = function(callback)
{

	var index = 0;
	for(index = 0 ; index < this.callback.length ; index++)
	{
		if(this.callback[index] === callback)
		{
			return false;
		}
	}
	this.callback[this.callback.length] = callback;
	return true;
}

function miObjectMethodFilter(){
	this.filterMethodMap = new Array();
}

miObjectMethodFilter.prototype.find = function(servicename,filterobjectname)
{
	for(var info in this.filterMethodMap)
	{
		if(info.servicename == servicename && info.filterobjectname == filterobjectname)
		{
			return true;
		}
	}
	return false;
}
miObjectMethodFilter.prototype.queryObjectMethodindex = function(servicename, servicevalue)
{

	var index;
	var filterobj = null;

	for	(index = 0; index < this.filterMethodMap.length; index++)
	{
		filterobj = this.filterMethodMap[index];
	  	
      	if(filterobj.servicename == servicename && filterobj.servicevalue == servicevalue)
      	{
          		return index;
      	}
    	
	}
	return -1;
}

miObjectMethodFilter.prototype.queryObjectMethod = function(servicename, servicevalue)
{

	var selected = -1; 
  	var index;
	var filterobj = null;

	for	(index = 0; index < this.filterMethodMap.length; index++)
	{
		filterobj = this.filterMethodMap[index];
	  	
      	if(filterobj.servicename == servicename && filterobj.servicevalue == servicevalue)
      	{
          		return filterobj;
      	}
    	
	}
	return null;
}

miObjectMethodFilter.prototype.removeFilterMethod = function(servicename, servicevalue)
{

	var selectedindex= queryObjectMethodindex(servicename, servicevalue);

	if(selectedobject !== -1 && typeof selectedobject !== 'undefined')
	{
		this.filterMethodMap.slice(selectedindex,1);
		return true;
	}

	return false;

}

miObjectMethodFilter.prototype.addFilterMethod = function(servicename, servicevalue, callback)
{


	var index;
	
	var filterobj = this.queryObjectMethod(servicename, servicevalue);
	if(filterobj != null)
	{ 
		return filterobj.addCallback(callback);
	}
	else
	{
  		var info  = new miObjectMethodInfo(servicename, servicevalue, callback);
  		this.filterMethodMap[this.filterMethodMap.length] = info;
  	}

}

miObjectMethodFilter.prototype.getFunction = function(object)
{
	var index;
	var filterobj = null;
	for	(index = 0; index < this.filterMethodMap.length; index++)
	{
		filterobj = this.filterMethodMap[index];
	  	if(object[filterobj.servicename] !== null || typeof object[filterobj.servicename] !== 'undefined')
    	{
      		if(object[filterobj.servicename] == filterobj.servicevalue)
      		{
          		return filterobj.callback;
      		}
    	}
	}
	
	return null;

}

miObjectMethodFilter.prototype.filter = function(object)
{
  
  var index;
  var func = this.getFunction(object);
  for(index = 0 ; index < func.length ; index++)
  {
  	func[index](object);
  }
}
