// IconName is re-exported here purely as an internal convenience, so component files can
// keep importing it alongside Icon. It is deliberately not part of this library's public
// surface — apps import it, the categories and the aliases from @memobit/icons directly.
export { Icon, type IconSize, type IconVariant } from './Icon';
export type { IconName } from '@memobit/icons';
