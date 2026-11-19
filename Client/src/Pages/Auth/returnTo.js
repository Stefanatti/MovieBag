const localPath = /^\/(?![\\/])/;

export const returnToFrom = ({ pathname, search, hash }) => `${pathname}${search}${hash}`;

export const safeReturnTo = (value) => {
  if (typeof value !== "string" || !localPath.test(value) || /[\\\s]/.test(value)) return "/";
  const url = new URL(value, "https://moviebag.invalid");
  if (!localPath.test(url.pathname) ||
      /^\/(?:login|signup|forgot_password|reset_password)(?:\/|$)/i.test(url.pathname)) return "/";
  return `${url.pathname}${url.search}${url.hash}`;
};
