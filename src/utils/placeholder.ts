/** Neutral gray placeholder box standing in for a real photo until one is uploaded. */
export const placeholderImage = (label = 'Kép helye', ratioClass = 'aspect-4/3'): string => `
<div class="w-full ${ratioClass} rounded-md bg-gray-200 dark:bg-slate-700 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-slate-500">
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
  <span class="text-sm font-medium">${label}</span>
</div>`;
