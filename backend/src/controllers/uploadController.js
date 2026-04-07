export const uploadImages = async (req, res) => {
  const files = (req.files || []).map((file) => ({
    url: `/uploads/${file.filename}`,
    publicId: file.filename,
  }));

  res.status(200).json({
    success: true,
    files,
  });
};
