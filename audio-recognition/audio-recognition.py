from quart import Quart, request, jsonify
from controller import id_song, get_fingerprint, capture_sample_from_stream
import asyncio
import os

app = Quart(__name__)

@app.route('/')
def main():
    return jsonify({"error": "Nothing to see here"}), 404

@app.route('/fingerprint', methods=['POST', 'GET'])
def _get_fingerprint():
    
    data = request.json
    file_path = data.get('filePath')
    
    if not file_path:
        return jsonify({"error": "No file path provided"}), 400
    
    result = get_fingerprint(file_path)
    
    return jsonify(result)

@app.route('/sample', methods=['POST'])
async def _capture_sample():
    """
    API endpoint to capture a sample from a stream and return metadata.
    """
    data = await request.json
    stream_url = data.get('streamUrl')
    duration_sec = data.get('durationSec')
    output_file = data.get('filePath')

    metadata = await capture_sample_from_stream(stream_url, duration_sec, output_file)
    if (metadata and metadata.get('StreamTitle')):
        return jsonify({
            "artist": metadata.get('StreamTitle').split(' - ')[0],
            "title": metadata.get('StreamTitle').split(' - ')[1],
        }), 200
    else:
        return jsonify({"message": "No metadata found from ffmpeg"}), 200


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
