async function checkCFC() {
  try {
    const res = await fetch('https://www.cfcindia.com/books/basic-christian-teachings');
    const html = await res.text();
    console.log('HTML length:', html.length);
    console.log('Has mp3:', html.includes('.mp3'));
    console.log('Has audio:', html.includes('audio'));
    const matches = html.match(/https?:\/\/[^\s"']+\.mp3/gi);
    console.log('MP3 links found:', matches);
  } catch (err) {
    console.error('CFC check error:', err);
  }
}
checkCFC();

