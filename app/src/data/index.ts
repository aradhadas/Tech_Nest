import type { Category, Product, User, Order } from '@/types';

export const categories: Category[] = [
  { id: 'cat-001', name: 'LED & Light Projects', icon: '💡', color: '#F59E0B', description: 'LED circuits, light sensors, and lighting projects' },
  { id: 'cat-002', name: 'Power Supply & Charging', icon: '🔋', color: '#16A34A', description: 'Power banks, chargers, voltage regulators' },
  { id: 'cat-003', name: 'Sound & Audio Projects', icon: '🔊', color: '#2563EB', description: 'Amplifiers, speakers, sound circuits' },
  { id: 'cat-004', name: 'Security & Sensor Projects', icon: '🔐', color: '#E8321C', description: 'Motion sensors, alarms, RFID systems' },
];

const productImages: Record<string, string[]> = {
  'cat-001': ['/products/led-1.jpg', '/products/led-2.jpg', '/products/led-3.jpg', '/products/led-4.jpg'],
  'cat-002': ['/products/power-1.jpg', '/products/power-2.jpg', '/products/power-3.jpg', '/products/power-4.jpg'],
  'cat-003': ['/products/audio-1.jpg', '/products/audio-2.jpg', '/products/led-3.jpg', '/products/led-1.jpg'],
  'cat-004': ['/products/sec-1.jpg', '/products/sec-2.jpg', '/products/sec-3.jpg', '/products/sec-4.jpg'],
};

function getImage(category: string, index: number): string {
  const images = productImages[category] || ['/products/led-1.jpg'];
  return images[index % images.length];
}

