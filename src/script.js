
var rect = new Rectangle(new Point(), new Size(50, 80));
rect.topLeft = view.topLeft;

var initialAngle = 0;

var flash = new Raster("flash");
flash.scale(0.04);
flash.position = rect.center;
flash.rotate(initialAngle);

var speed = 1;
var flashLen = flash.length;
var prevDir = initialAngle;
var dirn = initialAngle;
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

function onMouseDrag(event) {
    rect.center = event.point;
    flash.position = event.point;
    
    dirn = event.delta.angle;
    var rotate = dirn - prevDir;
    prevDir = dirn;
    flash.rotate(rotate);
    
    speed = event.delta.length * 0.75;
    if (speed > 8) speed = 8;
}

function onMouseUp(event) {
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
    if (maxLen == null) maxLen = 13 * speed / 3;
    return Math.floor(Math.random() * maxLen);
}

