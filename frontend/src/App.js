import React, { useState } from "react";
import "./App.css";
import FileUpload from "./components/FileUpload";
import TrainButton from "./components/TrainButton";
import Progress from "./components/Progress";
import DownloadButton from "./components/DownloadButton";
import axios from "axios";

function App() {
  const [spectrograms, setSpectrograms] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/spectrogram",
        formData
      );

      // Store the spectrograms received from the backend for training
      setSpectrograms(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleTrain = async () => {
    // Train your GAN model with the spectrograms
    // You can send the spectrograms to the backend for training
    try {
      const response = await axios.post("http://localhost:5000/train", {
        spectrograms: spectrograms,
      });

      // Update the progress state as the training progresses
      setProgress(response.data.progress);
    } catch (error) {
      console.error("Error training the model:", error);
    }
  };

  const handleDownload = async () => {
    // Download the generated audio
    try {
      const response = await axios.post("http://localhost:5000/audio", {
        spectrogram: spectrograms[0], // Just for testing, you may need to adjust this
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "generated_audio.wav");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minimal/Micro-House Music Generator</h1>
        <FileUpload onUpload={handleUpload} />
        <TrainButton onClick={handleTrain} />
        <Progress value={progress} />
        <DownloadButton onClick={handleDownload} />
      </header>
    </div>
  );
}

export default App;
