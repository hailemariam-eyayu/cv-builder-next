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
          content: { text: 'JOHN DOE', fontSize: 36, fontWeight: 'bold' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 60 },
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: { text: 'Software Engineer', fontSize: 18 },
          position: { x: 0, y: 65 },
          size: { width: 100, height: 30 },
        },
        {
          id: 'contact-1',
          type: 'contact',
          content: { email: 'john.doe@email.com', phone: '+1 234 567 8900', location: 'New York, NY' },
          position: { x: 0, y: 100 },
          size: { width: 100, height: 80 },
        },
        {
          id: 'experience-1',
          type: 'experience',
          content: {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            duration: '2020 - Present',
            description: 'Led development of microservices architecture serving 1M+ users. Mentored team of 5 junior developers.',
          },
          position: { x: 0, y: 190 },
          size: { width: 100, height: 120 },
        },
        {
          id: 'experience-2',
          type: 'experience',
          content: {
            title: 'Software Engineer',
            company: 'StartUp Inc',
            duration: '2017 - 2020',
            description: 'Built RESTful APIs using Node.js and React. Implemented CI/CD pipelines.',
          },
          position: { x: 0, y: 320 },
          size: { width: 100, height: 120 },
        },
        {
          id: 'education-1',
          type: 'education',
          content: {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            year: '2013 - 2017',
          },
          position: { x: 0, y: 450 },
          size: { width: 100, height: 80 },
        },
        {
          id: 'skills-1',
          type: 'skills',
          content: { skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'] },
          position: { x: 0, y: 540 },
          size: { width: 100, height: 100 },
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
          id: 'header-1',
          type: 'heading',
          content: { text: 'JANE SMITH', fontSize: 32, fontWeight: 'bold' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: { text: 'Product Designer', fontSize: 18 },
          position: { x: 0, y: 55 },
          size: { width: 100, height: 30 },
        },
        {
          id: 'contact-1',
          type: 'contact',
          content: { email: 'jane.smith@email.com', phone: '+1 234 567 8900', location: 'San Francisco, CA' },
          position: { x: 0, y: 90 },
          size: { width: 100, height: 80 },
        },
        {
          id: 'text-1',
          type: 'text',
          content: { text: 'Creative product designer with 6+ years of experience crafting intuitive digital experiences for web and mobile applications.', fontSize: 14 },
          position: { x: 0, y: 180 },
          size: { width: 100, height: 60 },
        },
        {
          id: 'experience-1',
          type: 'experience',
          content: {
            title: 'Senior Product Designer',
            company: 'Design Studio',
            duration: '2021 - Present',
            description: 'Leading design initiatives for enterprise SaaS products. Conducting user research and creating design systems.',
          },
          position: { x: 0, y: 250 },
          size: { width: 100, height: 120 },
        },
        {
          id: 'skills-1',
          type: 'skills',
          content: { skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'] },
          position: { x: 0, y: 380 },
          size: { width: 100, height: 100 },
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
          content: { text: 'Alex Johnson', fontSize: 28, fontWeight: 'normal' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: { text: 'Marketing Manager', fontSize: 16 },
          position: { x: 0, y: 55 },
          size: { width: 100, height: 30 },
        },
        {
          id: 'contact-1',
          type: 'contact',
          content: { email: 'alex.johnson@email.com', phone: '+1 234 567 8900', location: 'Boston, MA' },
          position: { x: 0, y: 90 },
          size: { width: 100, height: 80 },
        },
        {
          id: 'experience-1',
          type: 'experience',
          content: {
            title: 'Marketing Manager',
            company: 'Growth Company',
            duration: '2019 - Present',
            description: 'Led digital marketing campaigns resulting in 150% increase in leads. Managed team of 8 marketers.',
          },
          position: { x: 0, y: 180 },
          size: { width: 100, height: 120 },
        },
        {
          id: 'education-1',
          type: 'education',
          content: {
            degree: 'MBA in Marketing',
            institution: 'Business School',
            year: '2017 - 2019',
          },
          position: { x: 0, y: 310 },
          size: { width: 100, height: 80 },
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
