import type { Meta, StoryObj } from '@storybook/react-vite';
import { CustomRelationKind } from './CustomRelationKind';
const meta = {
  title: 'CustomRelationKind',
  component: CustomRelationKind,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomRelationKind>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'CustomRelationKind',
  },
};