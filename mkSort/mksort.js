/**
 * mksort.js - Implements SQL style multi-key asc/desc sorting of object arrays
 * Author: Fil Baumanis ( @unfail, @bitless )
 */

mksort = {};

(function(){
	
	// from James Coglan/Jeff Atwood's answers at
	// http://stackoverflow.com/questions/5223/length-of-javascript-object-ie-associative-array
	var obLen = function(obj) {
		var size = 0, key = 0;
		for (key in obj) {
			if (obj.hasOwnProperty(key))
				size++;
		}
		return size;
	};

	// avoiding using Object.keys because i guess did it have IE8 issues?
	// else var obIx = fucntion(obj, ix){ return Object.keys(obj)[ix]; } or
	// whatever
	var obIx = function(obj, ix) {
		var size = 0, key = 0;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (size == ix)
					return key;
				size++;
			}
		}
		return false;
	};

	var keySort = function(a, b, d) {
		d = d !== null ? d : 1;
		// a = a.toLowerCase(); // this breaks numbers
		// b = b.toLowerCase();
		if (a == b)
			return 0;
		return a > b ? 1 * d : -1 * d;
	};

	/**
	 * Sorts array of objects on keys as provided
	 * @param objarr array of objects
	 * @param keys object specifying keys, {KEY1:"asc", "KEY2:"desc", KEY3:"desc"}, also {KEYX:"skip"} for fun
	 * @returns array of objects, sorted
	 */
	mksort.sort = function(objarr, keys) {
		
		// not sure what we want to do if no keys provided. 
		// use obIx0 on a member?
		keys = keys || {};

		var KL = obLen(keys);
		
		// as yet poorly defined -- maybe sort on 
		if (!KL) return objarr.sort(keySort);

		for ( var k in keys) {
			// asc unless desc or skip
			keys[k] = 
					keys[k] == 'desc' || keys[k] == -1  ? -1 
	              : (keys[k] == 'skip' || keys[k] === 0 ? 0 
	              : 1);
		}

		objarr.sort(function(a, b) {
			var sorted = 0, ix = 0;

			while (sorted === 0 && ix < KL) {
				var k = obIx(keys, ix);
				if (k) {
					var dir = keys[k];
					sorted = keySort(a[k], b[k], dir);
					ix++;
				}
			}
			return sorted;
		});
		return objarr;
	};
	
})();
