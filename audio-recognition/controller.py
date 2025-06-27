import requests
import json
import base64
import hashlib
import hmac
import os
import time
import subprocess
import shutil
import asyncio
import re
from constants import requrl, access_key, access_secret, http_method, http_uri, data_type, signature_version, sample_file


def get_fingerprint(file_path):
    """
    Uses `fpcalc` to generate the audio fingerprint for a given file.
    
    Parameters:
        file_path (str): Path to the audio file.
        
    Returns:
        tuple: (Duration in seconds, Fingerprint string) or (None, None) if an error occurs.
    """
    print(f"Generating fingerprint for {file_path}...")

    # Ensure `fpcalc` is installed and accessible
    if not shutil.which("fpcalc"):
        print("Error: `fpcalc` not found. Ensure Chromaprint is installed and in PATH.")
        return None, None

    try:
        # Run `fpcalc` command
        result = subprocess.run(["fpcalc", "-json", "-ignore-errors", file_path], capture_output=True, text=True)

        # Check if the command executed successfully
        if result.returncode != 0:
            print(f"Error: `fpcalc` failed with code {result.returncode}")
            print(result.stderr)
            return None, None

        # Extract JSON output
        output = json.loads(result.stdout)
        duration = output.get("duration")
        fingerprint = output.get("fingerprint")

        if duration is None or fingerprint is None:
            raise ValueError("Could not retrieve duration or fingerprint from `fpcalc` output.")
        
        return duration, fingerprint

    except Exception as e:
        print(f"Error generating fingerprint: {e}")
        return None, None



async def capture_sample_from_stream(stream_url, duration_sec):
    """
    Runs FFmpeg in a background thread to capture the sample and extract metadata.
    
    Returns:
        dict: Metadata from the stream.
    """
    try:
        loop = asyncio.get_running_loop()
        command = [
            "ffmpeg", "-y", "-i", stream_url, "-t", str(duration_sec),
            "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "2", "sample.wav"
        ]
        
        # Run FFmpeg asynchronously and capture both stdout and stderr
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout, stderr = await process.communicate()

        # Convert output to text
        stderr_text = stderr.decode()

        # Extract metadata using regex
        metadata = {}
        for line in stderr_text.split("\n"):
            match = re.match(r"^\s*(\S+)\s*:\s*(.*)$", line)
            if match:
                key, value = match.groups()
                metadata[key] = value.strip()
        
        return metadata
        
    except:
        return None
    

async def id_song(stream_url=None):
    #Capture a sample from the stream
    await capture_sample_from_stream(stream_url, 5)

    timestamp = time.time()

    # Generate the string to sign
    string_to_sign = (
        http_method + "\n" + http_uri + "\n" + access_key + "\n" +
        data_type + "\n" + signature_version + "\n" + str(timestamp)
    )

    # Generate the HMAC signature
    sign = base64.b64encode(
        hmac.new(
            access_secret.encode('ascii'),
            string_to_sign.encode('ascii'),
            digestmod=hashlib.sha1
        ).digest()
    ).decode('ascii')
    # Specify the path to your audio file here
    file_path = sample_file 
    f = open(file_path, "rb")
    try:
        sample_bytes = os.path.getsize(file_path)
        files = {'sample': f} 

        data = {
            'access_key': access_key,
            'sample_bytes': sample_bytes,
            'timestamp': str(timestamp),
            'signature': sign,
            'data_type': data_type,
            "signature_version": signature_version
        }

        response = requests.post(requrl, files=files, data=data)
    finally:
        f.close()  
    return response.json()

