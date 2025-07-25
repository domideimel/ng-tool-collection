import { MenuItem } from 'primeng/api';

export const NAVIGATION: MenuItem[] = [
  {
    label: 'Tools',
    routerLink: 'tools',
    title:
      'Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.',
    items: [
      {
        label: 'Passwort Generator',
        routerLink: 'tools/password-generator',
        title:
          'Entdecken Sie unseren Passwort-Generator, der robuste und sichere Passwörter erstellt, die schwer zu knacken sind. Mit zufällig generierten Kombinationen aus Buchstaben, Zahlen und Sonderzeichen gewährleisten wir höchste Sicherheit für Ihre Online-Konten. Steigern Sie Ihre digitale Sicherheit, indem Sie einzigartige Passwörter für jeden Account erstellen.',
      },
      {
        label: 'Url Rewrites',
        routerLink: 'tools/url-rewrites',
        title:
          'Erstellen Sie Weiterleitungen für Ihre URLs und Links. Generieren Sie kurze, benutzerdefinierte URLs, die sich leicht merken und teilen lassen. Mit unserem Weiterleitungs-Generator können Sie lange, komplexe URLs in kurze, benutzerfreundliche Links umwandeln.',
      },
      {
        label: 'Currency Converter',
        routerLink: 'tools/currency-converter',
        title: 'Einfach und schnell von einer Wâhrung zu einer anderen umwandeln.',
      },
    ],
  },
];
