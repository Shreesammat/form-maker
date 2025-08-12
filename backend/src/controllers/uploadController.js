export const uploadImage = async (req, res) => {
  try {
    // Mock response: simulate an uploaded image URL
    const mockImageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

    // In a real scenario, you'd process the uploaded file here

    res.status(200).json({
      message: "Image uploaded successfully (mock)",
      url: mockImageUrl,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};