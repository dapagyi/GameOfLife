//Apagyi Dávid
//apagyi.david@gmail.com
//2018. 01. 30.
//TechTábor - Game of Life


//Egy tömbökből álló tömb tartalmaz-e egy adott tömböt (a beépített függvény nem működött)
function contains(arrayOfArrays, array){
    if (arrayOfArrays != null){
        for(var i=0;i<arrayOfArrays.length;i++){
            if (arrayOfArrays[i][0]==array[0] && arrayOfArrays[i][1]==array[1]) return true;
        }
    }
    return false;
}

//Adott cella és az azt körülvevő 8 mező tömbje
function szomszedKilenc(cell){
    var x = cell[0], y = cell[1];
    //szépen, de bonyolultan var diff = [-1,0,+1]; ...
    //csúnyán, de egyszerűen:
    var neighbours = [  [x-1,y+1],  [x,y+1],    [x+1, y+1],
                        [x-1, y],   [x, y],     [x+1, y],
                        [x-1, y-1], [x,y-1],    [x+1, y-1]];
    return neighbours;
}

//Egy cellákból álló tömbben az élő cellák száma
function elokSzama(cells, aliveCells){
    var n = 0;
    for(var i=0; i<cells.length; i++){
        if (contains(aliveCells,cells[i])) n++;
    }
    return n;
}

//Adott cella következő értéke
function cellNextValue(cell, aliveCells){
    var x = cell[0], y = cell[1];;
    var el = contains(aliveCells, cell);

    var eloSzomszedok = (el ? elokSzama(szomszedKilenc(cell),aliveCells) - 1 : elokSzama(szomszedKilenc(cell),aliveCells));

    var cellNValue = false;
    if ((el && (eloSzomszedok == 2 || eloSzomszedok == 3)) || (!el && eloSzomszedok == 3)) cellNValue = true;
    return cellNValue;
}

//A következő állapotban élő cellák
function nextState(alive) {

    //Az állapotváltoztatásra képes cellák (élők és azok szomszédai)
    var osszescella = [];
    for(var i=0; i<alive.length; i++){
        var szomsz = szomszedKilenc(alive[i]);
        for (var j=0; j<szomsz.length; j++){
            osszescella.push(szomsz[j]);
        }
    }

    //Élők kigyűjtése
    var nextAlive = [];
    for(var i=0; i<osszescella.length; i++){
        if (!contains(nextAlive,osszescella[i]) && cellNextValue(osszescella[i],alive)) nextAlive.push(osszescella[i]);
    }

    return nextAlive;
};

//PNG fájl készítése az élő cellák alapján
var fs = require('fs');
var drawing = require('pngjs-draw');
var png = drawing(require('pngjs').PNG);
function drawPNG(points, ki){
fs.createReadStream("alap.png")
  .pipe(new png({ filterType: 4 }))
  .on('parsed', function() {
    //TODO: dinamikus méretű vászon, okosabb elhelyezés (?? nagyobb memóriaigény)
    for(var i=0; i<points.length; i++){
        this.fillRect(800+40*points[i][0],2000-(800+40*points[i][1]),40,40, this.colors.black(255))
    }

    this.pack().pipe(fs.createWriteStream(ki));
    });
}

//Kezdőcellák
var alives = [
    [-10,15],
    [-10,13],
    [-9,12],
    [-8,12],
    [-7,12],
    [-6,12],
    [-6,13],
    [-6,14],
    [-7,15]
];

var dir = './output';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
for(var i=0; i<=20; i++){
    drawPNG(alives,dir+'/'+i+'.png');
    alives = nextState(alives);
}
console.log('end');