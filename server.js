const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun } = require('docx');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    // Step 1: File uploaded successfully
    console.log('File uploaded successfully:', req.file);

    const filePath = path.join(__dirname, req.file.path);

    // Step 2: Read PDF file
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(pdfBuffer);
    

    // Step 3: Create a DOCX file with the extracted PDF text
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(pdfData.text),
              ],
            }),
          ],
        },
      ],
    });

    // Step 4: Convert DOCX document to a buffer
    const buffer = await Packer.toBuffer(doc);

    // Step 5: Save the buffer to a file
    const outputFilePath = path.join(__dirname, 'uploads', `${req.file.filename}.docx`);
    fs.writeFileSync(outputFilePath, buffer);

    // Step 6: Send download URL to the client
    res.json({ downloadUrl: `/uploads/${req.file.filename}.docx` });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).json({ message: 'An error occurred during the conversion.' });
  }
});

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
