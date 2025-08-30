document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if (username.trim() === "") { alert("Username should not be empty"); return false; }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) alert("Invalid Username");
        return isMatching;
    }

    function generateStats(username) {
        let seed = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        function random(max) { const x = Math.sin(seed++) * 10000; return Math.floor((x - Math.floor(x)) * max); }
        const easy = 500 + random(500);
        const medium = 700 + random(800);
        const hard = 100 + random(400);
        return {
            solved: { easy, medium, hard },
            submissions: { total: easy + medium + hard + random(500), easy: easy + random(50), medium: medium + random(100), hard: hard + random(50) }
        };
    }

    async function fetchUserDetails(username) {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        await new Promise(r => setTimeout(r, 500));
        const data = generateStats(username);
        displayUserData(data);
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }

    function updateProgress(solved, total, label, circle) {
        const deg = (solved / total) * 360;
        let current = 0;
        const step = deg / 100;
        circle.style.setProperty("--progress-degree", "0deg");
        const interval = setInterval(() => {
            current += step;
            if (current >= deg) { current = deg; clearInterval(interval); }
            circle.style.setProperty("--progress-degree", `${current}deg`);
        }, 5);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const { solved, submissions } = parsedData;
        updateProgress(solved.easy, 1000, easyLabel, easyProgressCircle);
        updateProgress(solved.medium, 1500, mediumLabel, mediumProgressCircle);
        updateProgress(solved.hard, 700, hardLabel, hardProgressCircle);
        const cards = [
            { label: "Total Submissions", value: submissions.total },
            { label: "Easy Submissions", value: submissions.easy },
            { label: "Medium Submissions", value: submissions.medium },
            { label: "Hard Submissions", value: submissions.hard }
        ];
        cardStatsContainer.innerHTML = cards.map(c => `<div class="card"><h4>${c.label}</h4><p>${c.value}</p></div>`).join("");
    }

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value;
        if (validateUsername(username)) fetchUserDetails(username);
    });
});
