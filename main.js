var sentences; //sentences in the text
var words1s; //words every 1 sec
var isPlaying = false;

//set text in window and calculate animation time
function setBaseText()
{
    var textarea = document.getElementById("text");

    sentences = textarea.value.replace(/\. +/g,'.|').replace(/\? /g,'?|').replace(/\! /g,'!|').replace(/[\n\r]/g, '|').split("|");
    sentences.forEach(element => {
        element = element.replace(/^\s+/g, ' ').trim();
    });
    console.log(sentences);

    var slider = document.getElementById("speed");
    words1s = slider.value / 60;
}

function showErr(valueHtml) 
{
    var text = document.createElement('h1');
    var errArea = document.createElement('div');
    errArea.appendChild(text);
    document.body.appendChild(errArea);
    errArea.id = "error";

    var animation = errArea.animate([
        {opacity: '0'},
        {opacity: '1'}
    ], 300);
    animation.addEventListener('finish', () => {
        if (animation.playbackRate == -1) {
            errArea.style.opacity = '0';
            animation.removeEventListener("finish", this);
            errArea.remove();
        }
        else errArea.style.opacity = '1';
    });

    text.innerHTML = valueHtml;

    let timer = 6;
    let timerId = setInterval(() => {
        timer--;
        errArea.onmouseover = () => timer = 7;

        if (timer == 0) {
            clearInterval(timerId);

            animation.playbackRate = -1;
            animation.play();
        }
    }, 1000);
}

//play text
function Play()
{
    if (sentences == undefined || sentences[0] == '') {
        showErr("No text entered.");
        return;
    }

    if (isPlaying == true) return;
    isPlaying = true;

    var canvas = Array.from(document.getElementsByClassName("canvas"));
    var ctx = canvas.map(element => element.getContext("2d"));

    /*for (let index = 0; index < sentences.length; index++) {
        if (ctx[0].measureText(sentences[index]).width > canvas[0].width * 0.7) {showErr("The sentence: \"" + sentences[index] + "\" is too long. Shorten it or split into several parts."); return;}
    }*/

    const displayTime = sentences.map(element => {
        let wordsInSentence = element.split(' ');
        wordsInSentence.forEach(word => {
            word = word.length; 
        });

        const average = wordsInSentence.reduce((a, b) => a + b.length, -1) / wordsInSentence.length;
        element = element.length / (average * words1s);
        return element;
    });

    document.getElementById("stop").onclick = () => {
        ctx.forEach((element, i) => {
            isPlaying = false;
            element.font = "20px Tahoma";
            element.fillStyle = "darkgrey";
            element.clearRect(0, 0, canvas[i].width, canvas[i].height)
        })
        ctx[0].font = "22px Tahoma";
    };

    var maxWidth = canvas[0].width * 0.96;
    ctx[0].fillStyle = "black";
    ctx.forEach((element, index) => {
        if (sentences[index] != undefined) element.fillText(sentences[index], canvas[0].width * 0.02, canvas[0].height / 2, maxWidth);
    });

    var index = 0;
    var timer = setTimeout(function func() {
        if (isPlaying == false) return;

        if (index % 3 == 0) {
            ctx.forEach((element, i) => {
                element.font = "20px Tahoma";
                element.fillStyle = "darkgrey";
                element.clearRect(0, 0, canvas[i].width, canvas[i].height);
                if (sentences[index + i] != undefined) element.fillText(sentences[index + i], canvas[0].width * 0.02, canvas[0].height / 2, maxWidth);
            });
        }

        ctx[index % 3].font = "22px Tahoma";
        ctx[index % 3].fillStyle = "black";
        ctx[index % 3].clearRect(0, 0, canvas[0].width, canvas[0].height);
        if (sentences[index] != undefined) ctx[index % 3].fillText(sentences[index], canvas[0].width * 0.02, canvas[0].height / 2, maxWidth);

        if (index >= 1 && index % 3 != 0) {
            ctx[(index - 1) % 3].clearRect(0, 0, canvas[0].width, canvas[0].height);
            ctx[(index - 1) % 3].fillStyle = "darkgrey";
            ctx[(index - 1) % 3].font = "20px Tahoma";
            ctx[(index - 1) % 3].fillText(sentences[index - 1], canvas[0].width * 0.02, canvas[0].height / 2, maxWidth);
            ctx[(index - 1) % 3].clearRect(0, canvas[0].height * 0.98, canvas[0].width, canvas[0].height);
        }

        if (sentences.length == index) {
            ctx.forEach(element => {
                element.font = "20px Tahoma";
                element.fillStyle = "darkgrey";
                element.clearRect(0, 0, canvas[0].width, canvas[0].height);
                ctx[0].font == "22px Tahoma";
            });
            isPlaying = false;
            return;
        };

        setTimeout(func, displayTime[index] * 1000);
        index++;
    }, displayTime[index] * 1000);
}

//set base parameters on load
window.onload = function() {
    var canvas = Array.from(document.getElementsByClassName("canvas"));
    canvas.forEach(element => {
        element.width = element.parentElement.offsetWidth;
        element.height = element.parentElement.offsetHeight / 3; 

        let ctx = element.getContext("2d");
        ctx.font = "20px Tahoma";
        ctx.fillStyle = "darkgrey";
        ctx.textAlign = "start";
    });
    canvas[0].getContext("2d").font = "22px Tahoma";

    /*var gradient = ctx.createLinearGradient(0, 0, 30, 0);
    gradient.addColorStop(0.00, 'black');
    gradient.addColorStop(0.01, 'grey');
    gradient.addColorStop(1.00, 'grey');
    ctx.fillStyle = gradient;*/
}

//change canvas size, when changing window size
window.addEventListener("resize", function() {
    var canvas = Array.from(document.getElementsByClassName("canvas"));
    canvas.forEach(element => {
        element.width = element.parentElement.offsetWidth;
        element.height = element.parentElement.offsetHeight / 3; 
    });
});

//:) it's not so easy

