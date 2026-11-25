import cv2
import numpy as np

img = cv2.imread(r'C:\Users\mendr\.gemini\antigravity\brain\3c85f905-40b6-46bd-8a94-29c8469e2805\.user_uploaded\media_1795592540650_b3dd60eb.jpg')
h, w, _ = img.shape
b, g, r = cv2.split(img)

# Isolate purple/magenta glowing strokes
gray = np.maximum(r, b).astype(np.float32) - g.astype(np.float32)
gray = np.clip(gray, 0, 255).astype(np.uint8)

# Clear the upper card glowing strip (y < 26)
gray[:26, :] = 0

# Threshold to get clean stroke mask
_, thresh = cv2.threshold(gray, 38, 255, cv2.THRESH_BINARY)

# Remove tiny isolated noise dots (area < 6)
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh)
for i in range(1, num_labels):
    if stats[i, cv2.CC_STAT_AREA] < 6:
        thresh[labels == i] = 0

# Extract contours with hierarchy
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_L1)

# Scale from image coordinates (416x187) to 8K-ready viewBox (1000 x 480)
# Hand bounding box in image is approx x: 45..380, y: 28..185
scale = 2.50
tx = 50.0 - 45.0 * scale
ty = 40.0 - 28.0 * scale

path_strs = []
for c in contours:
    # Slightly smooth with approxPolyDP for clean mathematical beziers / polygon
    approx = cv2.approxPolyDP(c, 0.65, True)
    if len(approx) < 3:
        continue
    pts = approx[:, 0, :]
    d = []
    for i, p in enumerate(pts):
        px = round(p[0] * scale + tx, 1)
        py = round(p[1] * scale + ty, 1)
        d.append(f"M {px} {py}" if i == 0 else f"L {px} {py}")
    d.append("Z")
    path_strs.append(" ".join(d))

all_paths_d = " ".join(path_strs)

# Output SVG
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 480" fill="none">
  <path class="cyber-hand-fill" d="{all_paths_d}" fill-rule="evenodd" />
</svg>'''

with open('assets/images/cyber_hand_vector.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"Success! Extracted {len(path_strs)} contours into assets/images/cyber_hand_vector.svg ({len(all_paths_d)} chars)")
