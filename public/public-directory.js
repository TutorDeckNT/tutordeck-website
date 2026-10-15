// Progressive enhancements for the build-time public pages only.
for (const page of document.querySelectorAll('.static-public-page')) {
  const search = page.querySelector('#leader-search');
  if (search) {
    const entries = [...page.querySelectorAll('[data-leader-entry]')];
    const count = page.querySelector('[data-leader-count]');
    const empty = page.querySelector('[data-leader-empty]');
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      let matches = 0;
      for (const entry of entries) {
        entry.hidden = !entry.dataset.search.toLowerCase().includes(query);
        if (!entry.hidden) matches++;
      }
      count.textContent = `${matches} ${matches === 1 ? 'leader' : 'leaders'}${query ? ' found' : ''}`;
      empty.hidden = matches !== 0;
    };
    search.addEventListener('input', filter);
    page.querySelector('[data-leader-clear]').addEventListener('click', () => {
      search.value = '';
      filter();
      search.focus();
    });
    filter();
  }
  const carousel = page.querySelector('#leader-carousel');
  if (carousel) {
    carousel.tabIndex = 0;
    for (const button of page.querySelectorAll('[data-leader-direction]')) {
      button.addEventListener('click', () => carousel.scrollBy({
        left: Number(button.dataset.leaderDirection) * carousel.clientWidth * 0.8,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      }));
    }
  }
}
