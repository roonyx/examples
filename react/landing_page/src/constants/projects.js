const logoPath = '/static/images/projects/';

export const projects = [
  {
    id: 1,
    position: '01.',
    title: 'Projects For Good',
    subTitle: 'Projects For',
    subTitle1: 'Good',
    techologies: [
      'Ruby on Rails',
      'React',
      'Redux',
      'Grape',
      'ActiveAdmin / ES6',
      'CSS Modules',
    ],
    description: [
      'pfg-description-1',
    ],
    fullDescription: 'pfg-full-description',
    link: 'https://projectsforgood.com',
    logo: `${logoPath}pfg.svg`,
  },
  {
    id: 2,
    position: '02.',
    title: 'ICO Mint',
    subTitle1: 'ICO Mint',
    techologies: [
      'Ruby on Rails',
      'Angular 2',
      'Strip',
      'CoinPayments',
      'Twilio',
      'Facebook/Linkedin authentication',
    ],
    description: [
      'icom-description-1',
    ],
    fullDescription: 'icom-full-description',
    link: 'https://www.icomint.com/#',
    logo: `${logoPath}icom.png`,
    hideTitle: true,
  },
  {
    id: 3,
    position: '03.',
    title: 'DidItFor',
    subTitle1: 'DidItFor',
    techologies: [
      'Ruby on Rails 5',
      'Angular 5',
      'jQuery',
      'Bootstrap',
      'CSS3',
      'HTML5',
    ],
    description: [
      'dif-description-1',
    ],
    fullDescription: 'dif-full-description',
    link: 'https://diditfor.life/home',
    logo: `${logoPath}dif.png`,
    logoWidth: 200,
    hideTitle: true,
  },
  {
    id: 4,
    position: '04.',
    title: 'FAW',
    subTitle1: 'FAW',
    techologies: [
      'Angular 5',
      'Ruby on Rails',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Git',
    ],
    description: [
      'faw-description-1',
    ],
    fullDescription: 'faw-full-description',
    link: 'https://cars.china-faw.ru/#',
    logo: `${logoPath}faw.svg`,
    hideTitle: true,
  },
  {
    id: 5,
    position: '05.',
    title: 'Enbi',
    subTitle1: 'Enbi',
    techologies: [
      'Wordpress',
      'PHP',
      'JQuery',
    ],
    description: [
      'enbi-description-1',
    ],
    fullDescription: 'enbi-full-description',
    link: 'http://enbi.neuronux.com/',
    logo: `${logoPath}enbi.svg`,
    hideTitle: true,
  },
  {
    id: 6,
    position: '06.',
    title: 'Volonter 61',
    subTitle1: 'Volonter 61',
    techologies: [
      'Ruby On Rails',
      'Bootstrap 2',
      'JavaScript',
      'HTML5',
      'SCSS',
      'Backbone.js',
      'Nginx',
      'ElasticSearch',
      'Git',
    ],
    description: [
      'vol-description-1',
    ],
    fullDescription: 'vol-full-description',
    link: 'https://volonter61.ru',
    logo: `${logoPath}vol2.png`,
    logoHeight: 80,
    hideTitle: true,
  },
  {
    id: 7,
    position: '07.',
    title: 'CRM Dealer Point',
    subTitle: 'CRM Dealer',
    subTitle1: 'Point',
    techologies: [
      'Ruby On Rails',
      'Bootstrap 2',
      'JavaScript',
      'HTML5',
      'SCSS',
      'Backbone.js',
      'Nginx',
      'ElasticSearch',
      'Git',
    ],
    description: [
      'dp-description-1',
    ],
    fullDescription: 'dp-full-description',
    link: 'http://dealerpoint.ru/',
    logo: `${logoPath}dp.png`,
    logoWidth: 100,
  },
];

export const mockProject = {
  id: null,
  position: null,
  title: 'Your future project',
  isMock: true,
};
