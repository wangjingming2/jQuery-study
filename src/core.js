/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module
/*
* 注解
* 1. 定义了jQuery函数
* 2. 描述了jQuery实例对象的原型
* 3. 为jQuery函数以及jQuery实例对象的原型增加了扩展方法extend
* 4. 利用extend方法扩展了jQuery函数
* 5. 在jQuery函数以及jQuery实例对象的原型上定义了比较重要的方法
*    如pushStack、each、merge等
* */
define( [
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./var/isFunction",
	"./var/isWindow",
	"./core/DOMEval",
	"./core/toType"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isFunction, isWindow, DOMEval, toType ) {

"use strict";

var
	version = "@VERSION",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/*
* 注解
* 创建/修改/定义jQuery实例对象的原型
* TODO:jQuery原型是如何让构造函数jQuery.fn.init的实例继承的？
* 在./core/init.js中的init.prototype = jQuery.fn;语句中实现的
* */
jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	/*
	* 注解
	* TODO:我认为有必要了解原型中constrctor属性的作用
	*
	* */
	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	/*
	* 注解
	* 将jQuery对象转化为一个纯数组
	* 注意跟this.slice区分
	* */
	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	/*
	* 注解
	* 在匹配到的元素集中得到第n个元素或者
	* 得到整个匹配到的元素集，作为一个纯属组
	* */
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	/*
	* 注解
	* 创建一个新的jQuery实例，将给定的一系列元素elems推入到这个新的实例中，返回这个实例
	* */
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		/**
		 * 注解
		 * this.constructor()实际上就是jQuery()，返回一个空的jQuery对象
		 * 这个语句的用意就是将给定的elems推到一个新建的空的jQuery对象中
		 */
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		/*
		* 注解
		* 该属性是用来实现jQuery串联特性的
		* 这里的this指的是jQuery.prototype?
		* */
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	/*
	* 注解
	* jQuery对象实例上的方法，要求传入一个回调函数，就会对matched set中的每一个元素进行处理；
	* 具体遍历的逻辑在jQuery函数的each方法内实现的
	* */
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	/*
	* 注解
	* 将jQuery对象中的元素按照给定的规则（callback）进行映射
	* 形成一个新的数组，将该数组返回
	* 这个方法只是调用了this.pushStack，具体的映射逻辑在jQuery.map方法中完成的
	* */
	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	/*
	* 注解
	* 将jQuery对象中的某一些元素截取下来形成一个新的jQuery对象返回
	* 原来的jQuery对象并没有被修改
	* 并且将原来的jQuery对象作为一个prevObject属性存放在新的jQuery对象中
	* */
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	/*
	* 注解
	* 获取jQuery对象中的第一个元素，以此元素形成一个新的jQuery对象
	* 这是this.eq方法的快捷方式
	* */
	first: function() {
		return this.eq( 0 );
	},

	/*
	* 注解
	* 获取jQuery对象中的最后一个元素，以此元素形成一个新的jQuery对象
	* 这是this.eq方法的快捷方式
	* */
	last: function() {
		return this.eq( -1 );
	},

	/*
	* 注解
	* 将jQuery对象中index为i的元素包装成一个新的jQuery对象返回
	* 如果i为-1，则将jQuery中的最后一个元素包装成一个新的jQuery对象返回
	* */
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	/*
	* 注解
	* 返回上一次破坏性操作之前的jQuery对象
	* */
	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	/*
	* 注解
	* 以下为纯数组方法
	* */
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

/*
* 注解
* TODO:需要深入理解这个方法
* 为jQuery或者jQuery实例的原型提供了一个扩展的方法
* */
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/*
* 注解
* 给jQuery扩展一些方法或属性
* */
jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	/*
	* 注解
	* TODO:搞清楚PlainObject的定义
	* 根据这里的描述，PlainObject是一个没有原型或者是由Object function构造出来的对象。
	* 也就是说似乎没有沿着原型链进行递归的意义了
	* */
	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	/*
	* 注解
	* 判断是否为一个空对象，即没有自有属性的对象例如{}
	* 注意与isPlainObject区分
	* */
	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	/*
	* 注解
	* 应该对results参数有类型的要求，可能要求是数组
	* 该方法可能最终返回一个纯数组
	* */
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			/*
			* 注解
			* TODO:Object(..)会产生一个对应的包装对象。什么样的对象经过Object(obj)之后会产生类数组对象呢？
			* */
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	/*
	* 注解
	* TODO:为什么不直接用push呢？
	* 可能是因为这个方法是用来处理类数组对象的吧
	* */
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	/*
	* 注解
	* 按照某规则过滤数组中的元素
	* */
	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	/*
	* 注解
	* 将给定的数组/类数组或对象中的每个元素
	* 按照给定的规则（callback）进行一个映射
	* 形成一个新的数组，将该数组返回。
	* */
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

/*
* 注解
* obj为数组或者类数组时则返回true
* */
function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

return jQuery;
} );
