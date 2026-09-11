async function test() {
  try {
    const res = await fetch('http://localhost:4173/');
    console.log('App Root Status:', res.status);
    const swRes = await fetch('http://localhost:4173/sw.js');
    console.log('Service Worker Status:', swRes.status);
    const manifestRes = await fetch('http://localhost:4173/manifest.webmanifest');
    console.log('Manifest Status:', manifestRes.status);
    const manifestJson = await manifestRes.json();
    console.log('Manifest Name:', manifestJson.name);
    console.log('All tests passed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Server test error:', err);
    process.exit(1);
  }
}
test();
