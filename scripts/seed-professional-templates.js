require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🎨 Seeding Professional CV Templates...\n');

const professionalTemplates = [
  {
    name: 'Classic Professional',
    description: 'Traditional two-column layout with sidebar. Perfect for corporate jobs.',
    thumbnail: '/templates/classic-professional.jpg',
    category: 'professional',
    isPremium: false,
    isApproved: true,
    structure: {
      layout: 'two-column',
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        text: '#1f2937',
        background: '#ffffff',
      },
      components: [
        {
          id: 'sidebar',
          type: 'container',
          width: '35%',
          backgroundColor: '#f3f4f6',
          padding: '2rem',
          children: [
            {
              id: 'profile-image',
              type: 'image',
              content: { url: '', alt: 'Profile Photo', shape: 'circle' },
              width: '150px',
              height: '150px',
              margin: '0 auto 1.5rem',
            },
            {
              id: 'contact-section',
              type: 'section',
              title: 'CONTACT',
              children: [
                { type: 'contact', content: { email: 'john.doe@email.com', phone: '+1 234 567 8900', location: 'New York, NY', linkedin: 'linkedin.com/in/johndoe' } },
              ],
            },
            {
              id: 'skills-section',
              type: 'section',
              title: 'SKILLS',
              children: [
                { type: 'skills', content: { skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'] } },
              ],
            },
            {
              id: 'languages-section',
              type: 'section',
              title: 'LANGUAGES',
              children: [
                { type: 'text', content: { text: 'English - Native\nSpanish - Fluent\nFrench - Basic' } },
              ],
            },
          ],
        },
        {
          id: 'main-content',
          type: 'container',
          width: '65%',
          padding: '2rem',
          children: [
            {
              id: 'header',
              type: 'heading',
              content: { text: 'JOHN DOE', fontSize: 42, fontWeight: 'bold', color: '#2563eb' },
              marginBottom: '0.5rem',
            },
            {
              id: 'job-title',
              type: 'text',
              content: { text: 'Senior Software Engineer', fontSize: 20, color: '#6b7280' },
              marginBottom: '1.5rem',
            },
            {
              id: 'summary-section',
              type: 'section',
              title: 'PROFESSIONAL SUMMARY',
              children: [
                { type: 'text', content: { text: 'Results-driven software engineer with 8+ years of experience in full-stack development. Proven track record of delivering scalable solutions and leading cross-functional teams.' } },
              ],
            },
            {
              id: 'experience-section',
              type: 'section',
              title: 'WORK EXPERIENCE',
              children: [
                {
                  type: 'experience',
                  content: {
                    title: 'Senior Software Engineer',
                    company: 'Tech Corp',
                    duration: '2020 - Present',
                    location: 'San Francisco, CA',
                    description: '• Led development of microservices architecture\n• Mentored team of 5 junior developers\n• Improved system performance by 40%',
                  },
                },
                {
                  type: 'experience',
                  content: {
                    title: 'Software Engineer',
                    company: 'StartUp Inc',
                    duration: '2017 - 2020',
                    location: 'New York, NY',
                    description: '• Built RESTful APIs using Node.js\n• Implemented CI/CD pipelines\n• Collaborated with product team',
                  },
                },
              ],
            },
            {
              id: 'education-section',
              type: 'section',
              title: 'EDUCATION',
              children: [
                {
                  type: 'education',
                  content: {
                    degree: 'Bachelor of Science in Computer Science',
                    institution: 'University of Technology',
                    year: '2013 - 2017',
                    gpa: 'GPA: 3.8/4.0',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Modern Minimalist',
    description: 'Clean, centered design with plenty of white space. Great for creative professionals.',
    thumbnail: '/templates/modern-minimalist.jpg',
    category: 'modern',
    isPremium: false,
    isApproved: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        text: '#1f2937',
        background: '#ffffff',
      },
      components: [
        {
          id: 'header-center',
          type: 'container',
          textAlign: 'center',
          padding: '3rem 2rem',
          borderBottom: '2px solid #e5e7eb',
          children: [
            {
              type: 'heading',
              content: { text: 'JANE SMITH', fontSize: 48, fontWeight: 'bold', letterSpacing: '0.1em' },
              marginBottom: '0.5rem',
            },
            {
              type: 'text',
              content: { text: 'Product Designer', fontSize: 18, color: '#6b7280' },
              marginBottom: '1rem',
            },
            {
              type: 'contact',
              content: {
                email: 'jane.smith@email.com',
                phone: '+1 234 567 8900',
                website: 'janesmith.com',
                layout: 'inline',
              },
            },
          ],
        },
        {
          id: 'about-section',
          type: 'section',
          title: 'ABOUT',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          children: [
            {
              type: 'text',
              content: {
                text: 'Creative product designer with a passion for user-centered design. 6+ years of experience crafting intuitive digital experiences for web and mobile applications.',
                fontSize: 16,
                lineHeight: 1.8,
              },
            },
          ],
        },
        {
          id: 'experience-modern',
          type: 'section',
          title: 'EXPERIENCE',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem',
          children: [
            {
              type: 'experience',
              content: {
                title: 'Senior Product Designer',
                company: 'Design Studio',
                duration: '2021 - Present',
                description: 'Leading design initiatives for enterprise SaaS products. Conducting user research and creating design systems.',
              },
            },
            {
              type: 'experience',
              content: {
                title: 'Product Designer',
                company: 'Creative Agency',
                duration: '2018 - 2021',
                description: 'Designed mobile apps and websites for various clients. Collaborated with developers and stakeholders.',
              },
            },
          ],
        },
        {
          id: 'skills-modern',
          type: 'section',
          title: 'SKILLS',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem',
          children: [
            {
              type: 'skills',
              content: {
                skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
                layout: 'grid',
              },
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Creative Portfolio',
    description: 'Bold design with image focus. Perfect for designers and creatives.',
    thumbnail: '/templates/creative-portfolio.jpg',
    category: 'creative',
    isPremium: false,
    isApproved: true,
    structure: {
      layout: 'asymmetric',
      colors: {
        primary: '#8b5cf6',
        secondary: '#6d28d9',
        text: '#1f2937',
        background: '#ffffff',
        accent: '#f3f4f6',
      },
      components: [
        {
          id: 'hero-section',
          type: 'container',
          display: 'flex',
          padding: '3rem',
          backgroundColor: '#8b5cf6',
          color: '#ffffff',
          children: [
            {
              type: 'image',
              content: { url: '', alt: 'Profile', shape: 'square' },
              width: '200px',
              height: '200px',
              marginRight: '3rem',
            },
            {
              type: 'container',
              children: [
                {
                  type: 'heading',
                  content: { text: 'ALEX JOHNSON', fontSize: 48, fontWeight: 'bold', color: '#ffffff' },
                },
                {
                  type: 'text',
                  content: { text: 'Creative Director & Designer', fontSize: 24, color: '#e9d5ff' },
                },
                {
                  type: 'text',
                  content: { text: 'Crafting beautiful digital experiences that inspire and engage.', fontSize: 16, marginTop: '1rem' },
                },
              ],
            },
          ],
        },
        {
          id: 'main-creative',
          type: 'container',
          padding: '3rem',
          children: [
            {
              type: 'section',
              title: 'EXPERTISE',
              children: [
                {
                  type: 'skills',
                  content: {
                    skills: ['Brand Identity', 'UI/UX Design', 'Motion Graphics', 'Art Direction', 'Typography', 'Illustration'],
                    style: 'pills',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'EXPERIENCE',
              children: [
                {
                  type: 'experience',
                  content: {
                    title: 'Creative Director',
                    company: 'Innovative Agency',
                    duration: '2020 - Present',
                    description: 'Leading creative team of 12 designers. Overseeing brand campaigns for Fortune 500 clients.',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'AWARDS',
              children: [
                {
                  type: 'text',
                  content: { text: '🏆 Webby Award - Best Visual Design 2023\n🏆 Awwwards Site of the Day 2022\n🏆 Red Dot Design Award 2021' },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Executive Resume',
    description: 'Professional layout for senior positions. Emphasizes leadership and achievements.',
    thumbnail: '/templates/executive.jpg',
    category: 'executive',
    isPremium: true,
    isApproved: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        text: '#1f2937',
        background: '#ffffff',
      },
      components: [
        {
          type: 'container',
          backgroundColor: '#1e40af',
          color: '#ffffff',
          padding: '2.5rem 3rem',
          children: [
            {
              type: 'heading',
              content: { text: 'MICHAEL ANDERSON', fontSize: 44, fontWeight: 'bold', color: '#ffffff' },
            },
            {
              type: 'text',
              content: { text: 'Chief Technology Officer', fontSize: 22, color: '#93c5fd' },
            },
          ],
        },
        {
          type: 'container',
          padding: '3rem',
          children: [
            {
              type: 'section',
              title: 'EXECUTIVE SUMMARY',
              children: [
                {
                  type: 'text',
                  content: {
                    text: 'Strategic technology leader with 15+ years driving digital transformation and innovation. Proven track record of scaling engineering teams and delivering enterprise solutions.',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'KEY ACHIEVEMENTS',
              children: [
                {
                  type: 'text',
                  content: {
                    text: '• Led company through successful IPO, growing engineering team from 50 to 300+\n• Reduced infrastructure costs by $5M annually through cloud optimization\n• Implemented AI/ML solutions resulting in 35% efficiency improvement',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'PROFESSIONAL EXPERIENCE',
              children: [
                {
                  type: 'experience',
                  content: {
                    title: 'Chief Technology Officer',
                    company: 'Enterprise Solutions Inc',
                    duration: '2018 - Present',
                    description: 'Leading technology strategy and innovation for $500M revenue company.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Academic CV',
    description: 'Detailed layout for researchers and academics. Focuses on publications and research.',
    thumbnail: '/templates/academic.jpg',
    category: 'academic',
    isPremium: false,
    isApproved: true,
    structure: {
      layout: 'single-column',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        text: '#1f2937',
        background: '#ffffff',
      },
      components: [
        {
          type: 'container',
          padding: '2rem 3rem',
          borderBottom: '3px solid #059669',
          children: [
            {
              type: 'heading',
              content: { text: 'Dr. Sarah Williams', fontSize: 36, fontWeight: 'bold' },
            },
            {
              type: 'text',
              content: { text: 'Associate Professor of Computer Science', fontSize: 18, color: '#6b7280' },
            },
            {
              type: 'contact',
              content: {
                email: 's.williams@university.edu',
                phone: '+1 234 567 8900',
                website: 'sarahwilliams.edu',
              },
            },
          ],
        },
        {
          type: 'container',
          padding: '2rem 3rem',
          children: [
            {
              type: 'section',
              title: 'RESEARCH INTERESTS',
              children: [
                {
                  type: 'text',
                  content: { text: 'Machine Learning, Natural Language Processing, Computer Vision, AI Ethics' },
                },
              ],
            },
            {
              type: 'section',
              title: 'EDUCATION',
              children: [
                {
                  type: 'education',
                  content: {
                    degree: 'Ph.D. in Computer Science',
                    institution: 'Stanford University',
                    year: '2015',
                    thesis: 'Deep Learning Approaches to Natural Language Understanding',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'PUBLICATIONS',
              children: [
                {
                  type: 'text',
                  content: {
                    text: '1. Williams, S. et al. (2023). "Advanced NLP Techniques." Nature Machine Intelligence.\n2. Williams, S. (2022). "AI Ethics Framework." ACM Computing Surveys.\n3. Williams, S. et al. (2021). "Deep Learning Models." ICML 2021.',
                  },
                },
              ],
            },
            {
              type: 'section',
              title: 'GRANTS & AWARDS',
              children: [
                {
                  type: 'text',
                  content: { text: '• NSF CAREER Award ($500,000) - 2022\n• Best Paper Award, ICML - 2021\n• Google Research Grant ($100,000) - 2020' },
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

async function seedProfessionalTemplates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      role: String,
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

    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@cvbuilder.com',
        role: 'admin',
      });
    }

    // Clear old templates
    await Template.deleteMany({});
    console.log('🗑️  Cleared old templates\n');

    // Insert professional templates
    for (const template of professionalTemplates) {
      await Template.create({
        ...template,
        createdBy: adminUser._id,
      });
      console.log(`✅ Created: ${template.name} (${template.category})`);
    }

    console.log(`\n🎉 Successfully seeded ${professionalTemplates.length} professional CV templates!`);
    console.log('\n📋 Templates created:');
    professionalTemplates.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name} - ${t.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedProfessionalTemplates();
