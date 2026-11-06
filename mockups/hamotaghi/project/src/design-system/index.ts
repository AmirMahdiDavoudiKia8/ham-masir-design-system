/**
 * Public API of the design system. Import from `@/design-system` only —
 * never from a file inside it.
 */
export * as tokens from './tokens';
export { statusStroke, statusText } from './tokens';
export { theme } from './theme';
export { DesignSystemProvider } from './DesignSystemProvider';
export { faDigits, enDigits } from './digits';
export { AppIcons } from './icons';

export { PageContainer } from './components/PageContainer';
export { PageHeader } from './components/PageHeader';
export { SectionCard } from './components/SectionCard';
export { EmptyState } from './components/EmptyState';
export { StatCard } from './components/StatCard';
export { MatchScore, getMatchLevel } from './components/MatchScore';
export { MatchCard } from './components/MatchCard';
export { StatusChip, type MatchStatus } from './components/StatusChip';
export { PriorityPicker, type Priority } from './components/PriorityPicker';
export { QuestionnaireProgress } from './components/QuestionnaireProgress';
export { ScaleQuestion } from './components/ScaleQuestion';
export { OtpInput } from './components/OtpInput';
export { PillField, type PillFieldStatus } from './components/PillField';
export { PillSelect } from './components/PillSelect';
export { ValidationChip, type ValidationStatus } from './components/ValidationChip';
export { MobileFrame } from './components/MobileFrame';
export { WelcomeBox } from './components/WelcomeBox';
export { IconBadge } from './components/IconBadge';
