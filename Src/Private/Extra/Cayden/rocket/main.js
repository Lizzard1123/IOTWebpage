//Constents
var GRAVITY = 9.8;
var PRECISION = 3;
//Inputs
var Apogee;
var Mass;
var Thrust;
//Varables
var altitude = 0.01;
var thrust_to_weight = 0;
var stopaltitude;

function roundP(num, p) { //This function takes a number and rounds it to an input precision
    var rounded = Math.round(num * (Math.pow(10, p))) / (Math.pow(10, p));
    return (rounded);
}

function Velocity_At_Alt(Alt) { //This function takes the current altitude and returns the current velocity
    var height_drop = Apogee - Alt; //the apogee minues the altitude and height_drop is the distance the rocket has fallen already
    var time = Math.sqrt(height_drop / (0.5 * GRAVITY)); //The equation for free fall solving for time
    var veloc = (time * GRAVITY); //The equation for velocity
    return (veloc);
}

function Grams_To_Kilograms(grams) { //This function takes input in grams and returns kilograms
    var Kilos = grams / 1000;
    return (Kilos);
}

function Total_Deceleration() { //This function calculates the total acceleration of the rocket by subtrating the acceleration of gravity by the acceleration of the rocket
    var thrust_acceleration = (Thrust / Grams_To_Kilograms(Mass)); //Acceleration = Force/Mass
    var total_deceleration = thrust_acceleration - GRAVITY; //Total acceleration = the rockets acceleration minus the acceleration of gravity
    return (total_deceleration);
}

function Distance_To_Stop(Alt) { //
    var distance = ((Math.pow(-Velocity_At_Alt(Alt), 2)) / (2 * Total_Deceleration()));
    return (distance);
}

function Check_Thrust_To_Weight() {
    var weight_in_newtons = Grams_To_Kilograms(Mass) * GRAVITY;
    var thrust_to_weight = Thrust / weight_in_newtons;
    return (thrust_to_weight);
}

function Main() {
    thrust_to_weight = roundP(Check_Thrust_To_Weight(), PRECISION);
    if (thrust_to_weight < 1) {
        return ("Thrust to weight is to low");
    } else {
        while (true) {
            if (roundP(Distance_To_Stop(altitude), PRECISION) == roundP(altitude, PRECISION)) {
                return (String(roundP(altitude, PRECISION)) + " Meters");
            }
            altitude = altitude + 0.01;
            if (altitude > Apogee) {
                return ("Not possable to land");
            }
        }
    }
}

document.getElementById('launchbtn').addEventListener('click', function() {
    document.querySelector('.rocket').classList.add('launchAnimation');
});

var calculate = document.getElementById("calculate");

calculate.onclick = function() {
    Apogee = document.getElementById("apogee").value;
    Mass = document.getElementById("mass").value;
    Thrust = document.getElementById("thrust").value;
    stopaltitude = Main();
    document.getElementById("t/w").innerText = thrust_to_weight;
    document.getElementById("ats").innerText = stopaltitude;
}