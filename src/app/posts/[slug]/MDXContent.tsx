'use client'

import { useMemo, useEffect } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'

type Props = {
  code: string
  // Only declare fields that will be used in MDX
  frontmatter: {
    title: string
    date: string
    archive?: string
    category?: string
    // Add more whitelisted fields as needed
  }
}

export default function MDXContent({ code, frontmatter }: Props) {
  // 1. Construct whitelist scope
  const mdxScope = useMemo(() => {
    return {
      archive: frontmatter.archive ?? null,
      category: frontmatter.category ?? null,
      // Add more whitelisted fields as needed
    }
  }, [frontmatter])

  // 2. Create component with whitelisted scope only
  const Component = useMemo(() => {
    if (!code) {
      console.error('MDXContent: code is empty');
      return () => <div>No content available</div>;
    }
    try {
      return getMDXComponent(code);
    } catch (error) {
      console.error('MDXContent: Error getting MDX component:', error);
      return () => <div>Error rendering content</div>;
    }
  }, [code])

  // 3. Add heading level indicators and hover effects
  useEffect(() => {
    const addHeadingAttributes = () => {
      const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
      headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase().replace('h', '');
        heading.setAttribute('data-level', '#'.repeat(parseInt(level)));
        heading.setAttribute('id', `heading-${index}`);
      });
    };

    // Add syntax highlighting for code blocks
    const addSyntaxHighlighting = () => {
      // Check if Prism.js is available
      if (typeof window !== 'undefined' && (window as any).Prism) {
        (window as any).Prism.highlightAll();
      }
    };

    // Add copy buttons to code blocks
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.prose pre');
      codeBlocks.forEach((block) => {
        // Check if copy button already exists
        if (block.querySelector('.copy-button')) return;

        const code = block.querySelector('code');
        if (!code) return;

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        // Add click handler
        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(code.textContent || '');
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
            copyButton.textContent = 'Failed';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 1000);
          }
        });

        // Insert button at the beginning of the pre element
        block.insertBefore(copyButton, block.firstChild);
      });
    };

    // Run after component mounts
    const runAllFunctions = () => {
      addHeadingAttributes();
      addSyntaxHighlighting();
      addCopyButtons();
    };

    // Initial run
    setTimeout(runAllFunctions, 100);

    // Also run after a delay to ensure MDX content is fully rendered
    setTimeout(runAllFunctions, 500);

    // Additional runs to ensure elements are added
    setTimeout(runAllFunctions, 1000);
    setTimeout(runAllFunctions, 2000);

    // Set up a mutation observer to catch late-rendered content
    const observer = new MutationObserver(() => {
      setTimeout(runAllFunctions, 50);
    });

    const article = document.querySelector('article');
    if (article) {
      observer.observe(article, { 
        childList: true, 
        subtree: true,
        attributes: false,
        characterData: false
      });
    }

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

  // 4. Render with scope and custom components
  return <Component components={{}} scope={mdxScope} />
}
