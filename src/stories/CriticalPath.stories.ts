import type { Meta, StoryObj } from '@storybook/react-vite';
import { CriticalPath } from './CriticalPath';
const meta = {
  title: 'CriticalPath',
  component: CriticalPath,
  tags: ['autodocs'],
} satisfies Meta<typeof CriticalPath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'CriticalPath',
  },
};