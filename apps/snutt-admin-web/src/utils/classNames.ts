export const classNames = (...classes: (false | string | undefined)[]) =>
  classes.filter((c) => typeof c === "string").join(" ");
