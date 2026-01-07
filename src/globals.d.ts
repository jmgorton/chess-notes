declare module "*.md" {
  const value: string;
  export default value;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
