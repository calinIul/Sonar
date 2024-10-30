import torch

# Load the data
data = torch.load("data/preprocessed_data.pt")

# Check if data is a list and its length
print("Data type:", type(data))
print("Data length:", len(data))
if len(data) > 0:
    print("First item shape:", data[0].shape)
else:
    print("The data file is empty or not in the expected format.")
