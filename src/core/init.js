// Initialize a jQuery object
/*
* 注解
* 1. 定义了jQuery实例对象的构造函数jQuery.prototype.init
* 2. 将构造函数jQuery.prototype.init的原型修改为jQuery的原型,
*    在语义上实现了jQuery实例对象与jQuery原型之间的关系继承关系
* */
define( [
	"../core",
	"../var/document",
	"../var/isFunction",
	"./var/rsingleTag",

	"../traversing/findFilter"
], function( jQuery, document, isFunction, rsingleTag ) {

"use strict";

// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	/*
	* 注解
	* TODO:需要研究一下
	* */
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	/*
	* 注解
	* 主要用于构造jQuery实例对象
	* 根据传入的参数的不同实现不同的功能
	* 分为一下几种情况：
	* 1. selector为string时：
	*      a. $(html)
	*      b. $(html, props)
	*      c. $(#id)
	*      d. $(expr, $(...))
	*      d. $(expr, context)情况
	* 2. selector为DOMElement时
	* 3. selector为$(function)时
	* 4. selector为其他情况时，比如数组、普通对象等
	* 5. $(""), $(null), $(undefined), $(false)时，直接返回
	*
	* 一般地，在jQuery初次加载时会运行一下jQuery.fn.init方法，会影响到
	* 后续执行该方法时的root参数的值，一般为包含document的jQuery实例对象
	* */
	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			/*
			* 注解
			* 当有匹配结果时，如果匹配的是标签如<tag></tag>，不太要求context，
			* 如果匹配的是#id，则要求context不存在
			* match[1]储存的是匹配的标签结果
			* match[2]储存的是匹配的#id结果
			* */
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				/*
				* 注解
				* 将HTML字符串转换成jQuery对象
				* 当匹配的是标签时，对标签进行解析，放到相应的context中？
				* */
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					/*
					* 注解
					* jQuery.parseHTML()将给定的HTML字符串解析成dom元素，将这些dom元素包装成一个jQuery实例对象
					* TODO:具体的算法后续再研究
					* */
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					/*
					* 注解
					* 处理$(html, props)的情况
					* 提供了一个jQuery风格的创建DOM的方式，用例如下：
					*     var res = $('<div>', {
					*	  	title: '动态创建的div',
					*	  	text: 'aaa',
					*	  	click: function(){
					*	  		alert('点击事件');
					*	  	}
					*	  });
					*	  title用于指定DOM的title属性
					*	  text用于指定DOM的文本节点内容
					*	  click指定给该DOM元素绑定一个click事件
					* 以下逻辑只是完成给DOM添加props中的属性的任务，至于
					* 生成元素是在上面一段逻辑中完成的：
					*     jQuery.merge( this, jQuery.parseHTML(
					*		  match[ 1 ],
					*		  context && context.nodeType ? context.ownerDocument || context : document,
					*		  true
					*	  ) );
					* */
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
					/*
					* 注解
					* 当匹配的是#id时
					* 利用#id在document中选区元素
					* 选取到元素时，形成一个长度为1的jQuery对象返回
					* 未选取到元素时，形成一个长度为0的jQuery对象返回
					* */
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			/*
			* 注解
			* 处理$(expr, $(...))情况
			* 在给定的context中寻找符合expr的元素，如：
			* $('span', $([div1, div2]))
			* $('span', $({a: div1, b: div2}))，返回长度为0的jQuery对象
			* $('span', $(DOM))
			* */
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			/*
			* 注解
			* 处理$(expr, context)情况，在给定的context中寻找符合expr的元素，如：
			* $('span', [div1, div2])
			* $('span', {a: div1, b: div2})，返回长度为0的jQuery对象
			* $('span', DOM)
			* */
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
			/*
			* 注解
			* 处理$(DOMElement)情况
			* */
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
			/*
			* 注解
			* 处理$(function)情况
			* */
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		/*
		* 注解
		* 处理$({...})、$([...])以及其他特殊情况，保证该init方法返回的是一个
		* jQuery实例对象
		* */
		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
	/*
	* 注解
	* 这里将jQuery.prototype.init的原型修改为jQuery的prototype
	* */
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );

return init;

} );
