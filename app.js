const Application = PIXI.Application;
const Graphics = PIXI.Graphics;
const Text = PIXI.Text;

const App = PIXI.Application;

const app = new Application();
const appWidth = window.innerWidth * .9;
const appHeight = window.innerHeight * .9;
app.renderer.resize(appWidth, appHeight);
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

const wordList = [];
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", 'bipList.txt', false);
xmlhttp.send();
if (xmlhttp.status==200) {
  wordList.push(...xmlhttp.responseText.toUpperCase().split('\r\n'));
}

const maxWords = 5;
const words = [];
const texts = [];
const edgeBuffer = 100;
const fontSize = 46;
const generateWords = () => {
    while (words.length < maxWords) {
        const newWord = wordList[Math.floor(Math.random()*wordList.length)];
        words.push(newWord);
        const text = new Text(newWord, {
            fontSize: fontSize,
            lineHeight: fontSize + 2,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
        });
        app.stage.addChild(text);
        texts.push(text);
        text.x = Math.random() * (appWidth - (edgeBuffer * 2)) + edgeBuffer;
        text.y = Math.random() * (appHeight - (edgeBuffer * 2)) + edgeBuffer;
        text.flipped = false;
        text.scale.x = 0;
        text.scale.y = 0;
    }
};

const scaleSpeed = 0.004;
const resizeWords = () => {
    for (let i = 0; i < words.length; i++) {
        if (texts[i].flipped) {
            texts[i].scale.x += scaleSpeed * -1;
            texts[i].scale.y += scaleSpeed * -1;
            if (texts[i].scale.x <= 0) {
                app.stage.removeChild(texts[i]);
                texts.splice(i, 1);
                words.splice(i, 1);
            }
        } else {
            if (texts[i].scale.x >= 1) {
                texts[i].flipped = true;
            } else {
                texts[i].scale.x += scaleSpeed;
                texts[i].scale.y += scaleSpeed;
            }
        }

    }
}

const attempt = new Text('', {
    fontSize: fontSize,
    lineHeight: fontSize + 2,
    letterSpacing: 0,
    fill: 0xffffff,
    align: "center"
});
app.stage.addChild(attempt);

var score = 0;
const scoreText = new Text(score.toString(), {
    fontSize: fontSize,
    lineHeight: fontSize + 2,
    letterSpacing: 0,
    fill: 0xffffff,
    align: "center"
});
app.stage.addChild(scoreText);
scoreText.y = appHeight - (fontSize + 10);
scoreText.x = 10;

app.ticker.add((delta) => loop(delta));
function loop(delta) {
    generateWords();
    resizeWords();
}

const pointBase = 100;
const scoreWord = (text) => {
    score += pointBase;
    if (text.flipped) {
        score -= pointBase * text.scale.x;
    } else {
        score += pointBase * text.scale.x;
    }
    score = Math.floor(score);
    scoreText.text = score.toString();
};

document.addEventListener('keydown', function(e) {
    if(e.key === 'Enter') {
        for (let i = 0; i < words.length; i++) {
            if (words[i] === attempt.text) {
                scoreWord(texts[i]);
                app.stage.removeChild(texts[i]);
                texts.splice(i, 1);
                words.splice(i, 1);
            }
        };
        attempt.text = '';
    }
    if (e.key.match(/^[a-z]{1}$/i)) {
        attempt.text += e.key.toUpperCase();
    }
});
