# Pencil Effect

1. Create a new image:
   * Size: 10x size of final image size. e.g. 320x640 if you want to end up with a 32x64 sprite.
   * Color: 32-bit RGB
   * Enable transparency
2. Brush properties:
   * Brush Tip Shape
      * Size: 35 px
      * Angle: -40
      * Roundness: 40%
      * Spacing: 15%
   * Shape Dynamics
      i. Size Jitter: 60%
   * Noise: Checked
3. Foreground Color
   * R: 0.1029
   * G: 0.0882
   * B: 0.0686
4. Draw image
5. Scale image to final size

# Drawing Animation Stills

1. Draw image on a single layer
2. Layer Style / Blending Options:
   * Enable Color Overlay
   * Choose a light gray color
3. Duplicate layer
4. Uncheck "Effects" on new layer
5. Ctrl+A, Ctrl+X on new layer
6. Use lightened, original layer as frame of reference for drawing next animation still

# Saving

1. Convert Image Mode to RGB 8 bits/pixel
2. Scale the image to 10% of the original height and width
3. Make the layer you wish to save the only visible layer
4. Save as a PNG image

# Testing Animation

1. After saving, open all PNG images in order as new windows
2. Close all other windows that are not a part of the animation
2. Hold Ctrl+Tab or Ctrl+Shift+Tab to automatically switch between windows, simulating the animation
