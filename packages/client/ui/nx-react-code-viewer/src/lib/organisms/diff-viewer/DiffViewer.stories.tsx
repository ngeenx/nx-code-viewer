import type { Meta, StoryObj } from '@storybook/react';
import { DiffViewer } from './DiffViewer';

const oldTypescript = `export class UserService {
  getUser(id: number) {
    return this.http.get('/api/users/' + id);
  }
}`;

const newTypescript = `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.patch<User>(\`/api/users/\${id}\`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(\`/api/users/\${id}\`);
  }
}`;

const oldPython = `class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1`;

const newPython = `from dataclasses import dataclass

@dataclass
class Counter:
    count: int = 0

    def increment(self) -> None:
        self.count += 1

    def decrement(self) -> None:
        self.count -= 1

    def reset(self) -> None:
        self.count = 0`;

const meta: Meta<typeof DiffViewer> = {
  title: 'Organisms/DiffViewer',
  component: DiffViewer,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'python', 'html', 'css', 'json', 'plaintext'],
    },
    theme: { control: 'radio', options: ['dark', 'light'] },
    viewMode: { control: 'radio', options: ['unified', 'split'] },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
    },
    showLineNumbers: { control: 'boolean' },
    showHeader: { control: 'boolean' },
    maxHeight: { control: 'text' },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DiffViewer>;

export const Default: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const LightTheme: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: { backgrounds: { default: 'light' } },
};

export const SplitView: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    viewMode: 'split',
  },
};

export const PythonDiff: Story = {
  args: {
    oldCode: oldPython,
    newCode: newPython,
    language: 'python',
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const WithMaxHeight: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    maxHeight: '200px',
  },
};

export const NoHeader: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    showHeader: false,
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: newTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'grid-cross',
  },
  parameters: { layout: 'centered' },
};

export const NoChanges: Story = {
  args: {
    oldCode: oldTypescript,
    newCode: oldTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
  },
};
