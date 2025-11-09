import Link from 'next/link';
import { blogConfig } from '@/lib/config';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  showArchive?: boolean;
}

export default function Breadcrumb({ 
  items = [], 
  showHome = true,
  showArchive = false 
}: BreadcrumbProps) {
  const defaultItems: BreadcrumbItem[] = [];
  
  if (showHome) {
    defaultItems.push({
      label: blogConfig.navigationText.backToHome,
      href: '/'
    });
  }
  
  if (showArchive) {
    defaultItems.push({
      label: blogConfig.navigationText.backToArchive,
      href: '/archive'
    });
  }

  const allItems = [...defaultItems, ...items];

  if (allItems.length === 0) return null;

  return (
    <div className="mb-6 flex gap-4">
      {allItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] hover:underline opacity-60"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
