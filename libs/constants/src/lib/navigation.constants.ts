import { Link } from '@ng-tool-collection/models';

export const NAVIGATION: Link[] = [
  // {
  //   label: 'Me',
  //   path: '/',
  //   description:
  //     'Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.',
  // },
  {
    label: 'Tools',
    path: 'tools',
    description:
      'Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.',
    children: [
      {
        label: 'Passwort Generator',
        path: 'tools/password-generator',
        description:
          'Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.',
      },
      {
        label: 'Url Rewrites',
        path: 'tools/url-rewrites',
        description:
          'Erstellen Sie Weiterleitungen für Ihre URLs und Links. Generieren Sie kurze, benutzerdefinierte URLs, die sich leicht merken und teilen lassen. Mit unserem Weiterleitungs-Generator können Sie lange, komplexe URLs in kurze, benutzerfreundliche Links umwandeln.',
      },
      {
        label: 'Currency Converter',
        path: 'tools/currency-converter',
        description: 'Einfach und schnell von einer Wâhrung zu einer anderen umwandeln.',
      },
    ],
  },
];
