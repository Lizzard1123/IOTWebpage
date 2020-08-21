const lizzardup = './img/lizzardup.png';
const lizzardup = './img/lizzarddown.png';
const totalheight = document.documentElement.scrollHeight;
const totalwidth = window.innerWidth;

function addlizzard(number) {
    for (var i = 0; i < number; i++) {
        let x = Math.round(Math.random() * totalwidth);
        let y = Math.round(Math.random() * totalheight);
    }
}