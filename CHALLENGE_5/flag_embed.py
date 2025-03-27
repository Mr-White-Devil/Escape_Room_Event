from PIL import Image
import piexif

# Load the image
image = Image.open("stegno.jpg")  # Use a JPG image

# Flag to hide
flag = "wuwa_stego_challenge"

# Convert the flag into EXIF format
exif_dict = {"0th": {piexif.ImageIFD.Artist: flag.encode("utf-8")}}
exif_bytes = piexif.dump(exif_dict)

# Save the image with the embedded flag
image.save("stegno_embed.jpg", exif=exif_bytes)

print("Flag embedded successfully into stegno_embed.jpg!")
