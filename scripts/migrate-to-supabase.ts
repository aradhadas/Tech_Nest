/**
 * Migration Script: Upload Product Images and Seed Products to Supabase
 * 
 * Prerequisites:
 * 1. Supabase project created
 * 2. Database tables created (run SQL from SUPABASE_SETUP_GUIDE.md)
 * 3. Storage bucket 'product-image' created
 * 4. .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 
 * Run: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import ws from 'ws';

// Load environment variables from .env.local
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please create .env.local with:');
  console.error('  VITE_SUPABASE_URL=your_url');
  console.error('  VITE_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws as any,
  },
});

// Product data from your current app
const products = [
  // LED & Light (cat-001)
  { id:'p01', name:'LED Flasher Circuit Kit', price:180, stock:25, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', Power:'9V DC', Frequency:'Adjustable 1-10 Hz' }, status: 'active', image: 'led-1.jpg' },
  { id:'p02', name:'Automatic Night Light (LDR)', price:220, stock:20, category:'cat-001', brand:'TechNest Labs', specs:{ Sensor:'LDR GL5516', IC:'LM358 Op-Amp', Power:'5V DC' }, status: 'active', image: 'led-2.jpg' },
  { id:'p03', name:'RGB LED Mood Light Kit', price:250, stock:18, category:'cat-001', brand:'TechNest Labs', specs:{ LED:'Common Cathode RGB', IC:'NE555 Timer', Power:'5V USB' }, status: 'active', image: 'led-3.jpg' },
  { id:'p04', name:'LED Running (Chaser) Light', price:270, stock:15, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 + CD4017', LEDs:'10 x 5mm', Power:'9V DC' }, status: 'active', image: 'led-4.jpg' },
  { id:'p05', name:'Clap Switch LED Control', price:300, stock:12, category:'cat-001', brand:'TechNest Labs', specs:{ Sensor:'Electret Microphone', Transistor:'BC547', Power:'9V DC' }, status: 'active', image: 'led-1.jpg' },
  { id:'p06', name:'Touch Sensor LED Switch', price:210, stock:22, category:'cat-001', brand:'TechNest Labs', specs:{ Transistor:'BC547 x2', Power:'9V DC', Response:'<50ms' }, status: 'active', image: 'led-2.jpg' },
  { id:'p07', name:'LED Brightness Control (PWM)', price:240, stock:20, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', PWM:'1kHz', Power:'5-12V DC' }, status: 'active', image: 'led-3.jpg' },
  { id:'p08', name:'Emergency LED Light Circuit', price:350, stock:10, category:'cat-001', brand:'TechNest Labs', specs:{ Battery:'9V', LEDs:'5x white high-brightness', Switch:'Auto relay' }, status: 'active', image: 'led-4.jpg' },
  { id:'p09', name:'Solar LED Garden Light', price:420, stock:8, category:'cat-001', brand:'TechNest Labs', specs:{ Solar:'5V 0.5W panel', Battery:'NiMH 1.2V', Sensor:'LDR' }, status: 'active', image: 'led-1.jpg' },
  { id:'p10', name:'LED Music Visualizer', price:480, stock:6, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'LM3914', LEDs:'10x colored', Input:'3.5mm audio jack' }, status: 'active', image: 'led-2.jpg' },
  // Power Supply (cat-002)
  { id:'p11', name:'Mobile Charger Circuit (5V)', price:320, stock:14, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'220V AC', Output:'5V DC 500mA', Regulator:'LM7805' }, status: 'active', image: 'power-1.jpg' },
  { id:'p12', name:'DIY Power Bank Module', price:550, stock:10, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'TP4056', Output:'5V 1A', Protection:'Overcharge + short circuit' }, status: 'active', image: 'power-2.jpg' },
  { id:'p13', name:'Wireless Charging Module Kit', price:680, stock:7, category:'cat-002', brand:'TechNest Labs', specs:{ Standard:'Qi compatible', Output:'5V 500mA', Distance:'Up to 5mm' }, status: 'active', image: 'power-3.jpg' },
  { id:'p14', name:'USB Voltage Regulator (5V)', price:190, stock:30, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'7-35V DC', Output:'5V DC', Current:'Up to 1A' }, status: 'active', image: 'power-4.jpg' },
  { id:'p15', name:'Battery Level Indicator Circuit', price:260, stock:18, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'LM3914', LEDs:'5x (Red/Yellow/Green)', Range:'0-12V' }, status: 'active', image: 'power-1.jpg' },
  { id:'p16', name:'Solar Battery Charger Circuit', price:460, stock:9, category:'cat-002', brand:'TechNest Labs', specs:{ Solar:'15-18V panel', Battery:'12V Lead-Acid', Protection:'Overcharge cut-off' }, status: 'active', image: 'power-2.jpg' },
  { id:'p17', name:'DC to DC Boost Converter', price:280, stock:20, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'MT3608', Input:'2-24V DC', Output:'5-28V DC', Efficiency:'93%' }, status: 'active', image: 'power-3.jpg' },
  { id:'p18', name:'AC to DC Adapter Circuit (12V)', price:380, stock:12, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'220V AC', Output:'12V DC 1A', Regulator:'LM7812' }, status: 'active', image: 'power-4.jpg' },
  { id:'p19', name:'Automatic Battery Charger (12V)', price:420, stock:10, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'15V DC', Output:'12V charging', Battery:'Lead-Acid' }, status: 'active', image: 'power-1.jpg' },
  { id:'p20', name:'Overcharge Protection Circuit', price:220, stock:25, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'DW01A + FS8205A', Battery:'Li-Ion/Li-Po', Cutoff:'4.25V' }, status: 'active', image: 'power-2.jpg' },
  // Sound & Audio (cat-003)
  { id:'p21', name:'Mini Audio Amplifier (LM386)', price:240, stock:20, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'LM386', Gain:'20-200 adjustable', Output:'0.5W', Power:'9V DC' }, status: 'active', image: 'audio-1.jpg' },
  { id:'p22', name:'DIY Bluetooth Speaker Module', price:520, stock:8, category:'cat-003', brand:'TechNest Labs', specs:{ Bluetooth:'4.0', Range:'Up to 10m', Power:'5V USB' }, status: 'active', image: 'audio-2.jpg' },
  { id:'p23', name:'Sound Activated Switch', price:310, stock:14, category:'cat-003', brand:'TechNest Labs', specs:{ Sensor:'Electret Mic', Transistor:'BC547', Output:'5V Relay' }, status: 'active', image: 'led-3.jpg' },
  { id:'p24', name:'Buzzer Alarm System', price:180, stock:28, category:'cat-003', brand:'TechNest Labs', specs:{ Buzzer:'Piezo active 5V', IC:'NE555', Sound:'85dB', Power:'9V DC' }, status: 'active', image: 'led-1.jpg' },
  { id:'p25', name:'Clap Controlled Device Switch', price:340, stock:12, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'CD4013 Flip-Flop', Transistor:'BC547', Output:'5V Relay' }, status: 'active', image: 'audio-1.jpg' },
  { id:'p26', name:'Microphone Preamplifier Circuit', price:220, stock:18, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'LM358 Op-Amp', Gain:'Up to 100x', Input:'Electret mic' }, status: 'active', image: 'audio-2.jpg' },
  { id:'p27', name:'Doorbell Circuit (Musical)', price:160, stock:30, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'UM66 Melody', Transistor:'BC547', Power:'3V DC (2xAA)' }, status: 'active', image: 'led-3.jpg' },
  { id:'p28', name:'Tone Generator Circuit', price:200, stock:22, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', Range:'100Hz-10kHz', Control:'Potentiometer' }, status: 'active', image: 'led-1.jpg' },
  { id:'p29', name:'Voice Recorder Playback Module', price:380, stock:9, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'ISD1820', Record:'Up to 20s', Storage:'Non-volatile' }, status: 'active', image: 'audio-1.jpg' },
  { id:'p30', name:'Basic Audio Equalizer Circuit', price:290, stock:14, category:'cat-003', brand:'TechNest Labs', specs:{ Bands:'Bass, Mid, Treble', Type:'Passive RC filter', Control:'3x pots' }, status: 'active', image: 'audio-2.jpg' },
  // Security & Sensor (cat-004)
  { id:'p31', name:'IR Sensor Security Alarm', price:280, stock:16, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'IR LED + Photodiode', IC:'LM358', Range:'Up to 50cm' }, status: 'active', image: 'sec-1.jpg' },
  { id:'p32', name:'Motion Detector Alarm (PIR)', price:350, stock:14, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'HC-SR501 PIR', Range:'7m', Angle:'110°', Output:'Relay + buzzer' }, status: 'active', image: 'sec-2.jpg' },
  { id:'p33', name:'Laser Security Alarm', price:320, stock:12, category:'cat-004', brand:'TechNest Labs', specs:{ Laser:'5mW 650nm', Sensor:'LDR', IC:'LM358', Range:'5m indoor' }, status: 'active', image: 'sec-3.jpg' },
  { id:'p34', name:'Temperature Controlled Fan', price:310, stock:18, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'NTC 10K Thermistor', Transistor:'BC547/TIP31C', Fan:'5V DC included' }, status: 'active', image: 'sec-4.jpg' },
  { id:'p35', name:'Gas Leakage Detector (MQ-2)', price:390, stock:11, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'MQ-2', Detects:'LPG, Smoke, Methane, CO', Output:'Buzzer + LED' }, status: 'active', image: 'sec-1.jpg' },
  { id:'p36', name:'Water Level Indicator', price:220, stock:22, category:'cat-004', brand:'TechNest Labs', specs:{ Probes:'4 copper wire sensors', Display:'4 LEDs', Transistor:'BC547 x4' }, status: 'active', image: 'sec-2.jpg' },
  { id:'p37', name:'Fire Alarm System', price:300, stock:16, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'IR Flame + Thermistor', IC:'LM358', Output:'Buzzer + Red LED' }, status: 'active', image: 'sec-3.jpg' },
  { id:'p38', name:'Digital Thermometer (LM35)', price:520, stock:9, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'LM35', Display:'16x2 LCD', Controller:'Arduino Uno', Accuracy:'±0.5°C' }, status: 'active', image: 'sec-4.jpg' },
  { id:'p39', name:'RFID Door Lock System', price:750, stock:6, category:'cat-004', brand:'TechNest Labs', specs:{ RFID:'RC522 13.56MHz', Controller:'Arduino Uno', Lock:'Servo SG90', Alarm:'Buzzer' }, status: 'active', image: 'sec-1.jpg' },
  { id:'p40', name:'Smart Doorbell (PIR + Buzzer)', price:380, stock:10, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'HC-SR501 PIR', Output:'Active buzzer + LED flash', Range:'3m' }, status: 'active', image: 'sec-2.jpg' },
];

async function uploadImages() {
  console.log('📤 Uploading product images to Supabase Storage...\n');

  const imagesDir = join(process.cwd(), 'public', 'products');
  const imageFiles = readdirSync(imagesDir);

  let successCount = 0;
  let errorCount = 0;

  for (const filename of imageFiles) {
    try {
      const filePath = join(imagesDir, filename);
      const fileBuffer = readFileSync(filePath);
      const file = new File([fileBuffer], filename, { type: 'image/jpeg' });

      const { error } = await supabase.storage
        .from('product-image')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`  ❌ ${filename}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ ${filename}`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ ${filename}: ${err}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Upload Summary: ${successCount} succeeded, ${errorCount} failed\n`);
}

async function seedProducts() {
  console.log('🌱 Seeding products to Supabase Database...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      // Get the public URL for the image
      const { data: urlData } = supabase.storage
        .from('product-image')
        .getPublicUrl(product.image);

      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        specs: product.specs,
        status: product.status,
        image_url: urlData.publicUrl,
        vendor_id: null, // Set to null or a specific vendor ID
      };

      const { error } = await supabase.from('products').upsert([productData]);

      if (error) {
        console.error(`  ❌ ${product.name}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ ${product.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ ${product.name}: ${err}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Seeding Summary: ${successCount} succeeded, ${errorCount} failed\n`);
}

async function main() {
  console.log('🚀 Starting Supabase Migration...\n');
  console.log('=' .repeat(50) + '\n');

  try {
    // Step 1: Upload images
    await uploadImages();

    // Step 2: Seed products
    await seedProducts();

    console.log('=' .repeat(50));
    console.log('✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
