export const money = (n) => `${String.fromCharCode(8377)}${Number(n || 0).toLocaleString("en-IN")}`;
export const today = new Date().toISOString().slice(0, 10);
export const imageFallback = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const preview = new window.Image();
    preview.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(preview.width, preview.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(preview.width * scale);
      canvas.height = Math.round(preview.height * scale);
      canvas.getContext("2d").drawImage(preview, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    preview.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Unable to read image")); };
    preview.src = objectUrl;
  });
}
