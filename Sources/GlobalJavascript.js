function backpoints(width, height) {
    var numberhigh = 15;
    var triangleheight = height / numberhigh;
    var numberwide = 25;
    var triagnleWidth = width / numberwide;
    var coords = [];
    var count = 0;
    for (var g = 0; g < numberhigh; g++) {
        var row = [];
        count++;
        if (count % 2 == 0) {
            for (var i = 0; i < numberwide - 1; i++) {
                row.push([Math.round(i * triagnleWidth + (triagnleWidth / 2)), Math.round(g * triangleheight)]);
            }
        } else {
            for (var i = 0; i < numberwide; i++) {
                row.push([Math.round(i * triagnleWidth), Math.round(g * triangleheight)]);
            }
        }
        coords.push(row);
    }
    return coords;
}
var test = backpoints(1280, 780);
console.log(test);
console.log(test[0].length * 15);

function createTriangles() {
    for (var i = 0; i < test[0].length * 15; i++) {
        var svg = document.createElement("SVG");
        svg.id = "triangle" + i;
        document.getElementById("backsplash").appendChild(svg);
    }
    console.log("CreatedTriangles");
}

function pointsToString(one, two, three) {
    var endstring = "";
    endstring = one[0] + "," + one[1] + " " + two[0] + "," + two[1] + " " + three[0] + "," + three[1];
    return endstring;
}
var colors = ["#34b4eb", "#1b8ebf", "#0b5b7d", "#34708a", "#134b63", "#359fcc", "#00acf5", "#0e52c7", "#357efc", "#2e7bff", ];

function makeTriangleRows() {
    var currentTriangle = 0;
    var numberofrows = numberhigh / 3;
    var numberofsections = numberwide - 1;
    for (var t = 0; t < numberofrows; t++) {
        var stringOfPoints = pointsToString([t * 2, 0], [t * 2 + 1, 0], [t * 2 + 2, 0]);
        document.getElementById("triangle" + ++currentTriangle).setAttribute("points", stringOfPoints);
        for (var g = 0; g < numberofsections; g++) {
            for (var i = currentTriangle; i < currentTriangle + 4; i++) {
                var first = [0 + (t * 2), 0 + i];
                var second = [0 + (t * 2), 1 + i];
                switch (i) {
                    case 1:
                        first[0] += 1;
                        first[1] += 1;
                        break;
                    case 2:
                        first[0] += 1;
                        first[1] += 1;
                        second[0] += 2;
                        break;
                    case 3:
                        first[0] += 2;
                        second[0] += 2;
                        break;
                }
                var third = [1 + (t * 2), 0 + i];
                var triangleName = "triangle" + i;
                var stringOfPoints = pointsToString(first, second, third);
                document.getElementById(triangleName).setAttribute("points", stringOfPoints);
                document.getElementById(triangleName).setAttribute("fill", colors[Math.floor(Math.random() * 11)]);
                document.getElementById(triangleName).setAttribute("height", triangleheight);
                document.getElementById(triangleName).setAttribute("width", triagnleWidth);
            }
        }
        currentTriangle += 4;
    }
    console.log("did it?");
}