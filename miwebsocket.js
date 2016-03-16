

var PARSING_MODE_PROTO = 0;
var PARSING_MODE_JSON = 1;

var MI_LOG_NON = 0;
var MI_LOG_CONSOLE = 1;
var MI_LOG_FILE = 2;

var logmode = MI_LOG_NON;


var MI_SOCKET_NON = 0;
var MI_SOCKET_CONNECTED = 1;
var MI_SOCKET_CLOSE= 2;

function SETMILOGMODE(mode)
{
	logmode = mode;
}
function MILOG(obj)
{
	if(logmode == MI_LOG_CONSOLE)
	console.log(getMiTimeStamp() + " : " + obj);
}

function isNullorEmpty(value,lengthcheck)
{
	if(value === null || typeof value == 'undefined')
	{
		return true;
	}

	if(lengthcheck !== null && typeof lengthcheck != 'undefined' && lengthcheck === true)
	{
		if(typeof value !=="number")
		{
			if(value.length <=0)
			{
				return true;
			}
		}
	}

}
function addZero(x,n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
}
function getMiTimeStamp()
{
    var d = new Date();
    var x = document.getElementById("demo");
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    time = h + ":" + m + ":" + s + ":" + ms;
    return time;
}

function ConvertBlobtoArrayBuffer(blob, miws)
{
	MILOG("stat data convert blob to arraybuffer");
	
	var reader = new FileReader();

	reader.onload = function()
	{
  		var generatedBuffer = reader.result;
  		MILOG("end data convert blob to arraybuffer");
  		miws.onCallbackConvertBlob(generatedBuffer);
	};

	reader.readAsArrayBuffer(blob);
}
	
function miProtoProtocol()
{
	this.parsingmode = PARSING_MODE_PROTO;
	this.protoMessages = null;
	this.protoRoot = null;
}


miProtoProtocol.prototype.initProtobuffer = function(protofiles)
{
	if(isNullorEmpty(protofiles,true))
	{
		return false;
	}
	var builder = dcodeIO.ProtoBuf.newBuilder({ convertFieldsToCamelCase: true });

	for(i = 0 ; i < protofiles.length ; i++)
	{
		dcodeIO.ProtoBuf.loadProtoFile(protofiles[i], builder);
	}
	this.protoRoot = builder.build().Game.MI;

	return true;
};
miProtoProtocol.prototype.createNewObject = function()
{
	return new this.protoRoot();
}
miProtoProtocol.prototype.packagingProtobuffer = function(obj)
{
	var buffer = obj.encode();

	return buffer;
};

miProtoProtocol.prototype.parsingProtobuffer = function(buffer)
{
	var message =this.protoRoot.decode(buffer);

	return message;
};

miProtoProtocol.prototype.initBuilder = function(protofiles)
{
	if(this.parsingmode == PARSING_MODE_PROTO)
	{
		return this.initProtobuffer(protofiles);
	}
};
miJsonProtocol.prototype.packaging = function(obj)
{
	return this.packagingProtobuffer(obj);
};

miProtoProtocol.prototype.parsing = function(buffer)
{
	
	if(this.protoRoot !== null)
	{
		return this.parsingProtobuffer(buffer);
	}
	
};

function miJsonProtocol(mode)
{
	this.parsingmode = PARSING_MODE_JSON;
}



miJsonProtocol.prototype.packagingJson = function(obj)
{
	var json_str = JSON.stringify(myobject);

	return json;
};

miJsonProtocol.prototype.parsingJson = function(buffer)
{
	var json = JSON.parse(buffer);

	return json;
};


miJsonProtocol.prototype.initBuilder = function()
{
	if(JSON.parse != null || typeof JSON.parse != 'undefined')
	return true;

	return false;
};

miJsonProtocol.prototype.packaging = function(obj)
{
	return this.packagingJson(buffer);
};

miJsonProtocol.prototype.parsing = function(buffer)
{
	return this.parsingJson(buffer);
};



