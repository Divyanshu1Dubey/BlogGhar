import { Metadata } from 'next';

const TOOL_META: Record<string, { title: string; description: string }> = {
  'emi-calculator': {
    title: 'EMI Calculator',
    description: 'Free online EMI calculator for home, car, and personal loans. Calculate monthly EMI, total interest, and full amortization schedule.',
  },
  'sip-calculator': {
    title: 'SIP Calculator',
    description: 'Calculate SIP returns with lump sum and step-up investments. Get maturity value, total returns, and investment breakdown.',
  },
  'income-tax-calculator': {
    title: 'Income Tax Calculator',
    description: 'Calculate Indian income tax for FY 2025-26. Compute tax under old vs new regime with deductions.',
  },
  'loan-affordability': {
    title: 'Loan Affordability Calculator',
    description: 'Check how much home loan you can afford based on your income, EMI, and financial obligations.',
  },
  'percentage-calculator': {
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, increase, decrease, and find what percent one number is of another.',
  },
  'bmi-calculator': {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) for weight assessment. Get category and healthy weight range.',
  },
  'age-calculator': {
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days from your date of birth.',
  },
  'date-difference': {
    title: 'Date Difference Calculator',
    description: 'Calculate the exact duration between two dates. Find days, weeks, months, and years difference.',
  },
  'gpa-calculator': {
    title: 'GPA Calculator',
    description: 'Calculate your GPA and CGPA from grades and credits. Support for multiple grading scales.',
  },
  'compound-interest': {
    title: 'Compound Interest Calculator',
    description: 'Calculate compound interest returns. See how your investment grows over time with monthly/annual compounding.',
  },
  'discount-calculator': {
    title: 'Discount Calculator',
    description: 'Calculate discounted price, savings, and original price. Apply percentage or fixed discounts.',
  },
  'tip-calculator': {
    title: 'Tip Calculator',
    description: 'Split bills and calculate tips easily. Enter bill amount, tip percentage, and number of people.',
  },
  'unit-converter': {
    title: 'Unit Converter',
    description: 'Free online unit converter for length, weight, temperature, volume, area, speed, time, and data units.',
  },
  'word-counter': {
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs. Free online word counter tool.',
  },
  'json-formatter': {
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON online. Beautify JSON with syntax highlighting.',
  },
  'password-generator': {
    title: 'Password Generator',
    description: 'Generate strong secure passwords online. Customize length, characters, and symbols.',
  },
  'base64-encoder': {
    title: 'Base64 Encoder/Decoder',
    description: 'Encode or decode Base64 strings online. Free Base64 converter tool.',
  },
  'qr-code-generator': {
    title: 'QR Code Generator',
    description: 'Generate free QR codes for URLs, text, or contact info. Download as PNG.',
  },
  'image-compressor': {
    title: 'Image Compressor',
    description: 'Compress images online. Reduce file size while maintaining quality. Supports JPG, PNG, WebP.',
  },
  'pdf-tools': {
    title: 'PDF Tools',
    description: 'Merge, split, compress, or convert PDF files online. Free PDF utility tools.',
  },
  'text-diff': {
    title: 'Text Diff Checker',
    description: 'Compare two texts and find differences. Highlight additions, deletions, and changes.',
  },
  'color-converter': {
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and HSV color formats. Free color tool.',
  },
  'markdown-converter': {
    title: 'Markdown to HTML Converter',
    description: 'Convert Markdown to HTML online. Free Markdown converter with live preview.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = TOOL_META[slug];

  return {
    title: meta?.title || 'Free Online Tool',
    description: meta?.description || 'Free online tool on Blog-Ghar. No registration required.',
    alternates: { canonical: `https://bloghar.com/tools/${slug}` },
    openGraph: {
      title: meta?.title || 'Free Online Tool',
      description: meta?.description || 'Free online tool on Blog-Ghar.',
      url: `https://bloghar.com/tools/${slug}`,
      siteName: 'Blog-Ghar',
      type: 'website',
    },
  };
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
