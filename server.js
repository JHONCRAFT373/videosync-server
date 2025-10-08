const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Carpeta pública
app.use(express.static(path.join(__dirname, "public")));
app.use("/videos", express.static(path.join(__dirname, "videos")));

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "videos/"),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Subida de videos
app.post("/upload", upload.single("video"), (req, res) => {
  res.redirect("/");
});

// Enviar el HTML principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint para listar los videos
app.get("/list-videos", (req, res) => {
  const videoDir = path.join(__dirname, "videos");
  fs.readdir(videoDir, (err, files) => {
    if (err) return res.status(500).send("Error al listar videos");
    const videos = files.filter(f => /\.(mp4|webm|ogg)$/i.test(f));
    res.json(videos);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});