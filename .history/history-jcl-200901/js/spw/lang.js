/*----------------------------------------------------------------------------
 * Sparrow Framework Version 0.8(DEV)                                         
 * Copyright(c) 2006-2008, SW2 Software Laboratory & PST Inc.                 
 *                                                                            
 *--------------------------------------------------------------------------*/

(function() {

	/**
	 * SystemクラスのJavascriptオブジェクトを定義します。
	 *
	 */
	window.System = function(){};

	/**
	 * InstanceクラスのJavascriptオブジェクトを定義します。
	 *
	 */
	window.Instance = function(){};

	/**
	 * HashクラスのJavascriptオブジェクトを定義しておきます。
	 */ 
	window.Hash = function() {};

	/**
	 * MethodクラスのJavascriptオブジェクトを定義しておきます。
	 */ 
	window.Method = function() {
		var script = "new _$F(";
		for (var i=0;i<arguments.length;i++) {
			if (i>0) {
				script = script +",";
			}
			script = script + "'"+arguments[i]+"'";
		}
		script = script + ")";
		return eval(script);
	};

	/**
	 * オブジェクトタイプの定数を定義します。
	 */ 

	System.OT_CLASS 	= "class";
	System.OT_INSTANCE  = "instance";
	System.OT_METHOD 	= "method";
	System.OT_NAMESPACE = "namespace";
	System.OT_EXTERNAL 	= "external";
	System.OT_UNDEFINED = "undefined";


	/**
	 * オブジェクトのタイプを返します。
	 * @method objType
	 * @param  {Object} o   オブジェクト
	 * @return {String}  
	 */ 
	System.objType = function(o) {
		var type = typeof(o);
		if (type == "undefined") {
			return System.OT_UNDEFINED;
		}else if (type == "function") {
			if (o._className) {
				return System.OT_CLASS;
			} else {
				return System.OT_METHOD;
			}
		} else if (o._nsName) {
			return System.OT_NAMESPACE;
		} else if (o.getClass){
	 		return System.OT_INSTANCE;
		} else  {
			return System.OT_EXTERNAL;
		}
	};


	/**
	 * UNSUPPOREDMETHODエラーナンバー定数を定義します。
	 */ 
	Error.EN_UNSUPPOREDMETHOD = 0xA001;


	/**
	 * インスタンスのClassオブジェクトを返します。
	 * （システム用）
	 * @method getClass
	 * @param  
	 * @return {Class}  
	 */ 
	Object.prototype.getClass = function() {
		var ot = System.objType(this);
		if (ot == System.OT_INSTANCE) {
			var type = typeof(this);
			if (type == "number") {
				return Number;
			} else if (type == "string") {
				return String;
			} else if (type == "boolean") {
				return Boolean;
			} else if (this.constructor) {
				if (this.constructor == Object) {
					return Hash;
				} else {
					return this.constructor;
				}
			} else {
				return undefined;
			}
		} else if (ot == System.OT_CLASS){
			return Hash;
		} else if (ot == System.OT_NAMESPACE) {
			return Hash;
		} else if (ot == System.OT_METHOD) {
			return Method;
		} else {
			return undefined;
		}
	};


	/**
	 * クラスのClass名称を返します。
	 * （システム用）
	 * @method getClassName
	 * @param  
	 * @return {String}  
	 */ 
	Object.prototype.getClassName = function() {
		var ot = System.objType(this);
		if (ot == System.OT_CLASS){
			return this._className;
		} else {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"getClassName()");
		}
	};

	/**
	 * クラスのClass名称を返します。
	 * （システム用）
	 * @method getNsName
	 * @param  
	 * @return {String}  
	 */ 
	Object.prototype.getNsName = function() {
		var ot = System.objType(this);
		if (ot == System.OT_NAMESPACE){
			return this._nsName;
		} else {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"getNsName()");
		}
	};

	/**
	 * クラスの親クラスを返します。
	 * （システム用）
	 * @method getSuperc
	 * @param  
	 * @return {Class}  
	 */ 
	Object.prototype.getSuperc = function() {
		var ot = System.objType(this);
		if (ot == System.OT_CLASS){
			return this._superc;
		} else {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"getSuperc()");
		}
	};

	/**
	 * クラスの親クラスを返します。
	 * （システム用）
	 * @method inheritFrom
	 * @param  
	 * @return {Class}  
	 */ 
	Object.prototype.inheritFrom = function(c) {
		var ot = System.objType(this);
		if (ot == System.OT_CLASS){
			c1 = this.getSuperc();
			while (c1) {
				if (c1 == c) {
					return true;
				}
				c1 = c1.getSuperc();
			}
			return false;
		} else {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"inheritFrom()");
		}
	};

	/**
	 * インスタンスが指定されたクラス或いはそのクラスのサブクラスの
	 * インスタンスかどうかを返します。
	 * （システム用）
	 * @method instanceOf
	 * @param  {Class} c  指定されたクラス
	 * @return {Boolean}  
	 */ 
	Object.prototype.instanceOf = function(c) {
		var c1 = this.getClass();
		while (c1) {
			if (c1 == c) {
				return true;
			}
			c1 = c1.getSuperc();
		}
		return false;
	};

	/**
	 * オブジェクト作成直後の初期化を行います。
	 * @method _initialize
	 * @param  
	 * @return   
	 */ 
	Object.prototype._initialize = function () {
	};

	/**
	 * オブジェクト廃棄直前のクリーンアップを行います。
	 * @method _finalize
	 * @param  
	 * @return   
	 */ 
	Object.prototype._finalize  = function() {
	};


	/**
	 * インスタンスオブジェクトを廃棄します。
	 * （システム用）
	 * @method dispose
	 * @param  
	 * @return   
	 */ 
	Object.prototype.dispose = function () {
		var ot = System.objType(this);
		if (ot == System.OT_INSTANCE){
			this._finalize();
			this._disposed = true;
		} else {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"dispose()");
		}
	};

	/**
	 * JavascriptオブジェクトのFunctionのcall、applyメソッドを退避します。
	 */ 
	Function.prototype._call  = Function.prototype.call;
	Function.prototype._apply = Function.prototype.apply;


	/**
	 * メソッドを実行します。
	 * （システム用）
	 * Methodはこのメソッドをそのまま継承し、Classに対して
	 * このメソッドを呼び出すとエラーとなります。
	 * @method call
	 * @param  
	 * @return   
	 */
	 Function.prototype.call = function() {
		if (System.objType(this) != System.OT_METHOD) {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"call()");
		}
		var args = [];
		for (var i = 0; i<arguments.length;i++) {
			args.push(arguments[i]);
		}
		var o = args.shift();
		return this._apply(o,args);
	};

	/**
	 * メソッドを実行します。
	 * （システム用）
	 * Methodはこのメソッドをそのまま継承し、Classに対して
	 * このメソッドを呼び出すとエラーとなります。
	 * @method apply
	 * @param  
	 * @return   
	 */ 
	Function.prototype.apply = function(o,args) {
		if (System.objType(this) != System.OT_METHOD) {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"apply()");
		}
		return this._apply(o,args);
	};

	/**
	 * objectに関連づけられた関数(内部で object を this として参照可能)
	 * のインスタンスを返す。 返される関数は、元の関数と同じ引数
	 * (arg1, arg2, ... etc)となる。 
	 * （システム用）
	 * Methodはこのメソッドをそのまま継承し、Classに対して
	 * このメソッドを呼び出すとエラーとなります。
	 * @method bind
	 * @param  {Object} o 関連付けれるオブジェクト。
	 * @return   
	 */ 
	Function.prototype.bind = function(o) {
		if (System.objType(this) != System.OT_METHOD) {
			throw new Error(Error.EN_UNSUPPOREDMETHOD,"bind()");
		}
		var F = this;
		return function() {
			return F._apply(o,arguments);
		};
	};

	/**
	 * Hashクラスのインスタンスのメソッドとして呼び出されているかどうか
	 * をチェックします。
	 * （システム用）
	 * @method $checkHashMethod
	 * @param  {String} methodName メソッド名称
	 * @return   
	 */ 
	function $checkHashMethod(object,methodName) {
	//	if (object.getClass() != Hash) {
	//		throw new Error(Error.EN_UNSUPPOREDMETHOD,methodName);
	//	}
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、全てのキーの
	 * リストを返します。
	 * @method keys
	 * @param  
	 * @return {Array｝ キーのリスト
	 */ 
	Object.prototype.keys =  function() {
		$checkHashMethod(this,"keys()");
		
		var res =[];
		for (var k in this) {
			if (this.hasOwnProperty(k)) {
				res.push(k);
			}
		}
		var tsName = "toString";
		if (this.hasOwnProperty(tsName)) {
			if (res.indexOf(tsName) == -1) {
				res.push(tsName);
			}
		}
		return res;
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 指定されたキーにマップされている値を返します。
	 * @method get
	 * @param  {String} key 	キー
	 * @return {Object} Value 	値
	 */ 
	Object.prototype.get = function(key) {
		$checkHashMethod(this,"get()");

		if (this.hasKey(key)) {
			return this[key];
		}
		return undefined;
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 指定された keyを指定されたvalue にマップします。
	 * @method put
	 * @param  {String} key キー
	 * @param  {Object} val 値
	 * @return   
	 */ 
	Object.prototype.put = function(key, val) {
		$checkHashMethod(this,"put()");

		this[key] = val;
	};

	Object.prototype.putAll = function(oHash) {
		$checkHashMethod(this,"merge()");

		var keys = oHash.keys();
		for (var i =0; i<keys.length;i++) {
			this.put(keys[i],oHash.get(keys[i]));
		}
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 指定されたキーおよびそれに対応する値を削除します
	 * @method remove
	 * @param  {String} key キー
	 * @return   
	 */ 
	Object.prototype.remove = function(key) {
		$checkHashMethod(this,"remove");

		if (this.hasKey(key)) {
			delete this[key];
		}
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 全てのキー及びそれに対応する値を消去します。  
	 * @method clear
	 * @param  
	 * @return   
	 */ 
	Object.prototype.clear = function() {
		$checkHashMethod(this,"clear()");

		var keys = this.keys();
		for (var i= 0;i<keys.length;i++) {
			delete this[keys[i]];
		}
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 指定されたキーが存在するかをチェックします。
	 * @method hasKey
	 * @param  {String} key キー
	 * @return {Boolean}
	 */ 
	Object.prototype.hasKey = function(key) {
		return this.hasOwnProperty(key);
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * 全ての値のリストを返します。
	 * @method values
	 * @param  
	 * @return {Array}   値のリスト 
	 */ 
	Object.prototype.values = function() {
		$checkHashMethod(this,"values()");

		var res =[];
		for (var k in this) {
			if (this.hasOwnProperty(k)) {
				res.push(this[k]);
			}
		}
		return res;
	};
				
	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * キー及びそれに対応する値が存在するかないかをチェックします。
	 * @method isEmpty
	 * @param  
	 * @return {Boolean} 
	 */ 
	Object.prototype.isEmpty  = function() {
		$checkHashMethod(this,"isEmpty()");

		return this.count() == 0;
	};

	/**
	 * Hashクラスのインスタンスとされるオブジェクトにおいて、
	 * キー及びそれに対応する値のペアの数を返します。。
	 * @method count
	 * @param  
	 * @return {Number}  
	 */ 
	Object.prototype.count = function() {
		$checkHashMethod(this,"count()");

		var keys = this.keys();
		return keys.length;
	};


	/**
	 * システムNamespaceの名称
	 */ 
	$spwnsname = "spw";


	/**
	 * NamespaceとClassを格納するものを定義します。
	 */ 
	$nsroot = {
			_nsName	: "",
			spw  	:{ 
						_nsName	: "spw"
				  	 }
	};

	/**
	 * spwというNamespaceを使えるようにします。
	 */ 
	window["spw"] = $nsroot.spw;

	/**
	 * 親クラスのインスタンスプロパティ及びメッソドをサブクラスに引き継がれるようにする
	 *
	 * @method $extendI
	 * @param  {Class} 		subc 	サブクラス 
	 * @param  {Class} 		superc 	スパクラス 
	 * @param  {Boolean} 	isnew	元JSオブジェクト無しフラグ 
	 * @param  {Boolean} 	isAbstract	インスタンス生成なしフラグ 
	 * @return   
	 */
	function $extendI (subc, superc,isnew,isAbstract) {
		if (isnew && !isAbstract) {
			if (superc) {
			    var F = function() {};
			    F.prototype=superc.prototype;
			    subc.prototype=new F();
			    subc.prototype.constructor=subc;
			}
		} 
	    subc._superc= superc;
	};


	/**
	 * クラスのスタティックプロパティ及びメッソドを定義する
	 *
	 * @method $overrideS
	 * @param  {Class} c 　      クラス 
	 * @param  {Hash}  overrides クラスのスタティックプロパティ及びメッソドの集合 
	 * @return {Namespace}  
	 */
	function $overrideS(c,overrides) {
	    if (overrides) {
			var keys = overrides.keys()
	        for (var i =0;i<keys.length;i++) {
	            c[keys[i]]=overrides[keys[i]];
	        }
	    }
	};

	/**
	 * クラスのインスタンスプロパティ及びメッソドを定義する
	 *
	 * @method $overrideI
	 * @param  {Class} c 　      クラス 
	 * @param  {Hash}  overrides クラスのスタティックプロパティ及びメッソドの集合 
	 * @return {Namespace}  
	 */
	function $overrideI(c,overrides){
	    if (overrides) {
			var keys = overrides.keys()
	        for (var i =0;i<keys.length;i++) {
	            c.prototype[keys[i]]=overrides[keys[i]];
	        }
	    }
	};


	/**
	 * Namespaceを定義します。
	 *
	 * @method $defineNs
	 * @param  {String}   fullName   Namespace名称
	 * @return {Namespace}  
	 */
	function $defineNs(fullName) {
	 	var pnsName    = "";

		if (fullName == ""  || fullName == $spwnsname) {
			return undefined;
		}
		
	    var d = fullName.split(".");
		var pns = $nsroot;
	    for (j= 0; j<d.length-1; j++) {
			if (pnsName == "") {
				pnsName = d[j];
			} else {
				pnsName = pnsName + "." + d[j];
			}
	        pns[d[j]]=pns[d[j]] || {_nsName : pnsName};
	        pns=pns[d[j]];
	    }

		var ns = {_nsName : fullName};
		pns[d[d.length-1]] = ns;

		if(d[0] != $spwnsname) {
			window[d[0]] = $nsroot[d[0]];
		}

		return ns;
	};

	/**
	 * Namespaceをサーチします。
	 *
	 * @method $findNs
	 * @static
	 * @private
	 * @param  fullName   Namespace名称
	 * @return {Namespace}  
	 */
	function $findNs(fullName) {
	    var d = fullName.split(".");
		var ns = $nsroot;

	    for (j= 0; j<d.length; j++) {
	        ns=ns[d[j]];
			if (!ns) {
				break;
			}
	    }

		return ns;
	};

	/**
	 * Namespaceをサーチしてなければ作成します。
	 *
	 * @method $findAndDefineNs
	 * @static
	 * @private
	 * @param  {String} name   Namespace名称
	 * @return {Namespace}  
	 */
	function $findAndDefineNs(fullName) {
		if (fullName == "") {
			return null;
		}
		var ns = $findNs(fullName);
		if (!ns) {
			ns = $defineNs(fullName);
		}
		return ns;
	};

	/**
	 * Namespaceを削除します。
	 *
	 * @method deleteNs
	 * @static
	 * @private
	 * @param  {String}  fullName   Namespace名称
	 * @return {Boolean} 削除成功の場合はTrue、そうではない場合はFalse
	 * 					 を返します。 
	 */
	function $deleteNs(fullName) {
		if (fullName == $spwnsname) {
			return false;
		}
	    var d = fullName.split(".");
		var ns  = $nsroot;
		var nsp = null;
	    for (j= 0; j<d.length-1; j++) {
			nsp = ns;
	        ns=nsp[d[j]];
			if (!ns) {
				return false;
			}
	    }
		ns[d[d.length - 1]] = undefined;
		if (ns == $nsroot) {
		   window[d[d.length-1]] = undefined;
		}
		return true;
	};

	/**
	 * Nameを定義します。
	 *
	 * @method $defineName
	 * @param  {String}   fullName  オブジェクト名称
	 * @param  {Object}   obj    	オブジェクト
	 * @return   
	 */
	function $defineName(fullName,obj) {
		if (fullName == ""  || fullName == $spwnsname) {
			return undefined;
		}
		
	    var d = fullName.split(".");
		var pns = $nsroot;

	    for (j= 0; j<d.length-1; j++) {
			if (pnsName == "") {
				pnsName = d[j];
			} else {
				pnsName = pnsName + "." + d[j];
			}
	        pns[d[j]]=pns[d[j]] || {_nsName : pnsName};
	        pns=pns[d[j]];
	        var objType = System.objType(pns);
	        if (objType != System.OT_NAMESPACE) {
	        	return false;
	        }
	    }

		pns[d[d.length-1]] = obj;
		if(d[0] != $spwnsname) {
			window[d[0]] = $nsroot[d[0]];
		}
		
		return true;
	};

	/**
	 * Nameを削除します。
	 *
	 * @method $deleteName
	 * @static
	 * @private
	 * @param  {String}  fullName   Namespace名称
	 * @return {Boolean} 削除成功の場合はTrue、そうではない場合はFalse
	 * 					 を返します。 
	 */
	function $deleteName(fullName) {
		if (fullName == $spwnsname) {
			return false;
		}
	    var d = fullName.split(".");
		var ns  = $nsroot;
		var nsp = null;
	    for (j= 0; j<d.length-1; j++) {
			nsp = ns;
	        ns=nsp[d[j]];
			if (!ns) {
				return false;
			}
	    }
		ns[d[d.length - 1]] = undefined;
		if (ns == $nsroot) {
		   window[d[d.length-1]] = undefined;
		}
		return true;
	};

	/**
	 * クラスが所属しているNamesapce名称を返します。
	 *
	 * @method $getNsNameOfClass
	 * @static
	 * @private
	 * @param  {String} regObjectName   Class名称
	 * @return {String} Namesapce名称
	 */
	function $getNsNameOfClass(fullName) {
	    var d = fullName.split(".");
		d.pop();
		return d.join(".");
	};

	/**
	 * クラスのNamespace名称が付いていない名称を返します。
	 *
	 * @method $getShortNameOfClass
	 * @static
	 * @private
	 * @param  {String} regObjectName   Class名称
	 * @return {String} ショット名称
	 */
	function $getShortNameOfClass(fullName) {
	    var d = fullName.split(".");
		return d[d.length-1];
	};

	/**
	 * クラスを定義します。
	 *
	 * @method $defineClass
	 * @static
	 * @private
	 * @param  {Hash} cdef   Class名称
	 * 					{String}   name　　　　クラス名称
	 * 					{JSObject} jsobj	 　クラスの元となるJSオブジェクト、無ければnull
	 * 				　　{Class}    superc　　　クラスの親クラス
	 * 					{Hash}     statics　 　クラスのStaticプロパティ
	 * 					{Hash}     instances　 クラスのinstanceプロパティ
	 * 
	 * @return {Class} クラス
	 */
	function $defineClass(cdef) {
		var fullName  = cdef.name;
		var c = cdef.jsobj;
	    var superc = cdef.superc;
		if (!superc && c != Instance) {
			superc = Instance;
		}
	    var statics   = cdef.statics;
	    var instances = cdef.instances;
		var isnew = false;
		var isAbstract = false;

		if (!instances) {
			isAbstract = true;
		} 

		if (!c) {
			if (isAbstract) {
				c  = function() {
						throw new Error("can not create instance of this class");
	    		};
			} else {
				c  = function() {
					this._disposed = false;
					if (this._initialize) {
						this._initialize.apply(this, arguments);
					}
	    		};
			}
			isnew = true;
		}

		var nsname = $getNsNameOfClass(fullName);
		var name = $getShortNameOfClass(fullName);
		var ns =  $findAndDefineNs(nsname);
		if (!ns) {
			$nsroot[name] = c;
			window[name] = c;
		} else {
			ns[name] = c;
		}
		c._className  =  fullName;

		$overrideS(c,statics);

		$extendI(c,superc,isnew,isAbstract);
		
		if (!isAbstract) {
			$overrideI(c,instances);
		}	
		
		if (c._initialize) {
			c._initialize();
		}

		return c;

	};

	/**
	 * クラスをサーチします。
	 *
	 * @method $findClass
	 * @static
	 * @private
	 * @param  {String}   fullname　　　　クラス名称
	 * @return {Class} クラス
	*/
	function $findClass(fullname) {
		var nsname = $getNsName(fullname);
		var name = $getShortName(fullname);
		var ns =  $findDs(nsname);
		var c ;
		if (ns == null){
			c = $nsroot[name]
		} else {
			c = ns[name];
		}
		if (c && System.objType(c) == System.OT_CLASS) {
			return c;
		} else {
			return undefined;
		}
	};

	/**
	 * クラスを削除します。
	 *
	 * @method $deleteClass
	 * @static
	 * @private
	 * @param  {String}  fullname　　　　クラス名称
	 * @return {Boolean} 削除成功の場合はTrue、そうではない場合はFalse
	 * 					 を返します。 
	 */
	function $deleteClass(fullname) {
		var nsname = $getNsNameOfClass(fullname);
		if (nsname == $spwnsname) {
			return false;
		}
		var shortname = $getShortNameOfClass(fullname);
		var ns = $findNs(nsname);
		if (ns == null){
			ns = $nsroot;
		} 
		var c = ns[shortname] ;

		if (c && System.objType(c) == System.OT_CLASS) {
			delete ns[shortname];
			if (ns == $nsroot) {
				delete window[shortname];
			}
		} else {
			return false;
		}
	};


	/**
	 * クラスspw.Instanceを定義します。
	 *
	 */
	$defineClass({
		name   : "spw.Instance",
		jsobj  : Instance,
		superc : null,
		statics: {
		},
		instances :{
			_initialize : function () {
				this._disposed = false;
			},

			_finalize : function() {
				this._disposed = true;
			}
		}
	}); 

	/**
	 * クラスspw.Methodを定義します。
	 *
	 */
	$defineClass({
		name   : "spw.Method",
		jsobj  : Method,
		superc : spw.Instance,
		statics: {},
		instances :{}
	}); 


	/**
	 * クラスspw.Arrayを定義します。
	 *
	 */
	$defineClass({
		name   : "spw.Array",
		jsobj  : Array,
		superc : spw.Instance,
		statics: {
		},
		instances :{
			clear : function() {
			    this.length = 0;
			},

			contains : function(o){
				return this.indexOf(o) > -1 ;
			},

			containsAll : function(a){
				for (var i=0;i<a.length;i++) {
					if (this.indexOf(a[i]) == -1 ) {
						return false;
					}
				}
				return true;
			},

			first : function() {
				if (this.length >0) {
				    return this[0];
				}else {
					return undefined;
				}    
			},

			get : function(i) {
				if (i<0 || i>= this.length) {
					return null
				} else {
					return this[i];
				}
			},


			indexOf : function(o, fromIndex) {
				if (fromIndex == null) {
					fromIndex = 0;
				} else if (fromIndex < 0) {
					fromIndex = Math.max(0, this.length + fromIndex);
				}
				for (var i = fromIndex; i < this.length; i++) {
					if (this[i] ==  o)
						return i;
				}
				return -1;
			},

			indexOfSub	: function(aSub,fromIndex) {
				if (!aSub) {
					return -1;
				}
				if (fromIndex == null) {
					fromIndex = 0;
				} else if (fromIndex < 0) {
					fromIndex = Math.max(0, this.length + fromIndex);
				}
				
				var nLenSub = aSub.length;
				var nLen 	= this.length;
				for (var i = fromIndex; i < nLen - nLenSub; i++) {
					var bAll = true;
					for (var j = 0;j++;j<nLenSub) {
						if (this[i+j] != aSub[j]) {
							bAll = false;
							break;
						}
					}
					if (bAll) {
						return i;
					}
				}
				return -1;
			},

			insertAt : function(o, i) {
				this.splice(i, 0, o);
			},

			insertBefore : function(o, o2) {
				var i = this.indexOf(o2);
				if (i == -1)
					this.push(o);
				else
					this.splice(i, 0, o);
			},

			isEmpty : function(){
				return this.length == 0;
			},

			last : function() {
				if (this.length > 0) {
				    return this[this.length - 1];
				}else{
					return undefined;
				}    
			},

			lastIndexOf : function(o, fromIndex) {
				if (fromIndex == null) {
					fromIndex = this.length - 1;
				} else if (fromIndex < 0) {
					fromIndex = Math.max(0, this.length + fromIndex);
				}
				for (var i = fromIndex; i >= 0; i--) {
					if (this[i] ==  o)
						return i;
				}
				return -1;
			},

			pushAll : function(a) {
				for (var i=0;i<a.length;i++) {
					this.push(a[i]);
				}
			},

			remove : function(o) {
				var i = this.indexOf(o);
				if (i != -1)
					this.splice(i, 1);
			},


			removeAt : function(i) {
				this.splice(i, 1);
			},


			removeAll : function(o) {
				var i = this.indexOf(o);
				while (i>-1) {
					this.removeAt(i);
					i = this.indexOf(o);
				}
			},

			removeSub	:function(aSub){
				var i = this.indexOfSub(aSub);
				if (i != -1 ){
					this.splice(i,aSub.length);
				}
			},

			forEach : function(f, o) {
				var l = this.length;
				for (var i = 0; i < l; i++) {
					f.call(o, this[i], i, this);
				}
			}
		}
	}); 

	/**
	 * クラスspw.Booleanを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Boolean",
		jsobj		: Boolean,
		superc		: spw.Instance,
		statics		: {
			vtos	: function(o) {
				if (o) {
					return "true";
				} else {
					return "false";
				}
			},

			vfroms	: function(sValue) {
				if (sValue == "true") {
					return true;
				} else if (sValue == "false") {
					return false;
				} else {
					throw new Error(0,"invalid parameter");
				}
			}
	    },
		instances	: {}
	});

	/**
	 * クラスspw.Dateを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Date",
		jsobj		: Date,
		superc		: spw.Instance,
		statics		: {
			vtos	: function(o) {
				return o.toString();
			},

			vfroms	: function(sValue) {
				return new Date(sValue);
			}
		},
		instances	: {}
	});


	/**
	 * クラスspw.Hashを定義します。
	 *
	 */
	$defineClass({
		name   : "spw.Hash",
		jsobj  : Hash,
		superc : spw.Instance,
		statics: {
		},
		instances :{
			_initialize : function () {
			},

			_finalize  : function() {
			}

		}
	}); 



	/**
	 * クラスspw.Mathを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Math",
		jsobj		: Math,
		superc		: spw.Instance,
		statics		: {
			parseInt : function(s,radix) {
				return parseInt(s,radix);
			},

			parseFloat	: function(s) {
				return parseFloat(s);
			}
		},
		instances	: {}
	});

	/**
	 * クラスspw.Numberを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Number",
		jsobj		: Number,
		superc		: spw.Instance,
		statics		: {
			vtos	: function(o) {
				return o.toString();
			},

			vfroms	: function(sValue) {
				return Math.parseFloat(sValue);
			}
		},
		instances	: {
		}
	});

	/**
	 * クラスspw.RegExpを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.RegExp",
		jsobj		: RegExp,
		superc		: spw.Instance,
		statics		: {},
		instances	: {}
	});

	/**
	 * クラスspw.Stringを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.String",
		jsobj		: String,
		superc		: spw.Instance,
		statics		: {},
		instances	: {
			trim	: function() {
		        return this.replace(/^\s+|\s+$/g,'');
	    	},
			ltrim	: function() {
		        return this.replace(/^\s+/g,'');
	    	},
			rtrim	: function() {
		        return this.replace(/\s+$/g,'');
	    	}
		}
	});


	var $timeoutMethods = new Hash();

	var $intervalMethods = new Hash();



	/**
	 * クラスspw.Systemを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.System",
		jsobj		: System,
		statics		: {
			_execTimeoutMethod  :function (sTimestamp){
				var oMethodInfo = $timeoutMethods.get(sTimestamp);
				if (oMethodInfo) {
					var id = oMethodInfo.get("id");
					var o = oMethodInfo.get("o")
					var m = oMethodInfo.get("m")
					var args = oMethodInfo.get("args");

					clearTimeout(id);
					oMethodInfo.dispose();
					$timeoutMethods.remove(oMethodInfo);

					m.apply(o,args);
				}
			},

			_execIntervalMethod  :function (sTimestamp){
				var oMethodInfo = $intervalMethods.get(sTimestamp);
				if (oMethodInfo) {
					var o = oMethodInfo.get("o")
					var m = oMethodInfo.get("m")
					var args = oMethodInfo.get("args");
					m.apply(o,args);
				}
			},

			/**
			 *
			 *
			 * @method findNs
			 * @static
			 * @public
			 * @param  {String} name     
			 * @return {Namespace}  A reference to the last namespace object created
			 */
			findNs :function(name) {
				return $findNs(name);
			},

			/**
			 *
			 *
			 * @method defineNs
			 * @static
			 * @param  {String}    fullname
			 * @return {Namespace}  
			 */
			defineNs : function(fullname) {
				return $defineNs(fullname);
			},

			deleteNs : function(fullname) {
				return $deleteNs(fullname);
			},

			findClass : function(n) {
				return $findClass(n);
			},

			defineClass : function(cdef) {
				var cdef1 = {};
				cdef1.name = cdef.name;
				cdef1.jsobj = null;
				cdef1.superc =cdef.superc;
				cdef1.statics = cdef.statics;
				cdef1.instances = cdef.instances;
				if (!cdef1.instances) {
					cdef1.instances = {
										_initialize : function () {
											throw new Error("can't create the instance");
										}
									};
				}

				return $defineClass(cdef1);
				
			},

			deleteClass : function(n) {
				return $delectClass(n);
			},
			
			defineName	: function(name,obj){
				return $defineName(name,obj);
			},
			
			exec  : function(script) {
				return eval(script);
			},

			execMethod		: function(o,sMethod,args,c) {
				var method	= null;
				if (c) {
					if (!(o.instanceOf(c))) {
						return null;
					}
					while (c) {
						if (c.prototype.hasOwnProperty(sMethod)) {
							method = c.prototype[sMethod];
							break;
						}
						c = c.getSuperc();
					}
				} else {
					method = o[sMethod];
				}

				if (method) {
					if (!args){
						args = [];
					}
					return method._apply(o,args);
				} else {
					throw new Error(Error.EN_UNSUPPOREDMETHOD,sMethod+"()");
				}
			},

			asyncExecMethod	: function(o,m,args,nMilliseconds) {
				var now  = new Date();
				var nSecond = now.getTime();
				var nMillsec = now.getMilliseconds();
				var sTimestamp = nSecond.toString() +"_"+ nMillsec.toString();
	  			
				var oMethodInfo = new Hash();
				oMethodInfo.put("o",o);
				oMethodInfo.put("m",m);
				oMethodInfo.put("args",args);

				var s = "System._execTimeoutMethod('"+sTimestamp+"');";
				var id = setTimeout(s,nMilliseconds);
				
				oMethodInfo.put("id",id);
				
				$timeoutMethods.put(sTimestamp,oMethodInfo);
			},

			autoExecMethod	: function(o,m,args,nMilliseconds) {
				var now  = new Date();
				var nSecond = now.getTime();
				var nMillsec = now.getMilliseconds();
				var sTimestamp = nSecond.toString() +"_"+ nMillsec.toString();

	  			
				var oMethodInfo = new Hash();
				oMethodInfo.put("o",o);
				oMethodInfo.put("m",m);
				oMethodInfo.put("args",args);

				var s = "System._execIntervalMethod('"+sTimestamp+"')";
				var id = setInterval(s,nMilliseconds);
				
				oMethodInfo.put("id",id);
				
				$intervalMethods.put(sTimestamp,oMethodInfo);
				return id;
			},

			stopAutoExecMethod	: function(id) {
				clearInterval(id);
				var keys = $intervalMethods.keys();
				for (var i = 0; i<keys.length; i++) {
					var value = _intervalMethods.get(keys[i]);
					if (value.get("id") == id ) {
						$intervalMethods.remove(keys[i]);
						value.dispose();
						break;
					}
				}
				
			}
		},
		instances	: {
		}
		
	});


	/**
	 * クラスspw.Errorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Error",
		jsobj		: Error,
		superc		: spw.Instance,
		statics		: {},
		instances	: {}
	});

	/**
	 * クラスspw.EvalErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.EvalError",
		jsobj		: EvalError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});


	/**
	 * クラスspw.RangeErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.RangeError",
		jsobj		: RangeError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});

	/**
	 * クラスspw.ReferenceErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.ReferenceError",
		jsobj		: ReferenceError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});

	/**
	 * クラスspw.SyntaxErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.SyntaxError",
		jsobj		: SyntaxError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});


	/**
	 * クラスspw.TypeErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.TypeError",
		jsobj		: TypeError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});


	/**
	 * クラスspw.URIErrorを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.URIError",
		jsobj		: URIError,
		superc		: spw.Error,
		statics		: {},
		instances	: {}
	});

	window.Set	= function() {};

	/**
	 * クラスspw.Setを定義します。
	 *
	 */
	$defineClass({
		name		: "spw.Set",
		jsobj		:  Set,
		superc		: spw.Instance,
		statics		: {},
		instances	: {
			_items	: null,

			_initialize : function () {
				this._items = new Array();
			},

			_finalize  : function() {
				this._items.dispose();
				this._items = null;
			},

			include	: function(o) {
				if (o && this._items.indexOf(o) == -1) {
					this._items.push(o);
				}
			},

			exclude	: function(o) {
				this._items.remove(o);
			},

			contains : function(o) {
				return this._items.indexOf(o)>-1;
			},

			clear 	: function() {
				this._items.clear();
			},

			toArray : function() {
				var oArray = new Array();
				oArray.pushAll(this._items);
				return oArray;
			}
		}
	});
})();

