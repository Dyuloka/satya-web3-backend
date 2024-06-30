const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const { ethers } = require('ethers');

const app = express();

// Read and parse ABI from JSON file
const abi = JSON.parse(fs.readFileSync('abi.json', 'utf8'));

// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Contract ABI
const daiAbi = [
    "function createReport(uint256 _uid, string memory _description, string memory _longitude, string memory _latitude) public",
    "function changeStatus(uint256 _uid, Status _newStatus)",
    "function getAllReports()",
    "function getReport(uint256 _uid)"
];

// Example contract address (replace with your actual contract address)
const contractAddress = '0x967A0a0b25ecC5fE5064E1F93aFB7B49bc3C4A70';

// POST route to create a report
app.post('/signup', async (req, res) => {
    const { reportId, reportType, latitude, longitude } = req.body;

    try {
        // Initialize provider and signer
        const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
        const signer = new ethers.Wallet("54d9b47ecc450558ffe703e18b22add16858afe06b47565eec119dede39c6a26", provider);
        
        // Initialize contract instance
        const contract = new ethers.Contract(contractAddress, daiAbi, signer);

        // Call createReport method
        const transaction = await contract.createReport(reportId, reportType, latitude, longitude);
        await transaction.wait(); // Wait for transaction to be mined

        console.log("Report created successfully:", transaction);
        res.status(200).send("Report created successfully!");
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).send("Failed to create report");
    }
});

// GET route example (for testing or other purposes)
app.get('/signup', async (req, res) => {
    res.status(405).send("GET method not allowed on /signup");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
