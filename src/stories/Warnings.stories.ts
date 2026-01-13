import type { Meta, StoryObj } from '@storybook/react-vite';
import { Warnings } from './Warnings';
const meta = {
  title: 'Warnings',
  component: Warnings,
  tags: ['autodocs'],
} satisfies Meta<typeof Warnings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Warnings',
  },
};