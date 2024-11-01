import requests
import subprocess
import acoustid
import base64
import hashlib
import hmac
import os
import time

# Replace with your AcoustID API key
#ACOUSTID_API_KEY = "ESAM14UsU4"

def id_song(stream_url=None):


    def capture_sample_from_stream(stream_url, duration_sec=24, output_file="sample.wav"):
        """
        Downloads a sample from a streaming URL and saves it as an audio file.
        
        Parameters:
            stream_url (str): The URL of the audio stream.
            duration_sec (int): Duration of the sample to capture in seconds.
            output_file (str): Name of the output file.
        """
        try:
            # Stream and save the first `duration_sec` seconds
            with requests.get(stream_url, stream=True) as r:
                with open(output_file, 'wb') as f:
                    for i, chunk in enumerate(r.iter_content(chunk_size=1024)):
                        if i > duration_sec * 10:  # Approximation: 10 KB per second
                            break
                        f.write(chunk)
            print(f"Captured {duration_sec}-second sample to {output_file}.")
        except Exception as e:
            print(f"Error capturing sample: {e}")

    def get_fingerprint(file_path):
        """
        Uses `fpcalc` to generate the audio fingerprint for a given file.
        
        Parameters:
            file_path (str): Path to the audio file.
            
        Returns:
            tuple: Duration and fingerprint of the audio file.
        """
        try:
            # Run `fpcalc` command
            result = subprocess.run(["fpcalc", file_path], capture_output=True, text=True)
            
            # Extract duration and fingerprint from `fpcalc` output
            duration, fingerprint = None, None
            for line in result.stdout.splitlines():
                if line.startswith("DURATION"):
                    duration = int(line.split('=')[1].strip())
                elif line.startswith("FINGERPRINT"):
                    fingerprint = line.split('=')[1].strip()
            
            if duration is None or fingerprint is None:
                raise ValueError("Could not retrieve duration or fingerprint from `fpcalc` output.")
            
            print(fingerprint)
            return duration, fingerprint

        except Exception as e:
            print(f"Error generating fingerprint: {e}")
            return None, None

    sample_file = "sample.wav"

    # Usage example
    #stream_url = "https://pub0302.101.ru:8000/stream/trust/mp3/128/18"  # Replace with your actual stream URL
    #identify_song_from_stream(stream_url)
    capture_sample_from_stream(stream_url, duration_sec=24, output_file=sample_file)

    # Replace "###...###" below with your project's host, access_key and access_secret.
    access_key = "c568b346935f40a56f9cc11717f5d93b"
    access_secret = "L0sSLPRC5u3ehPuPcH7Z5cujdJXW9UzdLyZN2Al3"
    requrl = "https://identify-eu-west-1.acrcloud.com/v1/identify"  # Correct URL for the POST request

    http_method = "POST"
    http_uri = "/v1/identify"
    data_type = "audio"
    signature_version = "1"
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
    file_path = "sample.wav"  # Change this to the full path if necessary

    # Open the WAV file and prepare the request
    with open(file_path, "rb") as f:
        sample_bytes = os.path.getsize(file_path)
        files = {'sample': f}  # Correctly format the files dictionary

        data = {
            'access_key': access_key,
            'sample_bytes': sample_bytes,
            'timestamp': str(timestamp),
            'signature': sign,
            'data_type': data_type,
            "signature_version": signature_version
        }

        # Send the POST request
        response = requests.post(requrl, files=files, data=data)
        response.encoding = "utf-8"

        # Print the response
        print(response.text)
        return response.json()

#id_song()