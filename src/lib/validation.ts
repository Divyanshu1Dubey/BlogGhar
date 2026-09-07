import { z } from 'zod';

// ─── Post schemas ─────────────────────────────────────────────────────

export const PostStatusEnum = z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED']);
export const PostFormatEnum = z.enum(['STANDARD', 'CUSTOM_CODE']);
export const PostTypeEnum = z.enum(['BLOG', 'NEWS', 'COMMUNITY']);

export const PostMetaSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(300),
  slug:        z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content:     z.string().min(1, 'Content is required'),
  excerpt:     z.string().max(500).optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  postType:    PostTypeEnum.default('BLOG'),
  status:      PostStatusEnum.default('DRAFT'),
  format:      PostFormatEnum.default('STANDARD'),
  categoryId:  z.string().min(1, 'Category is required'),
  tags:        z.string().optional(),
  seoTitle:    z.string().max(300).optional(),
  seoDesc:     z.string().max(500).optional(),
  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  ogImage:     z.string().url().optional().or(z.literal('')),
  customHtml:  z.string().optional(),
  customCss:   z.string().optional(),
  customJs:    z.string().optional(),
  customMeta:  z.string().optional(),
  faqs:        z.string().optional(),
  relatedIds:  z.string().optional(),
  isFeatured:  z.boolean().default(false),
  scheduledFor: z.string().optional(),
});

export type PostMetaInput = z.infer<typeof PostMetaSchema>;

// ─── Community post schema ───────────────────────────────────────────

export const CommunityPostKindEnum = z.enum(['THOUGHT', 'LINK', 'QUESTION', 'DISCOVERY']);

export const CommunityPostSchema = z.object({
  content:   z.string().min(1, 'Content cannot be empty'),
  kind:      CommunityPostKindEnum.default('THOUGHT'),
  linkUrl:   z.string().url().optional().or(z.literal('')),
  linkTitle: z.string().max(300).optional(),
  linkDesc:  z.string().max(500).optional(),
  imageUrl:  z.string().url().optional().or(z.literal('')),
  categoryId: z.string().optional(),
});

export type CommunityPostInput = z.infer<typeof CommunityPostSchema>;

// ─── Report schema ───────────────────────────────────────────────────

export const ReportReasonEnum = z.enum(['SPAM', 'ABUSE', 'MISINFORMATION', 'OTHER']);

export const ReportSchema = z.object({
  targetType:    z.enum(['post', 'comment', 'community_post']),
  targetId:      z.string().min(1),
  communityPostId: z.string().optional(),
  reason:        ReportReasonEnum,
  details:       z.string().max(2000, 'Details too long').optional(),
});

export type ReportInput = z.infer<typeof ReportSchema>;

// ─── Admin settings schema ───────────────────────────────────────────

export const AdminSettingsSchema = z.object({
  siteName:            z.string().max(100).optional(),
  siteDescription:     z.string().max(500).optional(),
  adminEmail:          z.string().email().optional().or(z.literal('')),
  metaTitle:           z.string().max(300).optional(),
  metaDescription:     z.string().max(500).optional(),
  adsensePublisherId:  z.string().max(100).optional(),
  allowCommunityPosts: z.boolean().default(true),
  requireModeration:   z.boolean().default(false),
});

export type AdminSettingsInput = z.infer<typeof AdminSettingsSchema>;
