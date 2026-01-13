import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomPalette_Zoom } from './CustomPalette_Zoom';
const meta = {
  title: 'CustomPalette_Zoom',
  component: CustomPalette_Zoom,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomPalette_Zoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'CustomPalette_Zoom',
  },
};