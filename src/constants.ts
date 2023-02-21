type itemHeaderProps = {
  name: string
  url: string
}

export class Constants {
  public static readonly userTable: string = 'viewer-3d-dev-user'
  public static readonly projectTable: string = 'viewer-3d-dev'
  public static readonly privateRoutes: itemHeaderProps[] = [
    {
      name: 'Progetti',
      url: '/projects',
    },
    {
      name: 'Cataloghi',
      url: '/catalogs',
    },
  ]
  public static readonly publicRoutes: itemHeaderProps[] = [
    {
      name: 'Dashboard',
      url: '/',
    },
  ]
}
