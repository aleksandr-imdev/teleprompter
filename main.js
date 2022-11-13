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
    sentences = sentences.filter(e => e);
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

        const average = wordsInSentence.reduce((a, b) => a + b.length, 0) / wordsInSentence.length;
        let time = element.length / (average * words1s);
        return time;
    });


    var maxWidth = canvas[0].width * 0.96;
    var index = 0;
    var intervals = []
    var timeouts = []
    var lastIsCleared = false;

    function func() {
        let internalIndex = index;
        let index3  = internalIndex % 3;
        if(internalIndex == sentences.length || isPlaying == false){
            lastIsCleared = true;
            ctx.forEach((element, i) => {
                element.clearRect(0, 0, canvas[i].width, canvas[i].height);
            });
            intervals.forEach((id)=>{
                clearInterval(id);
            });
            timeouts.forEach((id)=>{
                clearTimeout(id);
            });
            isPlaying = false;
            return;
        }
        else if(internalIndex % 3 == 0 && internalIndex > 0){
            lastIsCleared = true;
            ctx.forEach((element, i) => {
                element.clearRect(0, 0, canvas[i].width, canvas[i].height);
            });
        }
        ctx[index3].font = "22px Tahoma";
        ctx[index3].fillStyle = "black";
        ctx[index3].clearRect(0, 0, canvas[index3].width, canvas[index3].height);
        ctx[index3].fillText(sentences[internalIndex], canvas[index3].width * 0.02, canvas[index3].height / 2, maxWidth);

        let progressBar = 0;
        let progress = setInterval(() => {
            if (progressBar == 100 || isPlaying == false) {
                clearInterval(progress);
                if(lastIsCleared == false) {
                    ctx[index3].clearRect(0, 0, canvas[index3].width, canvas[index3].height);
                    ctx[index3].fillStyle = "darkgrey";
                    ctx[index3].font = "20px Tahoma";
                    ctx[index3].fillText(sentences[internalIndex], canvas[index3].width * 0.02, canvas[index3].height / 2, maxWidth);
                }
                else{
                    lastIsCleared = false;
                }
                return;
            }
            ctx[index3].fillRect(canvas[index3].width * 0.02, canvas[index3].height * 0.98, ctx[index3].measureText(sentences[internalIndex]).width  * progressBar / 100, canvas[index3].height * 0.02);
            progressBar++;
        }, displayTime[internalIndex] * 10);
        intervals.push(progress);
        let id = setTimeout(func, displayTime[internalIndex]*1000);
        timeouts.push(id);
        index++;
    };

    document.getElementById("stop").onclick = () => {
        intervals.forEach((id)=>{
            clearInterval(id);
        });
        timeouts.forEach((id)=>{
            clearTimeout(id);
        });
        ctx.forEach((element, i) => {
            isPlaying = false;
            element.font = "20px Tahoma";
            element.fillStyle = "darkgrey";
            element.clearRect(0, 0, canvas[i].width, canvas[i].height)
        })
        ctx[0].font = "22px Tahoma";
    };

    func();
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
