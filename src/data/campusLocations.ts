import { CampusLocation } from '@/types';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'main-library',
    name: 'Main Campus Library',
    zone: 'Central Quad',
    description: 'Ground floor security desk & quiet exchange foyer. Open 8:00 AM – 11:00 PM.',
    isPopular: true,
  },
  {
    id: 'student-centre',
    name: 'Student Activity Centre (SAC)',
    zone: 'East Wing',
    description: 'Near the Atrium steps and campus coffee shop. Busy, safe & well-lit.',
    isPopular: true,
  },
  {
    id: 'academic-block-a',
    name: 'Academic Block A Atrium',
    zone: 'Engineering Quad',
    description: 'Main ground lobby right next to Department notice boards.',
    isPopular: true,
  },
  {
    id: 'central-canteen',
    name: 'Central Canteen & Food Court',
    zone: 'South Campus',
    description: 'Outdoor seating benches under the trees. Ideal during lunch hours.',
    isPopular: true,
  },
  {
    id: 'hostel-block-4',
    name: 'Hostel Block 4 Common Lounge',
    zone: 'Residential Village',
    description: 'Dorm residential lounge, accessible via student ID card swipe.',
    isPopular: false,
  },
  {
    id: 'sports-complex',
    name: 'Campus Sports Arena & Gym',
    zone: 'West Fields',
    description: 'Ticket desk reception area, convenient for sports gear handovers.',
    isPopular: false,
  },
  {
    id: 'innovation-hub',
    name: 'MakerSpace & Innovation Hub',
    zone: 'Tech Cluster',
    description: 'Hardware workbench area with electronics testing benches.',
    isPopular: false,
  },
];

