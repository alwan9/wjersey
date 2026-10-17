const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'assets', 'images');
fs.mkdirSync(targetDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function prepareAssets() {
  console.log('Preparing assets...');

  // 1. Process Reference 1 (media_1792168024218.png)
  const ref1Path = 'C:/Users/user/.gemini/antigravity-ide/brain/2e562af4-f2bd-4533-b979-6afb88252403/.user_uploaded/media_1792168024218.png';
  if (fs.existsSync(ref1Path)) {
    console.log('Extracting elements from Reference 1...');
    // Crop the central floating jersey
    // Ref 1 is 736 x 552. Central jersey is approx left: 320, top: 75, width: 280, height: 320
    await sharp(ref1Path)
      .extract({ left: 320, top: 70, width: 280, height: 310 })
      .resize(600, 664, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(path.join(targetDir, 'ref-floating-jersey.png'));

    // Crop the stadium hero backdrop
    await sharp(ref1Path)
      .extract({ left: 0, top: 40, width: 736, height: 390 })
      .resize(1472, 780)
      .toFile(path.join(targetDir, 'ref-hero-banner.jpg'));

    // Crop bottom team cards
    // 6 teams: Real Madrid, Barcelona, Liverpool, Man United, Bayern Munich, Juventus
    // Y approx 440 to 540
    const teams = [
      { name: 'team-realmadrid.png', left: 140, top: 440, width: 90, height: 95 },
      { name: 'team-barcelona.png', left: 280, top: 440, width: 90, height: 95 },
      { name: 'team-liverpool.png', left: 420, top: 440, width: 90, height: 95 },
      { name: 'team-manunited.png', left: 560, top: 440, width: 90, height: 95 },
    ];
    for (const t of teams) {
      try {
        await sharp(ref1Path)
          .extract({ left: t.left, top: t.top, width: t.width, height: t.height })
          .toFile(path.join(targetDir, t.name));
      } catch (err) {
        console.warn('Could not extract ' + t.name, err.message);
      }
    }
  }

  // 2. High resolution curated sports & jersey photography
  const downloads = [
    // Hero stadium backdrop (grand soccer arena under lights)
    {
      name: 'hero-stadium.jpg',
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=85&auto=format&fit=crop'
    },
    // Product 1: Custom Football Jersey (Black & Gold / Dark elegant kit)
    {
      name: 'product-football.jpg',
      url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=85&auto=format&fit=crop'
    },
    // Product 2: Custom Futsal Jersey (Red Racing / Speed dynamic kit) - Best Seller
    {
      name: 'product-futsal.jpg',
      url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=85&auto=format&fit=crop'
    },
    // Product 3: Basketball Jersey (Navy & White basketball apparel set)
    {
      name: 'product-basketball.jpg',
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=85&auto=format&fit=crop'
    },
    // Product 4: Esports Jersey (Modern dark cyber gaming team apparel)
    {
      name: 'product-esports.jpg',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=85&auto=format&fit=crop'
    },
    // Product 5: Cycling Jersey (Sleek aerodynamic cycling jersey)
    {
      name: 'product-cycling.jpg',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&q=85&auto=format&fit=crop'
    },
    // Best Seller Spotlight Jersey image
    {
      name: 'bestseller-futsal.jpg',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=85&auto=format&fit=crop'
    },
    // Materials
    // Dryfit Premium (honeycomb athletic breathable mesh)
    {
      name: 'material-dryfit.jpg',
      url: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&q=80&auto=format&fit=crop'
    },
    // Drifit Milano (sporty texture pattern)
    {
      name: 'material-milano.jpg',
      url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80&auto=format&fit=crop'
    },
    // Hyget Sport (smooth durable fabric)
    {
      name: 'material-hyget.jpg',
      url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80&auto=format&fit=crop'
    },
    // Premium Sports Fabric
    {
      name: 'material-premium.jpg',
      url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&q=80&auto=format&fit=crop'
    },
    // Production & Craftsmanship
    // Printing (sublimation machinery / vibrant printing)
    {
      name: 'production-print.jpg',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80&auto=format&fit=crop'
    },
    // Cutting & Sewing
    {
      name: 'production-sewing.jpg',
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80&auto=format&fit=crop'
    },
    // Quality Control
    {
      name: 'production-qc.jpg',
      url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80&auto=format&fit=crop'
    },
    // Testimonial Avatars
    {
      name: 'avatar-rizky.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop'
    },
    {
      name: 'avatar-fajar.jpg',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop'
    },
    {
      name: 'avatar-dimas.jpg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop'
    }
  ];

  for (const item of downloads) {
    const dest = path.join(targetDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      await downloadFile(item.url, dest);
      console.log(`✓ ${item.name}`);
    } catch (err) {
      console.error(`Failed ${item.name}:`, err.message);
    }
  }

  console.log('Assets prepared successfully!');
}

prepareAssets().catch(console.error);
