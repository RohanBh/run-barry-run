
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
var dir = 120;

points = chooseRandomPoints(rect);
for (i = 0; i < points.length; i++) {
    var path = new Path(points[i]);
    path.selected = true;
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

