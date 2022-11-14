<head>
    <title>Main page</title>
    <link rel="stylesheet" href="templates/main.css" type="text/css"/>
    <script src="templates/main.js"></script>
</head>
<body>
    <div id="settings">
        <textarea name="songtext" id="text" oninput="setBaseText()"></textarea>
        <input type="range" name="speed" id="speed" class="range" min="60" max="300" value="150" step="30" onchange="setBaseText();">
        <p id="speedValue">150</p>
        <script>
            var slider = document.getElementById("speed");
            var output = document.getElementById("speedValue");
            output.innerHTML = slider.value;

            slider.oninput = function() {
                output.innerHTML = this.value;
                words1s = slider.value / 60;
            }
        </script>
    </div>
    <div id="final">
        <div id="progressbar"></div>

        <canvas class="canvas"></canvas>
        <canvas class="canvas"></canvas>
        <canvas class="canvas"></canvas>
    </div>

    <div id="buttons">
        <button id="play" class="btn" onclick="Play()">Play</button>
        <button id="stop" class="btn">Stop</button>
    </div>

    <p id="copyright">Developed by "homeyadev" (sashacpp), zankokun, Vector++.</p>
</body>