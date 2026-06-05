/**
 * Helper to dynamically update SEO tags in the document head
 */
export function updateSEO(title: string, description?: string) {
  // Update document title
  document.title = title;

  // Update description tag
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }
}
