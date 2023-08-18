from flask import Flask, request, jsonify, send_file
import librosa
import numpy as np
import io
from scipy.io.wavfile import write

app = Flask(__name__)


@app.route("/spectrogram", methods=["POST"])
def generate_spectrogram():
    file = request.files["file"]
    y, sr = librosa.load(file, sr=None, mono=True)

    hop_length = 512  # Increase the hop length to focus on repetitive patterns
    n_mels = 128  # Increase the number of mel bands for better frequency resolution
    spectrogram = librosa.feature.melspectrogram(
        y, sr, hop_length=hop_length, n_mels=n_mels
    )
    spectrogram = librosa.power_to_db(spectrogram)
    spectrogram = np.asarray(spectrogram)
    return jsonify(spectrogram.tolist())


@app.route("/audio", methods=["POST"])
def generate_audio():
    spectrogram = np.asarray(request.json["spectrogram"])
    audio = librosa.db_to_power(spectrogram)

    hop_length = 512  # Use the same hop length as in the spectrogram generation
    audio = librosa.feature.inverse.mel_to_audio(
        audio, sr=sr, hop_length=hop_length, n_iter=32
    )
    buffer = io.BytesIO()
    write(buffer, librosa.get_samplerate(), audio.astype(np.float32))
    buffer.seek(0)
    return send_file(
        buffer, mimetype="audio/wav", attachment_filename="generated_audio.wav"
    )


if __name__ == "__main__":
    app.run(debug=True)
