from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO("yolov8n.pt")


@app.route("/")
def home():
    return jsonify({
        "message": "EcoSort AI backend is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded"
        }), 400

    image_file = request.files["image"]

    image = Image.open(image_file)

    results = model(image)

    detections = []

    for result in results:
        for box in result.boxes:

            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names[class_id]

            detections.append({
                "class": class_name,
                "confidence": round(confidence * 100, 2)
            })

    return jsonify({
        "success": True,
        "detections": detections
    })


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 10000))

    app.run(
        host="0.0.0.0",
        port=port
    )