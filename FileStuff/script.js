const img = document.querySelector("img");

img.addEventListener("click", handleDownload);

function handleDownload() {
  const canvas = document.createElement("canvas");

  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0);

  canvas.toBlob(function (blob) {
    const link = document.createElement("a");
    link.download = "japanese.jpeg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, "image/jpeg");
}

function handleChange(e) {
  const file = e.files[0];
  const image = new Image();
  const src = URL.createObjectURL(file);
  image.src = src;
  URL.revokeObjectURL(src);
  image.width = 540;
  document.querySelector("body").appendChild(image);
}
