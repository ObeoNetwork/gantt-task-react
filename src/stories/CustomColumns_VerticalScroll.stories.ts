import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomColumns_VerticalScroll } from './CustomColumns_VerticalScroll';
const meta = {
  title: 'CustomColumns_VerticalScroll',
  component: CustomColumns_VerticalScroll,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomColumns_VerticalScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'CustomColumns_VerticalScroll',
  },
};