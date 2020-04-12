$(document).ready(function () {  // Use closure, no globals
    let scores;
    let current_question = 0;
    let questions;
    let model;

    initialize();

    async function initialize(){
        questions = await $.getJSON("questions/default.json");
        model = await $.getJSON("models/default.json");
        questions = questions.questions;
        scores = new Array(questions.length).fill(0);
        // Shuffle Quesions
        questions.sort(() => Math.random() - 0.5);

        $("#btn-strongly-positive")
            .click(()=>{ scores[current_question] = +1.0; next_question() });
        $("#btn-positive")          
            .click(()=>{ scores[current_question] = +0.5; next_question() });
        $("#btn-uncertain")        
            .click(()=>{ scores[current_question] =  0.0; next_question() });
        $("#btn-negative")         
            .click(()=>{ scores[current_question] = -0.5; next_question() });
        $("#btn-strongly-negative")
            .click(()=>{ scores[current_question] = -1.0; next_question() });

        $("#btn-prev").click(()=>{ prev_question() });

        render_question();
    }

    function render_question() {
        $("#question-text").html(questions[current_question].text);
        $("#question-number").html(`第 ${current_question + 1} 题 剩余 ${questions.length - current_question - 1} 题`);
        if (current_question == 0) {
            $("#btn-prev").attr("disabled", "disabled");
        } else {
            $("#btn-prev").removeAttr("disabled");
        }
    }

    function next_question() {
        if (current_question < questions.length - 1) {
            current_question++;
            render_question();
        } else {
            results();
        }
    }

    function prev_question() {
        if (current_question != 0) {
            current_question--;
            render_question();
        }

    }

    function results() {
        let score = new Array(5).fill(0);
        let max_score = [...score];
        for (let i = 0; i < scores.length; i ++ ) {
            for (let key = 0; key < 5; key ++){
                score[key] += scores[i] * questions[i].evaluation[key];
                max_score[key] += Math.abs(questions[i].evaluation[key]);
            }
        }

        for (let key = 0; key < 5; key ++ ){
            score[key] = (score[key] + max_score[key]) / (2*max_score[key]);
            score[key] = Math.round(score[key] * 100);
        } 

        let request = {
            model: "default",
            score: score.join("$")
        };
        location.href = "result.html?" + $.param(request); 
    }
});
