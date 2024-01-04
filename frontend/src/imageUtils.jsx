export function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
  
  export function timeBasedScramble(imageData, blockSize) {
    const pixelData = new Uint8ClampedArray(imageData.data);
    
    for (let blockStart = 0; blockStart < pixelData.length; blockStart += blockSize * 4) {
      const blockEnd = Math.min(blockStart + blockSize * 4, pixelData.length);
      const block = pixelData.slice(blockStart, blockEnd);
  
      const scrambledBlock = shuffleArray(block); 
      pixelData.set(scrambledBlock, blockStart);
    }
  
    return new ImageData(pixelData, imageData.width, imageData.height); 
  }