import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import LockOutlined from '@mui/icons-material/LockOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import SmartphoneOutlined from '@mui/icons-material/SmartphoneOutlined';
import VisibilityOffOutlined from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';

/**
 * The designer's icon set (Figma «آیکون‌های وکتور سامانه»), keyed by the Figma names.
 * Use these instead of picking MUI icons by hand, so both of us use the same glyph for the same meaning.
 * Sizes: 20px inside fields and chips (`fontSize="small"`), 24px elsewhere (default).
 */
export const AppIcons = {
  /** دکمه بازگشت — in RTL "back" points right. */
  chevronRightRtl: ChevronRightRounded,
  /** تطابق و تأیید */
  checkVerified: CheckCircleOutlineRounded,
  /** ورود امور خوابگاه */
  shieldAdmin: ShieldOutlined,
  /** نمایش رمز */
  eyeVisibility: VisibilityOutlined,
  /** مخفی کردن رمز */
  eyeHidden: VisibilityOffOutlined,
  /** رمز مخصوص */
  lockPassword: LockOutlined,
  /** اعتبارسنجی OTP */
  otpMessage: ChatBubbleOutlineRounded,
  /** شماره همراه */
  phoneMobile: SmartphoneOutlined,
  /** کد دانشجویی */
  studentId: BadgeOutlined,
  /** Warning triangle in the login error banner (frame 6). Not in the icon sheet, but drawn in the frame. */
  warning: WarningAmberRounded,
} as const;
