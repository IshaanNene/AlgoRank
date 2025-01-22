function toggleSection(section) {
    const element = document.querySelector(`.${section}-section`);
    const button = element.querySelector('.expand-button');

    if (element.style.flex === '0') {
        element.style.flex = '1';
        button.textContent = 'Collapse';
    } else {
        element.style.flex = '0';
        button.textContent = 'Expand';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("runButton").addEventListener("click", async function () {
        const code = document.getElementById("code").value.trim();
        const outputDiv = document.getElementById("output");

        if (!code) {
            outputDiv.innerHTML = "<span class='error'>Error: Code cannot be empty!</span>";
            return;
        }

        const formData = new FormData();
        formData.append("code", code);

        try {
            const response = await fetch("/compile_run", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();

            if (result.status === "success") {
                let outputHTML = `<strong class="success">${result.compile_time}</strong>\n`;
                result.results.forEach(test => {
                    outputHTML += `
                        <div class="test-result">
                            <strong>Test Case ${test.test_case}:</strong><br>
                            Input: ${test.input}<br>
                            Expected Output: ${test.expected_output}<br>
                            Actual Output: ${test.actual_output}<br>
                            Explanation: <pre>${test.explanation}</pre><br>
                            Status: <span class="${test.status === "success" ? "success" : "error"}">${test.status}</span>
                        </div>
                        <hr>
                    `;
                });
                outputDiv.innerHTML = outputHTML;
            } else {
                outputDiv.innerHTML = `<span class='error'>${result.message}</span>`;
            }
        } catch (error) {
            outputDiv.innerHTML = "<span class='error'>Error: Failed to communicate with the server.</span>";
        }
    });
});