export const products: Product[] = [
  // LED & Light (cat-001)
  { id:'p01', name:'LED Flasher Circuit Kit', price:180, stock:25, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', Power:'9V DC', Frequency:'Adjustable 1-10 Hz' }, status: 'active', image: getImage('cat-001', 0) },
  { id:'p02', name:'Automatic Night Light (LDR)', price:220, stock:20, category:'cat-001', brand:'TechNest Labs', specs:{ Sensor:'LDR GL5516', IC:'LM358 Op-Amp', Power:'5V DC' }, status: 'active', image: getImage('cat-001', 1) },
  { id:'p03', name:'RGB LED Mood Light Kit', price:250, stock:18, category:'cat-001', brand:'TechNest Labs', specs:{ LED:'Common Cathode RGB', IC:'NE555 Timer', Power:'5V USB' }, status: 'active', image: getImage('cat-001', 2) },
  { id:'p04', name:'LED Running (Chaser) Light', price:270, stock:15, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 + CD4017', LEDs:'10 x 5mm', Power:'9V DC' }, status: 'active', image: getImage('cat-001', 3) },
  { id:'p05', name:'Clap Switch LED Control', price:300, stock:12, category:'cat-001', brand:'TechNest Labs', specs:{ Sensor:'Electret Microphone', Transistor:'BC547', Power:'9V DC' }, status: 'active', image: getImage('cat-001', 0) },
  { id:'p06', name:'Touch Sensor LED Switch', price:210, stock:22, category:'cat-001', brand:'TechNest Labs', specs:{ Transistor:'BC547 x2', Power:'9V DC', Response:'<50ms' }, status: 'active', image: getImage('cat-001', 1) },
  { id:'p07', name:'LED Brightness Control (PWM)', price:240, stock:20, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', PWM:'1kHz', Power:'5-12V DC' }, status: 'active', image: getImage('cat-001', 2) },
  { id:'p08', name:'Emergency LED Light Circuit', price:350, stock:10, category:'cat-001', brand:'TechNest Labs', specs:{ Battery:'9V', LEDs:'5x white high-brightness', Switch:'Auto relay' }, status: 'active', image: getImage('cat-001', 3) },
  { id:'p09', name:'Solar LED Garden Light', price:420, stock:8, category:'cat-001', brand:'TechNest Labs', specs:{ Solar:'5V 0.5W panel', Battery:'NiMH 1.2V', Sensor:'LDR' }, status: 'active', image: getImage('cat-001', 0) },
  { id:'p10', name:'LED Music Visualizer', price:480, stock:6, category:'cat-001', brand:'TechNest Labs', specs:{ IC:'LM3914', LEDs:'10x colored', Input:'3.5mm audio jack' }, status: 'active', image: getImage('cat-001', 1) },
  // Power Supply (cat-002)
  { id:'p11', name:'Mobile Charger Circuit (5V)', price:320, stock:14, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'220V AC', Output:'5V DC 500mA', Regulator:'LM7805' }, status: 'active', image: getImage('cat-002', 0) },
  { id:'p12', name:'DIY Power Bank Module', price:550, stock:10, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'TP4056', Output:'5V 1A', Protection:'Overcharge + short circuit' }, status: 'active', image: getImage('cat-002', 1) },
  { id:'p13', name:'Wireless Charging Module Kit', price:680, stock:7, category:'cat-002', brand:'TechNest Labs', specs:{ Standard:'Qi compatible', Output:'5V 500mA', Distance:'Up to 5mm' }, status: 'active', image: getImage('cat-002', 2) },
  { id:'p14', name:'USB Voltage Regulator (5V)', price:190, stock:30, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'7-35V DC', Output:'5V DC', Current:'Up to 1A' }, status: 'active', image: getImage('cat-002', 3) },
  { id:'p15', name:'Battery Level Indicator Circuit', price:260, stock:18, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'LM3914', LEDs:'5x (Red/Yellow/Green)', Range:'0-12V' }, status: 'active', image: getImage('cat-002', 0) },
  { id:'p16', name:'Solar Battery Charger Circuit', price:460, stock:9, category:'cat-002', brand:'TechNest Labs', specs:{ Solar:'15-18V panel', Battery:'12V Lead-Acid', Protection:'Overcharge cut-off' }, status: 'active', image: getImage('cat-002', 1) },
  { id:'p17', name:'DC to DC Boost Converter', price:280, stock:20, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'MT3608', Input:'2-24V DC', Output:'5-28V DC', Efficiency:'93%' }, status: 'active', image: getImage('cat-002', 2) },
  { id:'p18', name:'AC to DC Adapter Circuit (12V)', price:380, stock:12, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'220V AC', Output:'12V DC 1A', Regulator:'LM7812' }, status: 'active', image: getImage('cat-002', 3) },
  { id:'p19', name:'Automatic Battery Charger (12V)', price:420, stock:10, category:'cat-002', brand:'TechNest Labs', specs:{ Input:'15V DC', Output:'12V charging', Battery:'Lead-Acid' }, status: 'active', image: getImage('cat-002', 0) },
  { id:'p20', name:'Overcharge Protection Circuit', price:220, stock:25, category:'cat-002', brand:'TechNest Labs', specs:{ IC:'DW01A + FS8205A', Battery:'Li-Ion/Li-Po', Cutoff:'4.25V' }, status: 'active', image: getImage('cat-002', 1) },
  // Sound & Audio (cat-003)
  { id:'p21', name:'Mini Audio Amplifier (LM386)', price:240, stock:20, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'LM386', Gain:'20-200 adjustable', Output:'0.5W', Power:'9V DC' }, status: 'active', image: getImage('cat-003', 0) },
  { id:'p22', name:'DIY Bluetooth Speaker Module', price:520, stock:8, category:'cat-003', brand:'TechNest Labs', specs:{ Bluetooth:'4.0', Range:'Up to 10m', Power:'5V USB' }, status: 'active', image: getImage('cat-003', 1) },
  { id:'p23', name:'Sound Activated Switch', price:310, stock:14, category:'cat-003', brand:'TechNest Labs', specs:{ Sensor:'Electret Mic', Transistor:'BC547', Output:'5V Relay' }, status: 'active', image: getImage('cat-003', 2) },
  { id:'p24', name:'Buzzer Alarm System', price:180, stock:28, category:'cat-003', brand:'TechNest Labs', specs:{ Buzzer:'Piezo active 5V', IC:'NE555', Sound:'85dB', Power:'9V DC' }, status: 'active', image: getImage('cat-003', 3) },
  { id:'p25', name:'Clap Controlled Device Switch', price:340, stock:12, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'CD4013 Flip-Flop', Transistor:'BC547', Output:'5V Relay' }, status: 'active', image: getImage('cat-003', 0) },
  { id:'p26', name:'Microphone Preamplifier Circuit', price:220, stock:18, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'LM358 Op-Amp', Gain:'Up to 100x', Input:'Electret mic' }, status: 'active', image: getImage('cat-003', 1) },
  { id:'p27', name:'Doorbell Circuit (Musical)', price:160, stock:30, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'UM66 Melody', Transistor:'BC547', Power:'3V DC (2xAA)' }, status: 'active', image: getImage('cat-003', 2) },
  { id:'p28', name:'Tone Generator Circuit', price:200, stock:22, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'NE555 Timer', Range:'100Hz-10kHz', Control:'Potentiometer' }, status: 'active', image: getImage('cat-003', 3) },
  { id:'p29', name:'Voice Recorder Playback Module', price:380, stock:9, category:'cat-003', brand:'TechNest Labs', specs:{ IC:'ISD1820', Record:'Up to 20s', Storage:'Non-volatile' }, status: 'active', image: getImage('cat-003', 0) },
  { id:'p30', name:'Basic Audio Equalizer Circuit', price:290, stock:14, category:'cat-003', brand:'TechNest Labs', specs:{ Bands:'Bass, Mid, Treble', Type:'Passive RC filter', Control:'3x pots' }, status: 'active', image: getImage('cat-003', 1) },
  // Security & Sensor (cat-004)
  { id:'p31', name:'IR Sensor Security Alarm', price:280, stock:16, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'IR LED + Photodiode', IC:'LM358', Range:'Up to 50cm' }, status: 'active', image: getImage('cat-004', 0) },
  { id:'p32', name:'Motion Detector Alarm (PIR)', price:350, stock:14, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'HC-SR501 PIR', Range:'7m', Angle:'110\u00b0', Output:'Relay + buzzer' }, status: 'active', image: getImage('cat-004', 1) },
  { id:'p33', name:'Laser Security Alarm', price:320, stock:12, category:'cat-004', brand:'TechNest Labs', specs:{ Laser:'5mW 650nm', Sensor:'LDR', IC:'LM358', Range:'5m indoor' }, status: 'active', image: getImage('cat-004', 2) },
  { id:'p34', name:'Temperature Controlled Fan', price:310, stock:18, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'NTC 10K Thermistor', Transistor:'BC547/TIP31C', Fan:'5V DC included' }, status: 'active', image: getImage('cat-004', 3) },
  { id:'p35', name:'Gas Leakage Detector (MQ-2)', price:390, stock:11, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'MQ-2', Detects:'LPG, Smoke, Methane, CO', Output:'Buzzer + LED' }, status: 'active', image: getImage('cat-004', 0) },
  { id:'p36', name:'Water Level Indicator', price:220, stock:22, category:'cat-004', brand:'TechNest Labs', specs:{ Probes:'4 copper wire sensors', Display:'4 LEDs', Transistor:'BC547 x4' }, status: 'active', image: getImage('cat-004', 1) },
  { id:'p37', name:'Fire Alarm System', price:300, stock:16, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'IR Flame + Thermistor', IC:'LM358', Output:'Buzzer + Red LED' }, status: 'active', image: getImage('cat-004', 2) },
  { id:'p38', name:'Digital Thermometer (LM35)', price:520, stock:9, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'LM35', Display:'16x2 LCD', Controller:'Arduino Uno', Accuracy:'\u00b10.5\u00b0C' }, status: 'active', image: getImage('cat-004', 3) },
  { id:'p39', name:'RFID Door Lock System', price:750, stock:6, category:'cat-004', brand:'TechNest Labs', specs:{ RFID:'RC522 13.56MHz', Controller:'Arduino Uno', Lock:'Servo SG90', Alarm:'Buzzer' }, status: 'active', image: getImage('cat-004', 0) },
  { id:'p40', name:'Smart Doorbell (PIR + Buzzer)', price:380, stock:10, category:'cat-004', brand:'TechNest Labs', specs:{ Sensor:'HC-SR501 PIR', Output:'Active buzzer + LED flash', Range:'3m' }, status: 'active', image: getImage('cat-004', 1) },
];

