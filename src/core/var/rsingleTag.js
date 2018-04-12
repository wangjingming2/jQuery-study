define( function() {
	"use strict";

	// Match a standalone tag
    /*
	* 注解
	* 指的是这种情况
	* <div>或
	* <div></div>或
	* <input>或
	* <input />
	* 排除的是标签嵌套标签的这种情况
	* <div><span></span></div>
	* */
	return ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
} );
