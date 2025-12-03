import connectDB from '../lib/db';
import Template from '../lib/models/Template';
import User from '../lib/models/User';

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
        {
          id: 'experience-1',
          type: 'experience',
          content: {
            title: 'Job Title',
            company: 'Company Name',
            duration: '2020 - Present',
            description: 'Brief description of your role and achievements',
          },
          position: { x: 0, y: 160 },
          size: { width: 100, height: 120 },
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
        {
          id: 'skills-1',
          type: 'skills',
          content: { skills: ['Design', 'Illustration', 'Branding', 'UI/UX'] },
          position: { x: 0, y: 170 },
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
          content: { text: 'Your Name', fontSize: 28, fontWeight: 'normal' },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 50 },
        },
        {
          id: 'text-1',
          type: 'text',
          content: { text: 'Professional Title', fontSize: 16 },
          position: { x: 0, y: 60 },
          size: { width: 100, height: 30 },
        },
        {
          id: 'education-1',
          type: 'education',
          content: {
            degree: 'Degree Name',
            institution: 'University Name',
            year: '2020',
          },
          position: { x: 0, y: 100 },
          size: { width: 100, height: 80 },
        },
      ],
    },
  },
];

async function seedTemplates() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find or create admin user
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Creating default admin...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@cvbuilder.com',
        role: 'admin',
        provider: 'credentials',
      });
      console.log('Admin user created. Email: admin@cvbuilder.com');
    }

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    for (const template of templates) {
      await Template.create({
        ...template,
        createdBy: adminUser._id,
      });
      console.log(`Created template: ${template.name}`);
    }

    console.log('\nSeeding completed successfully!');
    console.log(`Total templates created: ${templates.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedTemplates();
