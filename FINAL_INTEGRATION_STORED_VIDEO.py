#!/usr/bin/env python3
"""
FINAL_INTEGRATION_STORED_VIDEO.py

This file augments the existing Pi detection script with a helper
function `send_to_backend` which uploads a detected pothole image and
metadata to the backend endpoint:

  BACKEND_URL = "http://<PC_IP>:5000/api/potholes/pi-upload"

Usage: call send_to_backend(image_path, lat, lon, depth_cm, timestamp_ms)
after a pothole is finalized by the detection pipeline.

Note: This file intentionally only adds upload logic and does not
modify any ML/LiDAR/GPS processing. Integrate the `send_to_backend`
call into your existing pipeline where potholes are finalized.
"""

import os
import time
import requests

# Backend endpoint (replace <PC_IP> with your PC's IP address reachable by the Pi)
BACKEND_URL = "http://<PC_IP>:5000/api/potholes/pi-upload"


def send_to_backend(image_path, lat, lon, depth_cm=None, timestamp_ms=None, extra=None):
    """Send a pothole detection to backend.

    - image_path: path to image file (jpg/png)
    - lat, lon: GPS coordinates (floats)
    - depth_cm: measured depth in centimeters (optional)
    - timestamp_ms: integer milliseconds since epoch (optional)
    - extra: dict of any additional metadata

    Returns: response JSON or raises exception on failure
    """
    if timestamp_ms is None:
        timestamp_ms = int(time.time() * 1000)

    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    files = {
        'image': (os.path.basename(image_path), open(image_path, 'rb'), 'image/jpeg')
    }

    data = {
        'lat': str(lat),
        'lon': str(lon),
        'depth': str(depth_cm) if depth_cm is not None else '',
        'timestamp': str(int(timestamp_ms))
    }

    if extra and isinstance(extra, dict):
        for k, v in extra.items():
            data[str(k)] = str(v)

    try:
        print(f"Uploading to backend {BACKEND_URL} with data: {data}")
        resp = requests.post(BACKEND_URL, files=files, data=data, timeout=20)
        resp.raise_for_status()
        print('Upload successful:', resp.status_code, resp.text)
        return resp.json()
    except requests.exceptions.RequestException as e:
        print('Failed to upload to backend:', e)
        raise


if __name__ == '__main__':
    # Example usage: replace with your pipeline's variables or call from detection code
    example_image = 'sample_pothole.jpg'
    example_lat = 37.7749
    example_lon = -122.4194
    example_depth = 12.5
    example_timestamp = int(time.time() * 1000)

    if os.path.isfile(example_image):
        try:
            send_to_backend(example_image, example_lat, example_lon, example_depth, example_timestamp)
        except Exception as e:
            print('Example upload failed:', e)
    else:
        print('Example image not found; create or point to a real image to test send_to_backend()')
