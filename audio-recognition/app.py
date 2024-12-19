from flask import Flask, request, jsonify
from test import id_song
import os

app = Flask(__name__)

@app.route('/')
def main():
    return jsonify({"error": "Nothing to see here"}), 404

@app.route('/identify', methods=['POST', 'GET'])
def identify_song():
    print("Endpoint hit")
    data = request.json
    stream_url = data.get('streamUrl')
    
    if not stream_url:
        return jsonify({"error": "No stream URL provided"}), 400
    
    
    result = id_song(stream_url)
    
    
    
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
