//
//	Quick Sort
//	Copyright (C) Kenji Ikeda 2015
//
function Qsort(n,getVal) {
	// Qsort has no properties or methods
	// Qsort is just a function to return a vector of indices
	// No need to new Qsort(n,getVal), just x = Qsort(n,getVal);
	var v = new Array(n);
	for (var i=0; i<n; i++) {
		v[i] = i;
	}
	qsort(0,n-1);
	return v;

	function swap(i,j) {
		var k=v[i];

		v[i] = v[j];
		v[j] = k;
	}
	function partition(left,right) {
		var i = Math.floor((left+right)/2);
		var pivot = getVal(v[i]);
		while (left<=right) {
			while (getVal(v[left])<pivot)
				left++;
			while (getVal(v[right])>pivot)
				right--;
			if (left <= right)
				swap(left++,right--);
		}
		return left;
	}
	function qsort(left,right) {
		if (left>=right) {
			return;
		}
		var i = partition(left,right);
		qsort(left,i-1);
		qsort(i,right);
	}
}

