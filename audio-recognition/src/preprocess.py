import librosa
import numpy as np
import torch
from pathlib import Path

TARGET_LENGTH = 10  # target duration in seconds
SAMPLE_RATE = 22050  # Hz

def load_and_process_audio(file_path):
    audio, sr = librosa.load(file_path, sr=SAMPLE_RATE)
    target_length = TARGET_LENGTH * SAMPLE_RATE

    segments = []
    for start in range(0, len(audio), target_length // 2):  # 50% overlap
        end = start + target_length
        segment = audio[start:end]

        # Pad if segment is shorter than target length
        if len(segment) < target_length:
            segment = np.pad(segment, (0, target_length - len(segment)), 'constant')
        elif len(segment) > target_length:
            segment = segment[:target_length]
        
        # Convert to spectrogram and add to list
        spectrogram = librosa.feature.melspectrogram(segment, sr=SAMPLE_RATE)
        segments.append(torch.tensor(spectrogram))

    return segments

def preprocess_dataset(data_path, output_path):
    dataset = []
    for file_path in Path(data_path).glob("*.mp3"):
        segments = load_and_process_audio(file_path)
        dataset.extend(segments)
    torch.save(dataset, output_path)
    print(dataset)

# Run preprocessing
preprocess_dataset("data/audio_samples", "data/preprocessed_data.pt")
