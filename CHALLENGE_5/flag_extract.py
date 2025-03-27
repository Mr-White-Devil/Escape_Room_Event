import piexif

# Load the image
exif_data = piexif.load("output.jpg")

# Extract the hidden flag
hidden_flag = exif_data["0th"].get(piexif.ImageIFD.Artist, b"").decode("utf-8")

print("Extracted Flag:", hidden_flag)
