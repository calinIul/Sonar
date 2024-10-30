# infer.py
import torch
from train import SimpleCNN
from preprocess import extract_features

def load_model():
    model = SimpleCNN()
    model.load_state_dict(torch.load("model/song_recognition_model.pth"))
    model.eval()
    return model

def predict_song(file_path, model):
    mel_spec_db = extract_features(file_path)
    input_tensor = torch.tensor(mel_spec_db).unsqueeze(0).unsqueeze(0)  # Add batch and channel dimensions
    with torch.no_grad():
        output = model(input_tensor)
        predicted_class = torch.argmax(output, dim=1).item()
    return predicted_class

if __name__ == "__main__":
    model = load_model()
    song_class = predict_song("data/sample_audio.mp3", model)
    print("Predicted Song Class:", song_class)
