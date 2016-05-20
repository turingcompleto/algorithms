//
//	Kruskal's Algorithm
//	Copyright(C) Kenji Ikeda 2015
//
document.write("<script type='text/javascript' src='./graph.js'></script>");
document.write("<script type='text/javascript' src='./qsort.js'></script>");

//
//	Kruskal's Algorithm	'
//
function Kruskal(canvas,canvas2,myfont,isdigraph,nodes,edges) {
	// vars for Graph
	{ 
		var context = canvas.getContext("2d");
		context.font = myfont;
		Graph(context,isdigraph,nodes,edges);
	}
	// extension for Kruskal's Algorithm	'
	/* the following properties will be initialized at init_data()
	var e_idx;	// number of checked edges (idx of sorted edges)
	var e_fix;	// number of fixed edges
	var step;
	var qs;		// qsort: sorted edge indices
	var ratio;
	**/

	const STAT = {fix:1, dep:2, sel:3, oth:4};
		// fixed, deposited, selected, or other

	//
	//  Node extension for Kruskal's Algorithm '
	//
	function extNode(node) {
		// extends Node Properties
		node.cls = node.num;	// class of this node
		node.first = node.num;	// first node who shares the class
		node.next = -1;		// next node who shares the class
	}
	// extends Node Methods
	Node.prototype.paint = function(context,node) {	// override Node.paint
		context.strokeStyle='balck';
		context.fillStyle='white';
		node.drawNode(context,node);
	}
	Node.prototype.paint2 = function(context,node,x,y,rl) {
		var w = node.wh.w;
		var h = node.wh.h;
		x += rl*w;
		y -= h/2;
		context.fillStyle = 'white';
		context.lineWidth=1;

		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x+w,y);
		context.lineTo(x+w,y+h);
		context.lineTo(x,y+h);
		context.closePath();
		context.fill();
		context.stroke();

	//	context.fillRect(x,y,w,h);
	//	context.rect(x,y,w,h);
	
		context.textAlign = "center";
		context.fillStyle = context.strokeStyle;
		context.fillText(node.name,x+w/2,y+h/2+h/5);
	}
	
	//
	//	Edge extension for Kruskal's Algorithm	'
	//
	function extEdge(edge,len) {
		// extends Edge Properties
		edge.length = len;
		edge.stat = STAT.oth;
	}
	// extends Edge Methods
	Edge.prototype.paint = function(context,edge) {	// override Edge.paint
		var icls = Nodes[edge.initv].cls;
		var tcls = Nodes[edge.termv].cls;
	
		context.strokeStyle = 'black';
		context.fillStyle= 'white';
		context.lineWidth = 1;
		if (edge.stat==STAT.sel) {
			context.strokeStyle = 'red';
			context.lineWidth = 3;
		} else if (edge.stat==STAT.fix) {
			context.strokeStyle = 'blue';
			context.lineWidth = 3;
		} else if (edge.stat==STAT.dep) {
			context.strokeStyle = 'gray';
			context.lineWidth = 1;
		} else {
			context.strokeStyle = 'black';
			context.lineWidth = 3;
		}
	
		edge.drawEdge(context,edge);
		printLength(context,edge);
		// local function
		function printLength(context,edge) {
			var w = context.measureText(""+edge.length).width;
			var h = edge.fs;
			var xc = (edge.initxy.x+edge.termxy.x)/2;
			var yc = (edge.initxy.y+edge.termxy.y)/2;
			context.fillStyle = 'white';
			context.fillRect(xc-w/2,yc-h/2,w,h);
			context.fillStyle = 'black';
			context.fillText(""+edge.length,xc,yc+h/4);
		}
	}
	Edge.prototype.paint2 = function(context,edge,i) {
		var h = edge.fs*1.5;
		var x0 = 80;
		var x1 = x0+Math.floor(edge.length*ratio);
		var y = Math.floor((i+1)*h);
	
		context.fillStyle = 'white';
		if (edge.stat==STAT.sel) {
			context.strokeStyle = 'red';
			context.lineWidth = 3;
		} else if (edge.stat==STAT.fix) {
			context.strokeStyle = 'blue';
			context.lineWidth = 3;
		} else if (edge.stat==STAT.dep) {
			context.strokeStyle = 'gray';
			context.lineWidth = 1;
		} else {
			context.strokeStyle = 'black';
			context.lineWidth = 3;
		}
		context.beginPath();
		context.moveTo(x0,y);
		context.lineTo(x1,y);
		context.stroke();
	
		var v1 = Nodes[edge.initv];
		var v2 = Nodes[edge.termv];
	
		context.lineWidth = 1;
		v1.paint2(context,v1,x0,y,-1);
		v2.paint2(context,v2,x1,y,0);
	}
	
	//
	// other local functions for Kruskal's Algorithm	'
	//
	function getLen(i) {	// get edge length for qsort
		var l = Edges[i].length;
		return l;
	}
	
	function step1() {	// initialize
		for (var i=0; i<m; i++) {
			Edges[i].stat=STAT.oth;
		}
		for (var i=0; i<n; i++) {
			Nodes[i].cls=i;
			Nodes[i].first=i;
			Nodes[i].next=-1;
		}
		e_fix = 0;
		e_idx = 0;
	}

	function step2() {	// pick up the next edge
		var i = qs[e_idx];
		Edges[i].stat=STAT.sel;
	}

	function step3() {	// check the loop
		var i = qs[e_idx++];
		var vl = Edges[i].initv;
		var vr = Edges[i].termv;
		if (Nodes[vl].cls == Nodes[vr].cls) {	// there is a loop
			Edges[i].stat=STAT.dep;
			return;
		}
		// no loop
		e_fix++;
		Edges[i].stat=STAT.fix;
		for (i=vl; Nodes[i].next>=0; i=Nodes[i].next) {
			;
		}
		Nodes[i].next = Nodes[vr].first;
		var frst = Nodes[vl].first;
		var cls = Nodes[vl].cls;
		for (i=Nodes[vr].first; i>=0; i=Nodes[i].next) {
			Nodes[i].first=frst;
			Nodes[i].cls=cls;
		}
	}

	function step4() {	// deposit the rest of the edges
		for (; e_idx<m; e_idx++) {
			var i = qs[e_idx];
			Edges[i].stat=STAT.dep;
		}
	}

	function mouseDown(canvas,mx,my) {
		if (step == 1) {
			step1();
			step = 2;
		} else if (e_fix >= n-1) {
			step4();
			step = 1;
		} else {
			if (step == 3) {
				step3();
				step = 2;
			} else {
				step2();
				step = 3;
			}
		}
		paint(canvas);
		paint2(canvas2);
	}

	function paint(canvas) {
		var context = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;

		context.clearRect(0,0,w,h);
		context.fillStyle = 'white';
		context.fillRect(0,0,w,h);
		context.strokeStyle = 'black';
		context.fillStyle = 'black';
		context.lineWidth = 1;
		context.font = myfont;
	
		for (var i=0; i<n; i++) {
			Nodes[i].paint(context,Nodes[i]);
		}
		for (var i=0; i<m; i++) {
			Edges[i].paint(context,Edges[i]);
		}
	}
	function paint2(canvas) {
		var context = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;

		context.fillStyle = 'white';
		context.fillRect(0,0,w,h);
		context.strokeStyle = 'black';
		context.fillStyle = 'black';
		context.lineWidth = 1;
		context.font = myfont;

		for (var i=0; i<m; i++) {
			var e = qs[i];
			Edges[e].paint2(context,Edges[e],i);
		}
	}
	function init() {
	// extends Node and Edge Properties
		for (var i=0; i<n; i++) {
			extNode(Nodes[i]);
		}
		for (var i=0; i<m; i++) {
			var len = edges[i][3];
			extEdge(Edges[i],len);
		}
	// extension for Kruskal's Algorithm	'
	// "this" is [object Window]
	// vars for Kruskal's Algorithm	'
		this.e_idx=0;	// number of checked edges
		this.e_fix=0;	// number of fixed edges
		this.step=0;
		this.qs = Qsort(m,getLen);
		this.ratio = 128/Edges[qs[m-1]].length;
	// paint & init labels
		paint(canvas);
		paint2(canvas2);
		step1();
		step = 2;
	}

	function getMousePos(canvas,evt) {
		var rect=canvas.getBoundingClientRect();
		return {
			x: evt.clientX-rect.left,
			y: evt.clientY-rect.top
		};
	}
	this.start = function() {
		canvas.addEventListener('mousedown',function(evt) {
			var mousePos = getMousePos(canvas,evt);
			mouseDown(canvas,mousePos.x,mousePos.y);
		},false);
	}

	init();
}
