require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const productImageRoutes = require("./routes/productImageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const offerRoutes = require("./routes/offerRoutes");
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/verifyToken");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(
"/uploads",
express.static("uploads")
);

app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/product-images", verifyToken, productImageRoutes);

const path = require("path");

// Serve website files
app.use(express.static(path.join(__dirname, "../website")));

// Serve admin panel
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../website/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
