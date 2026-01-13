import type { Meta, StoryObj } from '@storybook/react-vite';
import { StressTest } from './StressTest';
const meta = {
  title: 'StressTest',
  component: StressTest,
  tags: ['autodocs'],
} satisfies Meta<typeof StressTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    numberOfRoots: 4,
    numberOfSubtasks: 4,
    depth: 4,
  },
};