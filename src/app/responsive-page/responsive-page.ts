import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responsive-page',
  imports: [CommonModule],
  templateUrl: './responsive-page.html',
  styleUrl: './responsive-page.scss'
})
export class ResponsivePageComponent {
  features = signal([
    {
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Built with Angular 20 and optimized for speed and efficiency.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Perfectly adapted for all screen sizes and devices.'
    },
    {
      icon: '🎨',
      title: 'Modern Design',
      description: 'Clean, modern interface with Bootstrap components.'
    },
    {
      icon: '♿',
      title: 'Accessible',
      description: 'WCAG compliant with keyboard navigation and screen reader support.'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Built with security best practices and request validation.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Live data polling and real-time currency exchange rates.'
    }
  ]);

  testimonials = signal([
    {
      name: 'John Doe',
      role: 'Frontend Developer',
      content: 'This Angular application demonstrates excellent architecture and user experience design.',
      rating: 5
    },
    {
      name: 'Jane Smith',
      role: 'UI/UX Designer',
      content: 'The responsive design and accessibility features are outstanding.',
      rating: 5
    },
    {
      name: 'Mike Johnson',
      role: 'Full Stack Developer',
      content: 'Clean code structure with great error handling and user feedback.',
      rating: 5
    }
  ]);

  stats = signal([
    { value: '4', label: 'Main Features' },
    { value: '15s', label: 'Auto Refresh' },
    { value: '100%', label: 'Responsive' },
    { value: 'A+', label: 'Accessibility' }
  ]);

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
