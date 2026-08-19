exports.upload = (req, res) => {

  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" })
  }

  const url = `${req.protocol}://${req.get('host')}/assets/uploads/${req.file.filename}`

  res.send({
    filename: req.file.filename,
    url: url
  })

}