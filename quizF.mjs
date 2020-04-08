var max_econ, max_dipl, max_govt, max_scty, max_envo; // Max possible scores
max_econ = max_dipl = max_govt = max_scty = max_envo = 0;
var econ, dipl, govt, scty, envo; // User's scores
econ = dipl = govt = scty = envo = 0;
var qn = 0; // Question number
var prev_answer = null;
init_question();
for (var i = 0; i < questions.length; i++) {
    max_econ += Math.abs(questions[i].effect.econ)
    max_dipl += Math.abs(questions[i].effect.dipl)
    max_govt += Math.abs(questions[i].effect.govt)
    max_scty += Math.abs(questions[i].effect.scty)
    max_envo += Math.abs(questions[i].effect.envo)
}
function init_question() {
    document.getElementById("question-text").innerHTML = questions[qn].question;
    document.getElementById("question-number").innerHTML = "第" + (qn + 1) + "题" + " 剩余 " + (questions.length - qn - 1) + "题";
    if (prev_answer == null) {
        document.getElementById("back_button").style.display = 'none';
        document.getElementById("back_button_off").style.display = 'block';
    } else {
        document.getElementById("back_button").style.display = 'block';
        document.getElementById("back_button_off").style.display = 'none';
    }

}

function next_question(mult) {
    econ += mult * questions[qn].effect.econ
    dipl += mult * questions[qn].effect.dipl
    govt += mult * questions[qn].effect.govt
    scty += mult * questions[qn].effect.scty
    envo += mult * questions[qn].effect.envo
    qn++;
    prev_answer = mult;
    if (qn < questions.length) {
        init_question();
    } else {
        results();
    }
}
function prev_question() {
    if (prev_answer == null) {
        return;
    }
    qn--;
    econ -= prev_answer * questions[qn].effect.econ;
    dipl -= prev_answer * questions[qn].effect.dipl;
    govt -= prev_answer * questions[qn].effect.govt;
    scty -= prev_answer * questions[qn].effect.scty;
    envo -= prev_answer * questions[qn].effect.envo;
    prev_answer = null;
    init_question();

}
function calc_score(score, max) {
    return (100 * (max + score) / (2 * max)).toFixed(1)
}
function results() {
    location.href = `results.html`
        + `?e=${calc_score(econ, max_econ)}`
        + `&d=${calc_score(dipl, max_dipl)}`
        + `&g=${calc_score(govt, max_govt)}`
        + `&s=${calc_score(scty, max_scty)}`
        + `&i=${calc_score(envo, max_envo)}`
}