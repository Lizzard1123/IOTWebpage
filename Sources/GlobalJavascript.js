function backpoints(width, height) {
    var numberhigh = 15;
    var triangleheight = height / numberhigh;
    var numberwide = 25;
    var triagnleWidth = width / numberwide;
    var coords = [];
    var count = 0;
    for (var g = 0; g < numberhigh; g += triangleheight) {
        var row = [];
        count++;
        if (count % 2 == 0) {
            for (var i = triagnleWidth / 2; i < numberwide - 1; i += triagnleWidth) {
                row.push([i, g]);
            }
        } else {
            for (var i = 0; i < numberwide; i += triagnleWidth) {
                row.push([i, g]);
            }
        }
        coords.push(row);
    }
    return coords;
}