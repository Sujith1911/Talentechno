import cv2
import numpy as np

img = cv2.imread(r'C:\Users\mendr\.gemini\antigravity\brain\3c85f905-40b6-46bd-8a94-29c8469e2805\.user_uploaded\media_1795592540650_b3dd60eb.jpg')
b, g, r = cv2.split(img)

# Isolate purple/magenta glowing strokes
gray = np.maximum(r, b).astype(np.float32) - g.astype(np.float32)
gray = np.clip(gray, 0, 255).astype(np.uint8)

# Clear the upper card glowing strip (y < 28)
gray[:28, :] = 0

# Threshold to get clean stroke mask
_, thresh = cv2.threshold(gray, 38, 255, cv2.THRESH_BINARY)

# Remove tiny isolated noise dots (area < 8)
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(thresh)
for i in range(1, num_labels):
    if stats[i, cv2.CC_STAT_AREA] < 8:
        thresh[labels == i] = 0

# Extract contours with hierarchy
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_L1)

filtered = [c for c in contours if cv2.arcLength(c, True) > 18]

all_pts = np.vstack(filtered)[:, 0, :]
min_x, min_y = np.min(all_pts, axis=0)
max_x, max_y = np.max(all_pts, axis=0)

scale = 2.40

# Center the palm emitter at exactly x = 500.0, y = 230.0
raw_emitter_x = 232.0
raw_emitter_y = 100.0

tx = 500.0 - raw_emitter_x * scale
ty = 230.0 - raw_emitter_y * scale

def points_to_cubic_bezier(pts):
    n = len(pts)
    if n < 3:
        return ""
    d = [f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"]
    for i in range(n):
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        
        # Smooth Catmull-Rom tangents with soft tension
        t1x = (p2[0] - p0[0]) * 0.45
        t1y = (p2[1] - p0[1]) * 0.45
        t2x = (p3[0] - p0[0]) * 0.45 # slight smoothing
        t2y = (p3[1] - p1[1]) * 0.45
        
        cp1x = p1[0] + t1x / 3.0
        cp1y = p1[1] + t1y / 3.0
        cp2x = p2[0] - t2x / 3.0
        cp2y = p2[1] - t2y / 3.0
        
        d.append(f"C {cp1x:.1f} {cp1y:.1f}, {cp2x:.1f} {cp2y:.1f}, {p2[0]:.1f} {p2[1]:.1f}")
    d.append("Z")
    return " ".join(d)

path_cmds = []
for c in filtered:
    approx = cv2.approxPolyDP(c, 0.75, True)
    if len(approx) < 4:
        continue
    scaled_pts = approx[:, 0, :].astype(np.float32)
    scaled_pts[:, 0] = scaled_pts[:, 0] * scale + tx
    scaled_pts[:, 1] = scaled_pts[:, 1] * scale + ty
    bezier_d = points_to_cubic_bezier(scaled_pts)
    if bezier_d:
        path_cmds.append(bezier_d)

combined_d = " ".join(path_cmds)
print(f"Palm emitter aligned at (500.0, 230.0). Hand total path length: {len(combined_d)}")

with open('assets/images/hand_vector_path.txt', 'w', encoding='utf-8') as f:
    f.write(combined_d)
