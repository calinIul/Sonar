from quart import Quart, request, jsonify
from controller import id_song, get_fingerprint, capture_sample_from_stream
import asyncio
import os

app = Quart(__name__)

@app.route('/')
def main():
    return jsonify({"error": "Nothing to see here"}), 404

@app.route('/fingerprint', methods=['GET'])
def _get_fingerprint():
    """
    API endpoint to capture a fingerprint based on audio input.
    """
    result = get_fingerprint('sample.wav')
    if result == (None, None):
        return jsonify({"error": "Failed to generate fingerprint"}), 500
    
    return jsonify({"duration": result[0], "fingerprint": result[1]})

@app.route('/sample', methods=['POST'])
async def _capture_sample():
    """
    API endpoint to capture a sample from a stream and return metadata.
    """
    data = await request.json
    stream_url = data.get('streamUrl')

    metadata = await capture_sample_from_stream(stream_url, 10)
    
    if (metadata):
        if (metadata.get('StreamTitle')):
            return jsonify({
                "artist": metadata.get('StreamTitle').split(' - ')[0],
                "title": metadata.get('StreamTitle').split(' - ')[1],
            }), 200
        else:
            return jsonify({"message": "No metadata found from ffmpeg"}), 200

    else:
        return jsonify({"message": "Could not capture sample"}), 204

@app.route('/identify', methods=['POST'])
async def identify_song():
    """
    Identifies a song from a given stream URL.
    """
    try:
        data = await request.get_json()
        stream_url = data.get('streamUrl')

        if not stream_url:
            return jsonify({"error": "No stream URL provided"}), 400

        result = await id_song(stream_url)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
