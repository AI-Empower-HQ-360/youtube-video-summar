# React & Component Patterns

## Component Structure

### Page Component Pattern
File: `src/components/FeaturePage.tsx`
```typescript
/**
 * @label Feature Page
 * @description Page component for feature routing and state
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FeatureCard } from './FeatureCard';
import { useFeatureData } from '@/hooks/useFeatureData';
import { toast } from 'sonner';

export function FeaturePage() {
  const [filter, setFilter] = useState('');
  const { data, isLoading, error } = useFeatureData();

  if (error) {
    toast.error(error.message);
    return <div>Error loading feature</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Features</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {data?.map(item => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Feature Component Pattern
File: `src/components/FeatureCard.tsx`
```typescript
/**
 * @label Feature Card Component
 * @description Reusable feature card UI component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  item: {
    id: string;
    title: string;
    description: string;
  };
}

export function FeatureCard({ item }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{item.description}</p>
        <Button className="mt-4">Learn More</Button>
      </CardContent>
    </Card>
  );
}
```

## Custom Hooks

### Hook Pattern
File: `src/hooks/useFeatureData.ts`
```typescript
/**
 * @label Use Feature Data Hook
 * @description Fetch and manage feature data with caching
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api.service';

interface FeatureData {
  id: string;
  title: string;
  description: string;
}

/**
 * @label Use Feature Data
 * @description Fetch feature data with TanStack Query
 */
export function useFeatureData() {
  const { data, isLoading, error } = useQuery<FeatureData[]>({
    queryKey: ['features'],
    queryFn: async () => {
      const response = await apiClient.get('/features');
      return response.data.data; // API response: { success, data: [...] }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  return { data, isLoading, error };
}
```

## State Management

### Local State (Simple)
```typescript
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isOpen, setIsOpen] = useState(false);
```

### Server State (TanStack Query)
```typescript
// For remote data with caching/refetching
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => apiClient.get(`/resource/${id}`),
  staleTime: 10 * 60 * 1000
});
```

### Context for Global UI State
```typescript
// Use React Context for theme, language, etc.
// Avoid Redux - overkill for this project
```

## Styling Rules

### ✅ Use Tailwind Classes Directly
```typescript
<div className="flex items-center gap-2 p-4 rounded-lg bg-blue-50">
  <span className="text-sm font-semibold text-blue-900">Status</span>
</div>
```

### ❌ Don't Use CSS Modules
```typescript
// Wrong approach for this project
import styles from './Component.module.css';
<div className={styles.container}>
```

### ❌ Don't Use Inline Styles
```typescript
// Avoid - breaks consistency
<div style={{ padding: '16px', color: 'blue' }}>
```

## Form Handling

### Hook Form Pattern
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters')
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post('/auth/login', data);
      localStorage.setItem('auth_token', response.data.token);
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Login</button>
    </form>
  );
}
```

## Error Boundaries & UI Feedback

### Error Boundary
File: `src/ErrorFallback.tsx`
```typescript
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="p-6 bg-red-50 rounded-lg">
      <h2 className="text-lg font-bold text-red-900">Something went wrong</h2>
      <p className="text-sm text-red-700 mt-2">{error.message}</p>
      <button onClick={resetErrorBoundary} className="mt-4 btn-primary">
        Try again
      </button>
    </div>
  );
}
```

### Toast Notifications
```typescript
import { toast } from 'sonner';

// Success
toast.success('Operation completed!');

// Error
toast.error('Something went wrong');

// Loading
const promise = apiCall();
toast.promise(promise, {
  loading: 'Loading...',
  success: 'Success!',
  error: 'Error occurred'
});

// Custom
toast.custom((t) => (
  <div>Custom notification {t.id}</div>
));
```

## TypeScript Patterns

### Type Exports
```typescript
/**
 * @label Feature Data Type
 * @description Type for feature API response
 */
export interface FeatureData {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export type FeatureStatus = 'active' | 'inactive' | 'pending';
```

### Generic Components
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect?: (item: T) => void;
}

export function List<T extends { id: string }>({
  items,
  renderItem,
  onSelect
}: ListProps<T>) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id} onClick={() => onSelect?.(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
```
