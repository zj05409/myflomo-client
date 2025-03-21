import sharp from 'sharp';

sharp('assets/favicon.svg')
    .resize(32, 32)
    .png()
    .toFile('assets/favicon.png')
    .then(() => console.log('Favicon created successfully!'))
    .catch(err => console.error('Error creating favicon:', err)); 