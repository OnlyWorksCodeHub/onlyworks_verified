export const PROFESSION_CONFIGS = {
  developer: {
    name: 'Software Developer',
    primaryTools: ['VS Code', 'Terminal', 'Chrome DevTools', 'GitHub'],
    productivityIndicators: [
      'Code commits',
      'Debugging sessions',
      'Documentation updates',
      'Code reviews'
    ],
    distractions: ['Social media', 'YouTube', 'Reddit', 'News sites'],
    focusActivities: ['Coding', 'Debugging', 'Testing', 'Documentation'],
    aiTools: ['GitHub Copilot', 'ChatGPT', 'Claude', 'Cursor']
  },
  
  designer: {
    name: 'Designer',
    primaryTools: ['Figma', 'Photoshop', 'Illustrator', 'Sketch'],
    productivityIndicators: [
      'Design iterations',
      'Asset creation',
      'Prototype updates',
      'Feedback incorporation'
    ],
    distractions: ['Pinterest', 'Instagram', 'Dribbble browsing'],
    focusActivities: ['Designing', 'Prototyping', 'Asset creation', 'User research'],
    aiTools: ['Midjourney', 'DALL-E', 'Adobe Firefly']
  },
  
  finance: {
    name: 'Finance Professional',
    primaryTools: ['Excel', 'Bloomberg Terminal', 'PowerBI', 'QuickBooks'],
    productivityIndicators: [
      'Report generation',
      'Data analysis',
      'Model updates',
      'Calculations verified'
    ],
    distractions: ['News sites', 'Stock tickers', 'Social media'],
    focusActivities: ['Analysis', 'Modeling', 'Reporting', 'Auditing'],
    aiTools: ['ChatGPT', 'Bard', 'Excel Copilot']
  },
  
  marketing: {
    name: 'Marketing Professional',
    primaryTools: ['Google Analytics', 'Canva', 'HubSpot', 'Mailchimp'],
    productivityIndicators: [
      'Campaign creation',
      'Content writing',
      'Analytics review',
      'A/B test setup'
    ],
    distractions: ['Social media', 'News', 'Competitor sites'],
    focusActivities: ['Writing', 'Campaign planning', 'Analytics', 'Content creation'],
    aiTools: ['ChatGPT', 'Jasper', 'Copy.ai', 'Canva AI']
  },
  
  writer: {
    name: 'Writer',
    primaryTools: ['Google Docs', 'Word', 'Notion', 'Grammarly'],
    productivityIndicators: [
      'Words written',
      'Edits completed',
      'Research conducted',
      'Outlines created'
    ],
    distractions: ['Social media', 'News', 'Email'],
    focusActivities: ['Writing', 'Editing', 'Research', 'Outlining'],
    aiTools: ['ChatGPT', 'Claude', 'Grammarly', 'Jasper']
  },
  
  sales: {
    name: 'Sales Professional',
    primaryTools: ['Salesforce', 'HubSpot', 'Zoom', 'LinkedIn Sales Navigator'],
    productivityIndicators: [
      'Calls made',
      'Emails sent',
      'CRM updates',
      'Proposals created'
    ],
    distractions: ['Social media', 'News', 'Personal email'],
    focusActivities: ['Calling', 'Email outreach', 'CRM management', 'Proposal writing'],
    aiTools: ['ChatGPT', 'Crystal', 'Lavender']
  }
}

export function getProfessionConfig(profession: string) {
  return PROFESSION_CONFIGS[profession as keyof typeof PROFESSION_CONFIGS] || {
    name: 'Knowledge Worker',
    primaryTools: ['Browser', 'Email', 'Office Suite'],
    productivityIndicators: ['Tasks completed', 'Documents created', 'Communications sent'],
    distractions: ['Social media', 'News', 'Entertainment'],
    focusActivities: ['Working', 'Planning', 'Communicating'],
    aiTools: ['ChatGPT', 'Claude', 'Bard']
  }
}
