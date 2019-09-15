import DefaultExtractor from '../DefaultExtractor'

import Bandcamp from './Bandcamp'
import BandcampList from './BandcampList'
// import Soundcloud from './Soundcloud'
// import SoundcloudArtist from './SoundcloudArtist'
// import SoundcloudPlaylist from './SoundcloudPlaylist'
// import Vk from './Vk'
// import Yandex from './Yandex'
// import YandexAlbum from './YandexAlbum'
// import YandexArtist from './YandexArtist'
// import YandexPlaylist from './YandexPlaylist'
import Youtube from './Youtube'
// import YoutubeArtist from './YoutubeArtist'
import YoutubeList from './YoutubeList'

const extractors: DefaultExtractor[] = [
  Bandcamp,
  BandcampList,
  // Soundcloud,
  // SoundcloudPlaylist,
  Youtube,
  YoutubeList,
  // YoutubeArtist,
  // Vk,
  // Yandex,
  // YandexAlbum,
  // YandexArtist,
  // YandexPlaylist
]

export default extractors
