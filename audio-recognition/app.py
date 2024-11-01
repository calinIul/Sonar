from flask import Flask, request, jsonify
import os
import test  # Import your function here
from test import id_song
app = Flask(__name__)

@app.route('/identify', methods=['POST'])
def identify_song():
    data = request.json
    stream_url = data.get('streamUrl')
    
    if not stream_url:
        return jsonify({"error": "No stream URL provided"}), 400
    
    # Call your function to identify the song from the stream
    result = id_song(stream_url)
    
    
    return result

if __name__ == '__main__':
    app.run(port=5001)
