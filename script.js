const wasteImage = document.getElementById("wasteImage");
const scanBtn = document.getElementById("scanBtn");
const result = document.getElementById("result");

scanBtn.addEventListener("click", async () => {

    // Check image
    if (!wasteImage.files.length) {
        result.innerHTML = "⚠️ Please select a waste image.";
        return;
    }

    const image = wasteImage.files[0];

    // Create form data
    const formData = new FormData();
    formData.append("image", image);

    result.innerHTML = "🤖 AI is analyzing the image...";

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            result.innerHTML =
                "❌ Error: " + data.message;
            return;
        }

        if (!data.detections || data.detections.length === 0) {
            result.innerHTML =
                "🔍 No object detected.";
            return;
        }

        let output = "<h3>♻️ Detection Result</h3>";

        data.detections.forEach(item => {

            output += `
                <div>
                    <strong>${item.class}</strong>
                    -
                    ${item.confidence}% confidence
                </div>
            `;

        });

        result.innerHTML = output;

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            ❌ Could not connect to AI API.<br>
            Make sure the Flask server is running.
        `;
    }
});