export const demoUsers: User[] = [
  { id:'u1', name:'Rahim Ahmed', email:'customer@demo.com', role:'customer', phone:'01712345678', address:'12/A Dhanmondi, Dhaka', joinedDate:'2026-01-15', status:'active' },
  { id:'u2', name:'Karim Store', email:'vendor@demo.com', role:'vendor', approvalStatus:'approved', storeName:'Karim Electronics', storeDescription:'Premium electronics components and kits for students and hobbyists.', phone:'01812345678', joinedDate:'2026-02-20', status:'active' },
  { id:'u3', name:'Admin User', email:'admin@demo.com', role:'admin', phone:'01912345678', joinedDate:'2026-01-01', status:'active' },
  { id:'u4', name:'New Vendor', email:'pending@demo.com', role:'vendor', approvalStatus:'pending', storeName:'New Electronics Shop', storeDescription:'Waiting for admin approval to start selling.', phone:'01612345678', joinedDate:'2026-05-06', status:'active' },
  { id:'u5', name:'Sadia Rahman', email:'sadia@demo.com', role:'customer', phone:'01512345678', address:'45 Gulshan, Dhaka', joinedDate:'2026-03-10', status:'active' },
];

export const sampleOrders: Order[] = [
  { id:'TN-00001', items:[{ product: products[0], quantity:2 }, { product: products[4], quantity:1 }], total:660, status:'delivered', date:'2026-04-12', customerName:'Rahim Ahmed', customerId:'u1', deliveryAddress:'12/A Dhanmondi, Dhaka', deliveryPhone:'01712345678' },
  { id:'TN-00002', items:[{ product: products[12], quantity:1 }], total:680, status:'shipped', date:'2026-04-28', customerName:'Sadia Rahman', customerId:'u5', deliveryAddress:'45 Gulshan, Dhaka', deliveryPhone:'01512345678' },
  { id:'TN-00003', items:[{ product: products[38], quantity:1 }, { product: products[37], quantity:1 }], total:1270, status:'processing', date:'2026-05-01', customerName:'Rahim Ahmed', customerId:'u1', deliveryAddress:'12/A Dhanmondi, Dhaka', deliveryPhone:'01712345678' },
  { id:'TN-00004', items:[{ product: products[21], quantity:1 }], total:520, status:'pending', date:'2026-05-05', customerName:'Sadia Rahman', customerId:'u5', deliveryAddress:'45 Gulshan, Dhaka', deliveryPhone:'01512345678' },
  { id:'TN-00005', items:[{ product: products[6], quantity:3 }], total:720, status:'cancelled', date:'2026-04-20', customerName:'Rahim Ahmed', customerId:'u1', deliveryAddress:'12/A Dhanmondi, Dhaka', deliveryPhone:'01712345678' },
];
