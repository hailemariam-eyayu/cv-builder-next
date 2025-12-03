require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🌱 Starting database seeding...\n');

const templates = [
  {
    name: 'Modern Professional',
    description: 'Clean and modern template perfect for corporate professionals',
    thumbnail: '/templates/modern-professional.jpg',
    category: 'professional',
    isPremium: false,
    isApproved: true,
    structure: {
      components: [
        {
          id: 'header-1',
          type: 'heading',
          content: { text: 'Your Name', fontSize: 36, fontWeight: 'bold' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 60 },
        },
        {
          id: 'contact-1',
          type: 'contact',
          content: { email: 'your.email@example.com', phone: '+1 234 567 8900', location: 'City, Country' },
          position: { x: 0, y: 70 },
          size: { width: 100, height: 80 },
        },
      ],
    },
  },
  {
    name: 'Creative Designer',
    description: 'Bold and creative template for designers and artists',
    thumbnail: '/templates/creative-designer.jpg',
    category: 'creative',
    isPremium: false,
    isApproved: true,
    structure: {
      components: [
        {
          id: 'image-1',
          type: 'image',
          content: { url: '', alt: 'Profile Picture' },
          position: { x: 0, y: 0 },
          size: { width: 150, height: 150 },
        },
        {
          id: 'header-1',
          type: 'heading',
          content: { text: 'Your Name', fontSize: 32, fontWeight: 'bold' },
          position: { x: 160, y: 20 },
          size: { width: 100, height: 50 },
        },
      ],
    },
  },
  {
    name: 'Minimalist',
    description: 'Simple and elegant template with focus on content',
    thumbnail: '/templates/minimalist.jpg',
    category: 'minimal',
    isPremium: false,
    isApproved: true,
    structure: {
      components: [
        {
          id: 'header-1',
          type: 'heading',
          content: { text: 'Your Name', fontSize: 28, fontWeight: 'normal' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
        },
      ],
    },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String,
      provider: String,
    }));

    const Template = mongoose.model('Template', new mongoose.Schema({
      name: String,
      description: String,
      thumbnail: String,
      structure: mongoose.Schema.Types.Mixed,
      category: String,
      isPremium: Boolean,
      isApproved: Boolean,
      createdBy: mongoose.Schema.Types.ObjectId,
    }, { timestamps: true }));

    // Find or create admin user
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('📝 Creating admin user...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@cvbuilder.com',
        role: 'admin',
        provider: 'credentials',
      });
      console.log('✅ Admin user created\n');
    } else {
      console.log('✅ Admin user already exists\n');
    }

    // Clear existing templates
    await Template.deleteMany({});
    console.log('🗑️  Cleared existing templates\n');

    // Insert new templates
    for (const template of templates) {
      await Template.create({
        ...template,
        createdBy: adminUser._id,
      });
      console.log(`✅ Created template: ${template.name}`);
    }

    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`📊 Total templates created: ${templates.length}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
