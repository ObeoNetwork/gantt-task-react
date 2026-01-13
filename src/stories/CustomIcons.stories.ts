import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomIcons } from './CustomIcons';
const meta = {
  title: 'CustomIcons',
  component: CustomIcons,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'CustomIcons',
  },
};