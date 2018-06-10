
var rect = new Rectangle(new Point(400, 250), new Size(50, 80));
//var flashRect = new Path.Rectangle(rect);
//flashRect.strokeColor = 'white';
//flashRect.rotate(30);

//var flashTop = rect.topCenter;
//var flashBot = rect.bottomCenter;
//var flash = new Path(flashTop, flashBot);
//flash.strokeColor = 'white';

var flash = new Raster("flash");
flash.scale(0.04);
flash.position = rect.center;
flash.rotate(30);

var mousePath;
var speed = 1;
var flashLen = flash.length;
var prevDir = 30;
var dirn = 30;
var dirDelta = 60;
var trails = []; 

points = chooseRandomPoints(rect);
for (j = 0; j < points.length; j++) {
    drawTrail(points[j]);
}

function onFrame(event) {
    if (Math.random() < speed / 3) {
	var num = Math.floor(Math.random() * 2) + 1;
	var d = chooseRandomPoints(rect, num);
	for (it = 0; it < num; it++) {
	    var x = trails.shift();
	    if (x != null) {
		x.removeSegments();
		drawTrail(d[it]);
	    }
	}
	if (trails.length > 7) {
	    var garbage = trails.splice(0, trails.length);
	    for (it = 0; it < garbage.length; it++) {
		garbage[it].removeSegments();
		console.log("called");
	    }
	}
	if (trails.length < 2) {
	    drawTrail(chooseRandomPoints(rect, 3));
	    console.log("called");
	}
    }
}

function onMouseDown(event) {
    mousePath = new Path();
    mousePath.add(event.point);
}

function onMouseDrag(event) {
    mousePath.add(event.point);
    mousePath.smooth();
    rect.center = event.point;
    //flashRect.position = event.point;
    flash.position = event.point;
    
    dirn = event.delta.angle;
    var rotate = dirn - prevDir;
    prevDir = dirn;
    flash.rotate(rotate);
    //flashRect.rotate(rotate);

    speed = event.delta.length * 2;
    if (speed > 7) speed = 7;
}

function onMouseUp(event) {
    mousePath.removeSegments();
    speed = 1;
}

function chooseRandomPoints(flashBounds, numPts) {
    if (numPts == null) {
	numPts = Math.floor(Math.random() * 4) + 4;
    }
    var pts = [];
    var halfRectScale = new Point(flashBounds.width / 2, flashBounds.height);
    for (i = 0; i < numPts; i++) {
	var pt = Point.random() * halfRectScale + flashBounds.topLeft;
	pts.push(pt.rotate(dirn, flashBounds.center));
    }
    return pts;
}

function drawTrail(point, trailPts) {
    if (trailPts == null) {
	trailPts = trailLength();
    }
    var lastPt = point;
    var trail = new Path(point);
    for (i = 0; i < trailPts; i++) {
	var step = Math.random() * 15;
	var width = Math.random() * Math.random() * 0.9;
	var angle = getAngle();
	var newPt = new Point({length: step, angle: angle});
	var normalVector = newPt.rotate(90).normalize(width);
	var mid = lastPt + newPt / 2;
	lastPt += newPt;
	trail.add(mid + normalVector);
	trail.insert(0, mid - normalVector);
    }
    trail.strokeColor = "#dd8020";
    trail.fillColor =  'white';
    //trail.shadowColor = "#dd9644";
    //trail.shadowBlur = 10;
    
    trails.push(trail);
}

function getAngle() {
    var sign = negPos();
    return 180 + dirn + sign * Math.pow(Math.random(), 2) * dirDelta;
}

function negPos() {
    return Math.pow(-1, Math.floor(Math.random() * 2));
}

function trailLength(maxLen) {
    if (maxLen == null) maxLen = 10 * speed / 3;
    return Math.floor(Math.random() * maxLen);
}

