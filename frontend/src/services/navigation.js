import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded'
import AndroidRoundedIcon from '@mui/icons-material/AndroidRounded'

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
    id: 'prompt-builder-group',
    label: 'Prompt Builder',
    icon: NoteAltRoundedIcon,
    children: [
      {
        id: 'prompt-builder',
        label: 'Prompt Builder GS',
        href: '/prompt-builder',
      },
      {
        id: 'prompt-builder-gt',
        label: 'Prompt Builder GT',
        href: '/prompt-builder-gt',
      },
    ],
  },
  {
    id: 'studio-iklan',
    label: 'Agent Mila',
    href: '/studio-iklan',
    icon: AndroidRoundedIcon,
  },
]

export const secondaryNavigationItems = []
