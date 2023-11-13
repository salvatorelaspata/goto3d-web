type itemHeaderProps = {
  name: string
  url: string
}

export class Constants {
  public static readonly privateRoutes: itemHeaderProps[] = [
    {
      name: 'Progetti',
      url: '/projects',
    },
    {
      name: 'Cataloghi (Coming Soon)',
      url: '',
    },
  ]
  public static readonly publicRoutes: itemHeaderProps[] = [
    {
      name: 'Dashboard',
      url: '/',
    },
  ]
}
