
var rect = new Rectangle(new Point(400, 250), new Size(150, 200));
var flashRect = new Path.Rectangle(rect);
flashRect.strokeColor = 'white';
flashRect.rotate(30);

var flashTop = rect.topCenter;
var flashBot = rect.bottomCenter;
var flash = new Path(flashTop, flashBot);
flash.strokeColor = 'white';
flash.rotate(30);

var speed = 40;
var flashLen = flash.length;
var dirn = 30;
var dirDelta = 60;

points = chooseRandomPoints(rect);
for (j = 0; j < points.length; j++) {
    drawTrail(points[j]);
}

function chooseRandomPoints(flashBounds) {
    var numPts = Math.floor(Math.random() * 5) + 12;
    var pts = [];
    var halfRectScale = new Point(flashBounds.width / 2, flashBounds.height);
    for (i = 0; i < numPts; i++) {
	var pt = Point.random() * halfRectScale + flashBounds.topLeft;
	pts.push(pt.rotate(30,flashBounds.center));
    }
    return pts;
}

function drawTrail(point) {
    var trailPts = trailLength();
    var lastPt = point;
    var trail = new Path(point);
    for (i = 0; i < trailPts; i++) {
	var step = Math.random() * 15;
	var angle = getAngle();
	var newPt = new Point({length: step, angle: angle});
	trail.add(lastPt + newPt);
	lastPt += newPt;
    }
    trail.strokeColor = 'white';
}

function getAngle() {
    var sign = Math.pow(-1, Math.floor(Math.random() * 2));
    return 180 + dirn + sign * Math.pow(Math.random(), 2) * dirDelta;
}

function trailLength() {
    return Math.floor(Math.random()*20 + speed * 0.8);
}

