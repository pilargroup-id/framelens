import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded'

export const defaultNavigationPath = '/'

export const implementedNavigationPaths = ['/', '/image-editor']

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
]

export const secondaryNavigationItems = []
