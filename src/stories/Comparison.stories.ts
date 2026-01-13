import type { Meta, StoryObj } from '@storybook/react-vite';
import { Comparison } from './Comparison';
const meta = {
  title: 'Comparison',
  component: Comparison,
  tags: ['autodocs'],
} satisfies Meta<typeof Comparison>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Comparison',
  },
};