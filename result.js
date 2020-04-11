$(document).ready(function(){
    let model;
    let score;
    async function initialize(){
        let url = decodeURIComponent(window.location.search.substring(1));
        let params = url.split("&");
        for (let pair of params){
            let [key, value] = pair.split("=")
            if (key == "model"){
                model = await $.getJSON(`models/${value}.json`);
            }
            else if (key == "score"){
                score = value.split("$").map((x)=>parseInt(x));
            }
        }

        if (model == undefined || score == undefined){
            console.log("failed to parse parameters");
        }

        drawGraph();
    }

    function drawGraph(){
        const width = 600;
        const height = 800;
        const Y_STEP = 100;
        const font_l = {
            family: 'Helvetica',
            size: 24,
            anchor: 'start',
            leading: '1em'
        };
        const font_light = {
            family: 'Helvetica',
            size: 24,
            anchor: 'start',
            leading: '1em',
            weight: 300
        };
        const font_r = {
            family: 'Helvetica',
            size: 24,
            anchor: 'end',
            leading: '1em'
        };
        const font_ideology = {
            family: 'Helvetica',
            size: 40,
            anchor: 'start',
            weight: 300
        };
        const font_title = {
            family: "monospace",
            size: 16,
            anchor: 'start'
        }

        let svg = SVG(document.getElementById("graph"));
        svg.rect(width, height).x(0).y(0).fill("#EEE");


        for (let i = 0; i < model.dimensions.length; i ++){
            let y = i*Y_STEP;
            // draw progress bar
            let gradient = svg.gradient("linear", (add)=>{
                add.stop(0, "#d06");
                add.stop((score[i] - 2)/100, "#d06");
                add.stop((score[i] + 2)/100, "#0d9");
                add.stop(1, "#0d9");
            });
            svg.rect().attr({
                width: 400,
                height: 40,
                x: 100,
                y: 40 + y,
                rx: 5,
                ry: 5,
                fill: gradient
            });

            // draw percentage
            svg.text(score[i]+"%").attr({
                x: 100 + 5,
                y: y + 40 + 5,
                fill: "#FFF",
            }).font(font_l);
            svg.text((100-score[i])+"%").attr({
                x: 500 - 5,
                y: y + 40 + 5,
                fill: "#FFF",
            }).font(font_r);

            // draw text
            let explanation = model.explanations[i][6 - Math.round((score[i]/100) * 6)];
            let opposite = model.dimensions[i].split("-");
            svg.text(explanation).attr({
                x: 100,
                y: y + 5,
                fill: "#000"
            }).font(font_light);
            svg.text(opposite[0]).attr({
                x: 100 - 5,
                y: y + 40 + 5,
                fill: "#000"
            }).font(font_r);
            svg.text(opposite[1]).attr({
                x: 500 + 5,
                y: y + 40 + 5,
                fill: "#000"
            }).font(font_l);
        }
        
        let y = model.dimensions.length * Y_STEP;
        let ideology = findIdeology(score, model.ideologies);
        svg.text("最接近的意识形态:").attr({
            x: 50,
            y: y + 30,
            fill: "black"
        }).font(font_l);
        svg.text(ideology).attr({
            x: 100,
            y: y + 60,
            fill: "black"
        }).font(font_ideology);
        svg.text("Yet Another Values Test").attr({
            x: 20,
            y: height - 60,
            fill: "black"
        }).font(font_title);
        svg.text("yavt.fengtao.xyz").attr({
            x: 20,
            y: height - 40,
            fill: "black"
        }).font(font_title);
        svg.image("SVGS/qrcode.svg").attr({
            x: 360,
            y: 530,
            width: 200,
            height: 200,
        });
        svg.text("基于8 value的倾向测试").attr({
            x: 370,
            y: height - 60,
            fill: "black"
        }).font(font_title);
    }

    function vecDistance( vec1, vec2 ){
        let distance = 0;
        vec1.forEach((value, index)=>{
            distance += (value - vec2[index]) ** 2;
        });

        return Math.sqrt(distance);
    }

    function findIdeology( score, ideologies ) {
        let ideology = Object.keys(ideologies)[0];
        let min_distance = vecDistance(ideologies[ideology], score);

        for (let [key, value] of Object.entries(ideologies)){
            let distance = vecDistance(value, score);
            if (distance < min_distance) {
                ideology = key;
                min_distance = distance;
            }
        }

        return ideology;
    }

    initialize();
});
