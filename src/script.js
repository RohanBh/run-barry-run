
var rect = new Rectangle(new Point(400, 250), new Size(70, 100));
var flashRect = new Path.Rectangle(rect);
flashRect.strokeColor = 'white';
flashRect.rotate(30);

var flashTop = rect.topCenter;
var flashBot = rect.bottomCenter;
var flash = new Path(flashTop, flashBot);
flash.strokeColor = 'white';
flash.rotate(30);

var mousePath;
var speed = 40;
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
    if (Math.random() < 0.35) {
	var num = Math.floor(Math.random() * 3) + 1;
	var d = chooseRandomPoints(rect, num);
	for (it = 0; it < num; it++) {
	    var x = trails.shift();
	    console.log(trails.length);
	    if (x != null) {
		x.removeSegments();
		drawTrail(d[it]);
		//console.log(trails.length);
	    }
	}
	while(trails.length > 7) {
	    trails.shift().removeSegments();
	}
	while(trails.length < 3) {
	    drawTrail(chooseRandomPoints(rect, 1));
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
    flashRect.translate(event.point - rect.center);
    flash.translate(event.point - rect.center);
    rect.center = event.point;

    dirn = event.delta.angle;
    var rotate = dirn - prevDir;
    prevDir = dirn;
    flash.rotate(rotate);
    flashRect.rotate(rotate);
}

function onMouseUp(event) {
    mousePath.removeSegments();
}

function chooseRandomPoints(flashBounds, numPts) {
    if (numPts == null) {
	numPts = Math.floor(Math.random() * 5) + 4;
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
	if (Math.random() < 0.001) {
	    var numBranch = getBranches();
	    for(k = 0; k < numBranch - 1; k++) {
		drawTrail(lastPt, trailPts - i);
	    }
	}
    }
    trail.strokeColor = '#ec7c24';
    trail.fillColor =  '#ec7c24';
    trails.push(trail);
}

function mutateTrail(trail) {
    var segments = trail.segments;
    for (j = 0; j < segments.length; j++) {
	if (Math.random() < 0.05) {
	    var seg = segments[j];
	    var step = Math.random() * 15;
	    var angle = getAngle();
	    var newPt = new Point({length: step, angle: angle});
	    if (seg.previous != null) {
		seg.point = seg.previous.point + newPt;
	    }
	}
    }
}

function getBranches() {
    return Math.floor(Math.pow(Math.random(), 2) * 3) + 2;
}

function getAngle() {
    var sign = negPos();
    return 180 + dirn + sign * Math.pow(Math.random(), 2) * dirDelta;
}

function negPos() {
    return Math.pow(-1, Math.floor(Math.random() * 2));
}

function trailLength(maxLen) {
    if (maxLen == null) maxLen = 10;
    return Math.floor(Math.random()*maxLen + speed * 0.8);
}

