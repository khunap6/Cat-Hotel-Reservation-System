exports.upload = (req, res) => {

  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" })
  }

  const url = `http://localhost:8081/assets/uploads/${req.file.filename}`

  res.send({
    filename: req.file.filename,
    url: url
  })

}