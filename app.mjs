import express from 'express';
import fs from 'fs';

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Video Player</title>
    </head>
    <body>
      <h1>Hello, World - Himanshu Aggarwal!</h1>
      <video width="640" height="360" controls>
        <source src="/video" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </body>
    </html>
  `);
});

app.get('/video', (req, res) => {
  const videoPath = 'test.mp4';
  const stat = fs.statSync(videoPath);
  console.log(stat);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    console.log('Range Found!');
    console.log(range);
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    
    console.log(start)
    console.log(end)
    
    const chunkSize = end - start + 1;

    console.log(chunkSize)

    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    console.log('Range Not Specified!');
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(8080, () => {
  console.log(
    'Server is running on port 8080. Check the app on http://localhost:8080'
  );
});
