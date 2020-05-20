var pos = { x: 0, y: 0 };
var myWidth = 0, myHeight = 0;
updateDimensions();
function sky(x, y) {
    pos.x = x
    pos.y = y
    updateDimensions();


    document.getElementById("sun").style.background = '-webkit-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-moz-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
    document.getElementById("sun").style.background = '-ms-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';

    document.getElementById("sunDay").style.background = '-webkit-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-moz-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
    document.getElementById("sunDay").style.background = '-ms-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';

    document.getElementById("sunSet").style.background = '-webkit-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-moz-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
    document.getElementById("sunSet").style.background = '-ms-radial-gradient(' + pos.x + 'px ' + pos.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';

    document.getElementById("waterReflectionContainer").style.perspectiveOrigin = (pos.x / myWidth * 100).toString() + "% -15%";
    document.getElementById("waterReflectionMiddle").style.left = (pos.x - myWidth - (myWidth * .03)).toString() + "px";

    var bodyWidth = document.getElementsByTagName("body")[0].clientWidth;

    document.getElementById("sun").style.width = (bodyWidth);
    document.getElementById("sun").style.left = "0px";
    document.getElementById("sunDay").style.width = (bodyWidth);
    document.getElementById("sunDay").style.left = "0px";

    var sky = document.getElementById("sun");
    var water = document.getElementById("water");
    var waterHeight = water.clientHeight;
    var skyHeight = sky.clientHeight;
    var skyRatio = pos.y / skyHeight;
    var waterRatio = waterHeight / myHeight;
    document.getElementById("darknessOverlay").style.opacity = Math.min((pos.y - (myHeight / 2)) / (myHeight / 2), 1);
    document.getElementById("darknessOverlaySky").style.opacity = Math.min((pos.y - (myHeight * 7 / 10)) / (myHeight - (myHeight * 7 / 10)), 1);
    document.getElementById("moon").style.opacity = Math.min((pos.y - (myHeight * 9 / 10)) / (myHeight - (myHeight * 9 / 10)), 0.65);
    document.getElementById("horizonNight").style.opacity = (pos.y - (myHeight * 4 / 5)) / (myHeight - (myHeight * 4 / 5));

    document.getElementById("starsContainer").style.opacity = (pos.y / myHeight - 0.6);

    document.getElementById("waterDistance").style.opacity = (pos.y / myHeight + 0.6);
    document.getElementById("sunDay").style.opacity = (1 - pos.y / myHeight);
    document.getElementById("sky").style.opacity = Math.min((1 - pos.y / myHeight), 0.99);

    document.getElementById("sunSet").style.opacity = (pos.y / myHeight - 0.2);



    if (pos.y > 0) {
        var clouds = document.getElementsByClassName("cloud");
        for (var i = 0; i < clouds.length; i++) {
            clouds[i].style.left = Math.min(myWidth * (Math.pow(pos.y, 2) / Math.pow(myHeight / 2, 2)) * -1, 0);
        }


        var stars = document.getElementsByClassName('star');
        for (var i = 0; i < stars.length; i++) {
            stars[i].style.opacity = (pos.y / myHeight - 0.6);
        }


        if (pos.y > myHeight / 2) {
            document.getElementById("sun").style.opacity = Math.min((myHeight - pos.y) / (myHeight / 2) + 0.2, 0.5);
            document.getElementById("horizon").style.opacity = (myHeight - pos.y) / (myHeight / 2) + 0.2;

            document.getElementById("waterReflectionMiddle").style.opacity = (myHeight - pos.y) / (myHeight / 2) - 0.1;
        } else {
            document.getElementById("horizon").style.opacity = Math.min(pos.y / (myHeight / 2), 0.99);

            document.getElementById("sun").style.opacity = Math.min(pos.y / (myHeight / 2), 0.5);
            document.getElementById("waterReflectionMiddle").style.opacity = pos.y / (myHeight / 2) - 0.1;
        }

    }


};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sunset() {
    for (var j = myHeight / 10; j < myHeight; j += myHeight/ 80) {
        sky((2 * myWidth) / 3, j)
        await sleep(50)

    }
}
async function sunrise() {
    for (var j = myHeight; j > myHeight / 10; j -= myHeight/ 80) {
        sky((2 * myWidth) / 3, j)
        await sleep(50)

    }
}


function updateDimensions() {
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {

        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {

        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }

}


function windowResize() {
    updateDimensions();
    var skyHeight = document.getElementById("horizon").clientHeight;


    // update to new sky height
    skyHeight = document.getElementById("sun").clientHeight;
    document.getElementById("waterDistance").style.height = myHeight - skyHeight;
    document.getElementById("division").style.top = skyHeight;
}
