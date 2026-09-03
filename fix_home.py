import re

with open('src/app/(main)/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.rstrip()
open_count = content.count('{')
close_count = content.count('}')
print(f"Before fix: open={open_count}, close={close_count}, diff={open_count - close_count}")

# We need to wrap the component code in export default function HomePage() {
# Find where useState starts
useState_idx = content.find('  const [featuredPosts')

if useState_idx >= 0:
    # Remove extra closing braces at end
    while content.count('{') < content.count('}'):
        content = content.rstrip()
        if content.endswith('}'):
            content = content[:-1].rstrip()

    print(f"After removing extra }: open={content.count('{')}, close={content.count('}')}")

    # Now wrap in component function
    wrapper_open = 'export default function HomePage() {\n'
    content = content[:useState_idx] + wrapper_open + content[useState_idx:]

    # Add closing at end
    content = content.rstrip()
    content += '\n}'

    print(f"After wrapping: open={content.count('{')}, close={content.count('}')}")
else:
    print("ERROR: useState not found")

with open('src/app/(main)/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
