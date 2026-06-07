import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded'

export const defaultNavigationPath = '/'

export const implementedNavigationPaths = ['/', '/image-editor', '/prompt-builder']

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
    label: 'Prompt Builder',
    href: '/prompt-builder',
    icon: NoteAltRoundedIcon,
  },
]

export const secondaryNavigationItems = []
