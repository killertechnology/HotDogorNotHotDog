require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3001', 'http://origin.hotdogdetector.flex-ai.com', 'https://hotdogdetector.flex-ai.com']
  }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/hotdog/detect', upload.single('image'), async (req, res) => {
    try {
        const imageFile = fs.createReadStream(req.file.path);
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Is this a photo of a hot dog? Respond only with "Hot Dog" or "Not Hot Dog".' },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(req.file.path, { encoding: 'base64' })}` } }
                    ]
                }
            ],
        });

        const result = response.choices[0].message.content.trim();
        fs.unlinkSync(req.file.path);

        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`HotDog API listening at http://localhost:${port}`);
});