function miWebSocket(address){
	this.address = address;
	this.websocket = null;
	this.opencallback = null;
	this.closecallback = null;
	this.messagecallback = null;
	this.errorcallback = null;
	this.objectmessagecallback = null;
	this.protocol = null;
	this.methodfilter = null;
}

function callFunction()
{
	var func = arguments[0];

	if(isNullorEmpty(func))
		return;
	
	var argumentArray = new Array(null,null,null,null,null,null,null,null);
	
	for(i = 0 ; i < arguments.length ; i++)
	{
		argumentArray[i] = arguments[i];
	}
	if(func !== null && typeof func !== 'undefined')
		func(argumentArray[1],argumentArray[2],argumentArray[3],argumentArray[4],argumentArray[5],argumentArray[6],argumentArray[7],argumentArray[8]);

}

miWebSocket.prototype.setObjectMessageCallback = function(callback)
{
  if(callback !==null || typeof callback !='undefined')
	  this.objectmessagecallback = callback;
};

miWebSocket.prototype.setMethodFilter = function(filter)
{
	this.methodfilter = filter;
}

miWebSocket.prototype.setProtocol = function(proto)
{
	this.protocol  = proto;
}

miWebSocket.prototype.onOpen = function()
{
	MILOG("open websocket");
	callFunction(this.opencallback);
}

miWebSocket.prototype.onClose = function()
{
	MILOG("close websocket");
	callFunction(this.closecallback);
}

miWebSocket.prototype.onCallbackConvertBlob = function(data)
{
	MILOG("protobuffer parsing start");
	var obj = this.protocol.parsing(data);
	MILOG("protobuffer parsing end");
	if(this.objectmessagecallback !== null)
	{
		this.objectmessagecallback(obj);
	}

	this.filter(obj);
	MILOG("websocket complete received convert parsed data");
}
miWebSocket.prototype.filter = function(obj)
{
	if(this.methodfilter !== null && typeof this.methodfilter !== 'undefined')
	{
		this.methodfilter.filter(obj);
	}
}
miWebSocket.prototype.onMessage = function(evt)
{
	MILOG("websocket receive message");
	MILOG(evt);
	var miws = this.parent;
	MILOG("receive data from server time:");
	
	
	if(!isNullorEmpty(evt))
	{
		var data = evt.data;
		var object  = null;
		if(data instanceof Blob)
		{
			MILOG("receive data size: " + evt.data.size);
			ConvertBlobtoArrayBuffer(data , miws);
		}
		else
		{
			MILOG("receive data size: " + evt.data.length);
			MILOG("not protobuff parsing start");
			object = miws.protocol.parsing(data);
			MILOG("not protobuff parsing end");
			MILOG(object);
			miws.filter(object);
			
		}
		
	
		if(!isNullorEmpty(this.objectmessagecallback))
		{
			this.objectmessagecallback(object);
		}
	}

	callFunction(this.messagecallback);
}
miWebSocket.prototype.sendtext = function(message)
{
	this.websocket.send(message);
}
miWebSocket.prototype.send = function(obj)
{
	var buffer = this.protocol.packaging(obj);
	this.websocket.send(buffer);

}

miWebSocket.prototype.onError = function(evt)
{
	MILOG("error websocket");
	callFunction(this.errorcallback,evt);
}

miWebSocket.prototype.initalize = function(open, close, message , error)
{
	MILOG("websocket initialize");
	if ("WebSocket" in window)
    {
    	this.websocket = new WebSocket(this.address);
    	this.opencallback = open;
		this.closecallback = close;
		this.messagecallback = message;
		this.errorcallback = error;

		this.websocket.onopen = this.onOpen;
		this.websocket.onerror = this.onError;
		this.websocket.onmessage = this.onMessage;
		this.websocket.onclose = this.onClose;
		this.websocket.parent = this;
		MILOG("websocket initialize success");
		return true;
    }
   
    return false;
}


