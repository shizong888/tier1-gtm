import { Metadata } from 'next';
import { FlywheelGenerator } from '@/components/tools/flywheel-generator';

export const metadata: Metadata = {
  title: 'Flywheel Generator | Tier 1 Tools',
  description: 'Create branded flywheel diagrams with custom cards',
};

export default function ToolsPage() {
  return <FlywheelGenerator />;
}
