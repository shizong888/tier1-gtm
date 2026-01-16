import { Metadata } from 'next';
import { FlywheelGenerator } from '@/components/tools/flywheel-generator';

export const metadata: Metadata = {
  title: 'Flywheel Generator | Admin Tools',
  description: 'Create branded flywheel diagrams with custom cards',
};

export default function FlywheelPage() {
  return <FlywheelGenerator />;
}
