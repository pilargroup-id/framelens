import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'

export const defaultNavigationPath = '/'

export const implementedNavigationPaths = ['/', '/image-editor', '/prompt-builder', '/prompt-builder-gt', '/studio-iklan']

export const primaryNavigationItems = [
  {
    id: 'gallery',
    label: 'Gallery',
    href: '/',
    icon: PhotoLibraryRoundedIcon,
  },
  {
    id: 'image-generator',
    label: 'Image Generator',
    href: '/image-editor',
    icon: AutoAwesomeRoundedIcon,
  },
  {
    id: 'prompt-builder',
    label: 'Prompt Builder GS',
    href: '/prompt-builder',
    icon: NoteAltRoundedIcon,
  },
  {
    id: 'prompt-builder-gt',
    label: 'Prompt Builder GT',
    href: '/prompt-builder-gt',
    icon: ShoppingBagRoundedIcon,
  },
  {
    id: 'studio-iklan',
    label: 'Studio Iklan',
    href: '/studio-iklan',
    icon: CampaignRoundedIcon,
  },
]

export const secondaryNavigationItems = []
