const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Setup Express app
const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:WtGwSMU3mKhARYr4@cluster0.gpcz95b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Define Product Schema
const ProductSchema = new mongoose.Schema({
    category: String,
    model: String,
    serialNumber: String,
    invoiceDate: Date,
    filePath: String
});

// Create Product model
const Product = mongoose.model('Product', ProductSchema);

// Route to serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission
app.post('/register-product', upload.single('fileUpload'), async (req, res) => {
    const { category, model, serialNumber, invoiceDate } = req.body;
    const file = req.file;

    // Server-side validation
    if (!serialNumber) {
        return res.status(400).json({ success: false, message: 'Serial number is required' });
    }

    // Create new product document
    const product = new Product({
        category,
        model,
        serialNumber,
        invoiceDate,
        filePath: file ? file.path : null
    });

    try {
        // Save product to the database
        await product.save();
        res.json({ success: true, message: 'Product registered successfully!' });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ success: false, message: 'Failed to register product. Please try again.' });
    }
});

// Start server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
