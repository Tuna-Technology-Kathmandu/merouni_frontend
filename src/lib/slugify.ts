export   function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // spaces → -
      .replace(/[^\w\-]+/g, '') // remove non-word chars
      .replace(/\-\-+/g, '-') // collapse multiple -
  }