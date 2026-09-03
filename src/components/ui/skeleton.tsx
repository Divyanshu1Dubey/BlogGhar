import { cn } from '@/lib/utils';
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function BaseSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700', className)}
      {...props}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/* ---------- Post Card Skeleton ---------- */
export function PostCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card overflow-hidden', className)}>
      <BaseSkeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BaseSkeleton className="h-5 w-20 rounded-full" />
          <BaseSkeleton className="h-5 w-16 rounded-full" />
        </div>
        <BaseSkeleton className="h-6 w-full" />
        <BaseSkeleton className="h-6 w-3/4" />
        <BaseSkeleton className="h-4 w-full" />
        <BaseSkeleton className="h-4 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <BaseSkeleton className="h-8 w-8 rounded-full" />
            <BaseSkeleton className="h-4 w-24" />
          </div>
          <BaseSkeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Game Card Skeleton ---------- */
export function GameCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card p-5', className)}>
      <BaseSkeleton className="w-14 h-14 rounded-xl mb-3" />
      <BaseSkeleton className="h-5 w-3/4 mb-2" />
      <BaseSkeleton className="h-4 w-full mb-1" />
      <BaseSkeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center justify-between">
        <BaseSkeleton className="h-5 w-16 rounded-full" />
        <BaseSkeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

/* ---------- Table Row Skeleton ---------- */
export function TableRowSkeleton({ className, columns = 5 }: { className?: string; columns?: number }) {
  return (
    <tr className={cn('border-b border-gray-100 dark:border-gray-800', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <BaseSkeleton className={cn('h-4', i === 0 ? 'w-3/4' : 'w-1/2')} />
        </td>
      ))}
    </tr>
  );
}

/* ---------- Stats Card Skeleton ---------- */
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <BaseSkeleton className="h-4 w-24" />
          <BaseSkeleton className="h-8 w-32" />
          <BaseSkeleton className="h-3 w-16" />
        </div>
        <BaseSkeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );
}

/* ---------- News Card Skeleton ---------- */
export function NewsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card overflow-hidden group', className)}>
      <BaseSkeleton className="aspect-video w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BaseSkeleton className="h-5 w-20 rounded-full" />
        </div>
        <BaseSkeleton className="h-5 w-full" />
        <BaseSkeleton className="h-5 w-4/5" />
        <BaseSkeleton className="h-4 w-full" />
        <div className="flex items-center gap-2 pt-1">
          <BaseSkeleton className="h-3 w-16" />
          <BaseSkeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Article Skeleton ---------- */
export function ArticleSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('max-w-3xl mx-auto', className)}>
      <BaseSkeleton className="h-8 w-3/4 mb-4" />
      <div className="flex items-center gap-4 mb-8">
        <BaseSkeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <BaseSkeleton className="h-4 w-32" />
          <BaseSkeleton className="h-3 w-24" />
        </div>
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <BaseSkeleton key={i} className={cn('h-4 mb-3', i === 5 ? 'w-2/3' : 'w-full')} />
      ))}
      <BaseSkeleton className="aspect-video w-full mt-6 rounded-xl" />
      {Array.from({ length: 4 }).map((_, i) => (
        <BaseSkeleton key={`para-${i}`} className={cn('h-4 mt-3', i === 3 ? 'w-3/4' : 'w-full')} />
      ))}
    </div>
  );
}

/* ---------- Comment Skeleton ---------- */
export function CommentSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-3', className)}>
      <BaseSkeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <BaseSkeleton className="h-4 w-24" />
          <BaseSkeleton className="h-3 w-16" />
        </div>
        <BaseSkeleton className="h-3 w-full" />
        <BaseSkeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

/* ---------- Generic Skeleton ---------- */
export function Skeleton({
  className,
  variant = 'rect',
  ...props
}: SkeletonProps & { variant?: 'rect' | 'circle' | 'text' }) {
  const variantClass = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded h-4' : 'rounded-lg';
  return <BaseSkeleton className={cn(variantClass, className)} {...props} />;
}
