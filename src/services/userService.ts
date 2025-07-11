export interface IUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {filter_enabled: boolean, filter_locked: boolean}
  external_urls: {spotify: string}
  followers: {href: null, total: number}
  href: string;
  id: string;
  product: string;
  type: string;
  uri: string;
}